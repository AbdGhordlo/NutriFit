const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:process.env.SMTP_HOST,        // smtp.gmail.com
  port:Number(process.env.SMTP_PORT),// 587
  secure:false,                        // TLS on STARTTLS
  auth: {
    user:process.env.SMTP_USER,          // your-gmail@gmail.com
    pass:process.env.SMTP_PASSWORD,      // your 16-char app password
  },
});

async function sendResetEmail(to, token) {
  return transporter.sendMail({
    from: `"NutriFit Support" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your NutriFit password reset code",
    text: `Your code is ${token}. It expires in 15 minutes.`,
  });
}

module.exports = { sendResetEmail };
