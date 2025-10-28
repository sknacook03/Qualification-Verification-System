import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/senderEmail.util.js";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const sendResetPasswordEmail = async (email, resetCode) => {
  const subject = "รหัสยืนยันตัวตนจากระบบตรวจสอบคุณวุฒิ";
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #f2f2f2;
            border: 1px solid #dddddd;
            border-radius: 8px;
            padding: 20px;
        }
        .header {
            padding: 1.3rem;
            text-align: center;
            margin-bottom: 20px;
            background-color: #ff7100;
            border-radius: 7px;
        }
        .header img {
            width: 100px;
        }
        .content {
            font-size: 14px;
            color: #333333;
            line-height: 1.8;
        }
        .content h1 {
            padding: 4rem;
            letter-spacing: 15px;
            border-radius: 10px;
            background-color: #f9f9f9;
            text-align: center;
            color: #3b3b3b;
            font-size: 42px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
            line-height: 1.5;
        }
    </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="${process.env.LOGO_URL}" alt="Logo">
            </div>
            <div class="content">
                <p>เรียน ผู้ใช้งานระบบตรวจสอบคุณวุฒิ,</p>
                <p>ท่านได้ทำการร้องขอการตั้งรหัสผ่านใหม่สำหรับบัญชีผู้ใช้งาน กรุณาใช้รหัสยืนยันตัวตนด้านล่างนี้:</p>
                <h1>${resetCode}</h1>
                <p>รหัสยืนยันนี้มีความปลอดภัยสูงและจะหมดอายุในเวลา 15 นาที</p>
                <p>หากท่านไม่ได้เป็นผู้ดำเนินการ กรุณาละเว้นอีเมลฉบับนี้ และแจ้งให้เราทราบทันที</p>
                <p>สำหรับการสอบถามเพิ่มเติม ท่านสามารถติดต่อทีมสนับสนุนระบบได้</p>
            </div>
            <div class="footer">
                <p>ด้วยความเคารพ</p>
                <p><strong>สำนักส่งเสริมวิชาการและงานทะเบียน มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</strong></p>
                <p>📍 ที่อยู่: 744 ถนนสุรนารายณ์ ตำบลในเมือง อำเภอเมือง นครราชสีมา 30000</p>
                <p>📞 โทรศัพท์: 044-233-000 | 📧 อีเมล: wanmanee@rmuti.ac.th</p>
                <p>👤 ผู้ดูแลระบบ: คุณวรรณ์มณี บุญฟู</p>
                <p><small>หมายเหตุ: อีเมลฉบับนี้ส่งโดยระบบอัตโนมัติ หากไม่ต้องการรับข่าวสาร <a href="#unsubscribe">คลิกที่นี่</a></small></p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, null, htmlContent);
};

export const sendApprovalEmail = async (email, agencyName) => {
  const subject = "ยินดีต้อนรับสู่ระบบตรวจสอบคุณวุฒิ - การสมัครได้รับอนุมัติแล้ว";
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #f2f2f2;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff7100;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 14px;
            line-height: 1.8;
            color: #333;
            margin: 10px 0;
        }
        .content a {
            font-size: 16px;
            color: #007bff;
            text-decoration: none;
        }
        .content a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
            padding: 10px 0;
        }
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${process.env.LOGO_URL}" alt="Logo">
            </div>
            <div class="content">
                <p>เรียน ผู้แทนหน่วยงาน ${agencyName}</p>
                <p>ทางมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน ขอแสดงความยินดีที่จะแจ้งให้ท่านทราบว่า</p>
                <p><strong>การสมัครเข้าใช้งานระบบตรวจสอบคุณวุฒิของท่านได้รับการอนุมัติเรียบร้อยแล้ว</strong></p>
                <p>ท่านสามารถเข้าใช้งานระบบได้แล้วที่ลิงก์ด้านล่างนี้:</p>
                <p>🔗 <a href="${process.env.FRONTEND_URL}/eduverify/" style="color: #ff7100; text-decoration: none;">เข้าสู่ระบบตรวจสอบคุณวุฒิ</a></p>
                <p>ระบบของเราพร้อมให้บริการตรวจสอบคุณวุฒิการศึกษาของบุคลากรในหน่วยงานของท่าน</p>
                <p>หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อทีมสนับสนุน</p>
            </div>
            <div class="footer">
                <p>ด้วยความเคารพ</p>
                <p><strong>สำนักส่งเสริมวิชาการและงานทะเบียน มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</strong></p>
                <p>📍 744 ถนนสุรนารายณ์ ตำบลในเมือง อำเภอเมือง นครราชสีมา 30000</p>
                <p>📞 044-233-000 | 📧 wanmanee@rmuti.ac.th</p>
                <p>👤 ผู้ดูแลระบบ: คุณวรรณ์มณี บุญฟู</p>
                <p><small>© 2024 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน | <a href="#unsubscribe">ยกเลิกการรับข่าวสาร</a></small></p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, null, htmlContent);
};

