import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  pool: true,
  maxConnections: 5, 
  maxMessages: 100, 
  rateDelta: 1000, 
  rateLimit: 5,
  tls: {
    rejectUnauthorized: false
  }
});


transporter.verify()
  .then(() => {
    console.log('✅ SMTP server is ready to send emails');
  })
  .catch((error) => {
    console.error('❌ SMTP server connection failed:', error.message);
  });

export const sendEmail = async (to, subject, text, html = null, attachments = null) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  };

  if (html) {
    mailOptions.html = html;
  }

  if (attachments) {
    mailOptions.attachments = attachments;
  }

  try {
    // No need to verify before each send - connection pool handles it
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
    });
    throw new Error(`Email sending failed: ${error.message}`);
  }
};
