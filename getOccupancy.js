const puppeteer = require('puppeteer-core');
const nodemailer = require('nodemailer');

(async () => {
  try {
    // 1) 启动无头浏览器并打开页面
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome-stable',
      args: ['--no-sandbox', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.goto(
      'https://www.fit-star.de/fitnessstudio/muenchen-neuhausen',
      { waitUntil: 'networkidle2' }
    );

    // 2) 等待占用率元素出现并包含数字
    await page.waitForSelector('#fs-livedata-percentage', { timeout: 15000 });
    await page.waitForFunction(
      () => /\d/.test(document.querySelector('#fs-livedata-percentage')?.innerText),
      { timeout: 15000 }
    );

    // 3) 读取占用率文本
    const percentage = await page.$eval(
      '#fs-livedata-percentage',
      el => el.innerText.trim()
    );

    // 4) 初始化邮件客户端
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // 5) 发送邮件
    await transporter.sendMail({
      from:    `"FitStar Bot" <${process.env.SMTP_USER}>`,
      to:      process.env.TO_EMAIL,
      subject: 'Gym Occupancy Rate Report',
      text:    `Neuhausen München: ${percentage}%`
    });

    console.log(`邮件已发送，当前占用率：${percentage}`);
    await browser.close();
  } catch (err) {
    console.error('脚本执行出错：', err);
    process.exit(1);
  }
})();