export const sendRejectionEmail = async (email, agencyName, reason, agencyId) => {
    const token = jwt.sign({ id: agencyId, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const editLink = `${process.env.FRONTEND_URL}/eduverify/Editregister?token=${token}`;
    const subject = "แจ้งการปรับปรุงข้อมูลการสมัคร - ระบบตรวจสอบคุณวุฒิ";
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="th">
        <head>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background: #f2f2f2;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #ff7100;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .header img {
                max-width: 100px;
                margin-bottom: 10px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                font-size: 16px;
                line-height: 1.8;
                color: #333;
                margin: 10px 0;
            }
            .content .reason {
                font-weight: bold;
                color: #d9534f;
                margin-top: 15px;
                background-color: #fff3cd;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #ffc107;
            }
            .content a {
                font-size: 16px;
                color: #007bff;
                text-decoration: none;
            }
            .content a:hover {
                text-decoration: underline;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                margin-top: 20px;
                padding: 10px 0;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="${process.env.LOGO_URL}" alt="Logo">
                </div>
                <div class="content">
                    <p>เรียน ผู้แทนหน่วยงาน ${agencyName}</p>
                    <p>ทางมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน ขอแจ้งให้ท่านทราบเกี่ยวกับการสมัครเข้าใช้งานระบบตรวจสอบคุณวุฒิ</p>
                    <p><strong>เพื่อให้การดำเนินการเป็นไปอย่างสมบูรณ์ กรุณาปรับปรุงข้อมูลตามรายละเอียดด้านล่าง:</strong></p>
                    <div class="reason">📝 รายละเอียดที่ต้องปรับปรุง: ${reason}</div>
                    <p>กรุณาคลิกลิงก์ด้านล่างเพื่อเข้าสู่ระบบและปรับปรุงข้อมูลให้ถูกต้อง:</p>
                    <p>🔗 <a href="${editLink}" style="color: #ff7100; text-decoration: none;">แก้ไขข้อมูลการสมัคร</a></p>
                    <p>เมื่อท่านได้ปรับปรุงข้อมูลเรียบร้อยแล้ว ระบบจะดำเนินการตรวจสอบและอนุมัติอีกครั้ง</p>
                    <p>หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อทีมสนับสนุนของเรา</p>
                </div>
                <div class="footer">
                    <p>ด้วยความเคารพ</p>
                    <p><strong>สำนักส่งเสริมวิชาการและงานทะเบียน มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</strong></p>
                    <p>📍 744 ถนนสุรนารายณ์ ตำบลในเมือง อำเภอเมือง นครราชสีมา 30000</p>
                    <p>📞 044-233-000 | 📧 wanmanee@rmuti.ac.th</p>
                    <p>👤 ผู้ดูแลระบบ: คุณวรรณ์มณี บุญฟู</p>
                    <p><small>© 2024 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน | <a href="#unsubscribe">ยกเลิกการรับข่าวสาร</a></small></p>
                </div>
            </div>
        </body>
        </html>
      `;
  
    await sendEmail(email, subject, null, htmlContent);
};

export const sendAgencyCreate = async (email, officerName, agencyName) => {
  const subject = "แจ้งการสมัครใหม่ - ระบบตรวจสอบคุณวุฒิ";
  const htmlContent = `
        <!DOCTYPE html>
    <html lang="th">
    <head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #f2f2f2;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff7100;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            margin: 10px 0;
        }
        .content p strong {
             font-size: 18px;
             color: #ff7100;
        }
        .content a {
            font-size: 16px;
            color: #007bff;
            text-decoration: none;
        }
        .content a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
            padding: 10px 0;
        }
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${process.env.LOGO_URL}" alt="Logo">
            </div>
            <div class="content">
                <p>เรียน คุณ${officerName} (เจ้าหน้าที่ระบบ)</p>
                <p>ขณะนี้มีการสมัครเข้าใช้งานระบบตรวจสอบคุณวุฒิใหม่</p>
                <p>ชื่อหน่วยงาน: <strong>${agencyName}</strong></p>
                <p>กรุณาเข้าสู่ระบบเพื่อตรวจสอบและพิจารณาอนุมัติการสมัครดังกล่าว</p>
                <p>🔗 <a href="${process.env.FRONTEND_URL}/eduverify/" style="color: #ff7100; text-decoration: none;">เข้าสู่ระบบจัดการ</a></p>
            </div>
            <div class="footer">
                <p><strong>ระบบแจ้งเตือนอัตโนมัติ - ระบบตรวจสอบคุณวุฒิ</strong></p>
                <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</p>
                <p><small>© 2024 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</small></p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await sendEmail(email, subject, null, htmlContent);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendAgencyUpdateNotification = async (email, officerName, agencyName) => {
  const subject = "แจ้งการปรับปรุงข้อมูลเสร็จสิ้น - ระบบตรวจสอบคุณวุฒิ";
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #f2f2f2;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff7100;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            margin: 10px 0;
        }
        .content p strong {
             font-size: 18px;
             color: #ff7100;
        }
        .content a {
            font-size: 16px;
            color: #007bff;
            text-decoration: none;
        }
        .content a:hover {
            text-decoration: underline;
        }
        .notification-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 4px solid #ff7100;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
            padding: 10px 0;
        }
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${process.env.LOGO_URL}" alt="Logo">
            </div>
            <div class="content">
                <p>เรียน คุณ${officerName} (เจ้าหน้าที่ระบบ)</p>
                <p>ขอแจ้งให้ทราบว่าหน่วยงานได้ดำเนินการปรับปรุงข้อมูลเรียบร้อยแล้ว</p>
                <div class="notification-box">
                    <p>✅ <strong>หน่วยงาน: ${agencyName}</strong></p>
                    <p>📅 สถานะ: ปรับปรุงข้อมูลเสร็จสิ้น รอการตรวจสอบ</p>
                </div>
                <p>กรุณาเข้าสู่ระบบเพื่อตรวจสอบข้อมูลที่ได้รับการปรับปรุงและพิจารณาอนุมัติ</p>
                <p>🔗 <a href="${process.env.FRONTEND_URL}/eduverify/" style="color: #ff7100; text-decoration: none;">เข้าสู่ระบบจัดการ</a></p>
                <p><small>ข้อมูลนี้ได้รับการปรับปรุงตามคำแนะนำที่ให้ไว้ กรุณาตรวจสอบความถูกต้องและครบถ้วน</small></p>
            </div>
            <div class="footer">
                <p><strong>ระบบแจ้งเตือนอัตโนมัติ - ระบบตรวจสอบคุณวุฒิ</strong></p>
                <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</p>
                <p><small>© 2024 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</small></p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await sendEmail(email, subject, null, htmlContent);
  } catch (error) {
    console.error("Error sending update notification email:", error);
    throw new Error("Failed to send update notification email");
  }
};
