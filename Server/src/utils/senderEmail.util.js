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
  // สำหรับ SSL/TLS options เพิ่มเติม
  tls: {
    // ไม่ reject unauthorized certificates (สำหรับ self-signed certificates)
    rejectUnauthorized: false
  }
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
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
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
