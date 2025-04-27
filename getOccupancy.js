cat > getOccupancy.js << 'EOF'
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page    = await browser.newPage();
  await page.goto('https://www.fit-star.de/fitnessstudio/muenchen-neuhausen', {
    waitUntil: 'networkidle2'
  });

  await page.waitForSelector('#fs-livedata-percentage');
  const percentage = await page.$eval('#fs-livedata-percentage', el => el.innerText.trim());

  const transporter = nodemailer.createTransport({
    host:     process.env.SMTP_HOST,
    port:     Number(process.env.SMTP_PORT),
    secure:   Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from:    \`"\${process.env.SMTP_USER}"\`,
    to:      process.env.TO_EMAIL,
    subject: '【19:30】健身房占用率报告',
    text:    \`Neuhausen München 当前占用率：\${percentage}\`
  });

  await browser.close();
})();
EOF
