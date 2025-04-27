const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

(async () => {
  try {
    // 1) 启动无头浏览器并打开页面
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.fit-star.de/fitnessstudio/muenchen-neuhausen', {
      waitUntil: 'networkidle2'
    });

    // 2) 等待页面渲染完成并获取占用率数字
    await page.waitForSelector('#fs-livedata-percentage');
    const percentage = await page.$eval(
      '#fs-livedata-percentage',
      el => el.innerText.trim()
    );

    // 3) 配置 SMTP transporter
    const transporter = nodemailer.createTransport({
      host:     process.env.SMTP_HOST,
      port:     Number(process.env.SMTP_PORT),
      secure:   Number(process.env.SMTP_PORT) === 465, // 465 为 SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // 4) 发送邮件
    await transporter.sendMail({
      from:    `"FitStar Bot" <${process.env.SMTP_USER}>`,
      to:      process.env.TO_EMAIL,
      subject: '【19:30】健身房占用率报告',
      text:    `Neuhausen München 当前占用率：${percentage}`
    });

    console.log(`占用率邮件已发送：${percentage}`);
    await browser.close();
  } catch (err) {
    console.error('脚本执行出错：', err);
    process.exit(1);
  }
})();
