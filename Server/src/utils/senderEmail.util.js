import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
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

export const sendEmail = async (to, subject, text, html = null) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  };

  if (html) {
    mailOptions.html = html;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function สำหรับทดสอบการเชื่อมต่อ SMTP
export const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection successful');
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
};
