const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

(async () => {
  // 用系统自带的 chrome-stable
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox','--disable-gpu']
  });

    // 2) 等待占用率元素出现
    await page.waitForSelector('#fs-livedata-percentage', { timeout: 15000 });

    // 3) 再等它“写入”数字（检测 innerText 中至少含有一个数字）
    await page.waitForFunction(
      () => {
        const el = document.querySelector('#fs-livedata-percentage');
        return el && /\d/.test(el.innerText);
      },
      { timeout: 15000 }
    );

    // 4) 取到最终数字
    const percentage = await page.$eval(
      '#fs-livedata-percentage',
      el => el.innerText.trim()
    );

    // 5) 配置 SMTP transporter
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // 6) 发送邮件
    await transporter.sendMail({
      from:    `"FitStar Bot" <${process.env.SMTP_USER}>`,
      to:      process.env.TO_EMAIL,
      subject: 'Gym Occupancy',
      text:    `Neuhausen München ：${percentage}`
    });

    console.log(`占用率邮件已发送，数值：${percentage}`);
    await browser.close();
  } catch (err) {
    console.error('脚本执行出错：', err);
    process.exit(1);
  }
})();
