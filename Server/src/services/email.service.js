import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/senderEmail.util.js";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const sendResetPasswordEmail = async (email, resetCode) => {
  const subject = "Password Reset Code";
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
                <img src="https://sci.rmuti.ac.th/main/wp-content/uploads/2022/02/unnamed-1-270x300.png" alt="Logo">
            </div>
            <div class="content">
                <p>เรียนคุณผู้ใช้งาน,</p>
                <p>เราได้รับคำขอรีเซ็ตรหัสผ่านของคุณ กรุณาใช้รหัสยืนยันด้านล่างเพื่อดำเนินการ:</p>
                <h1>${resetCode}</h1>
                <p>หากคุณไม่ได้เป็นผู้ร้องขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลฉบับนี้</p>
                <p>หากคุณมีข้อสงสัยเพิ่มเติม สามารถติดต่อฝ่ายสนับสนุนของเราได้ทันที</p>
            </div>
            <div class="footer">
                <p>ขอแสดงความนับถือ</p>
                <p><strong>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</strong></p>
                <p>อีเมลนี้ส่งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, null, htmlContent);
};

export const sendApprovalEmail = async (email, agencyName) => {
  const subject = "Approval Confirmation";
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
                <img src="https://sci.rmuti.ac.th/main/wp-content/uploads/2022/02/unnamed-1-270x300.png" alt="RMUTI Logo">
            </div>
            <div class="content">
                <p>เรียนคุณ ${agencyName},</p>
                <p>เรามีความยินดีที่จะแจ้งให้คุณทราบว่า คำขอของคุณได้รับการอนุมัติเรียบร้อยแล้ว</p>
                <p>คุณสามารถเข้าสู่ระบบได้โดยใช้ลิงก์ด้านล่าง:</p>
                <p><a href="http://localhost:5173/">http://localhost:5173/</a></p>
            </div>
            <div class="footer">
                <p>© 2024 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</p>
                <p>อีเมลนี้ส่งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
            </div>
        </div>
    </body>
    </html>

    `;

  await sendEmail(email, subject, null, htmlContent);
};

export const sendRejectionEmail = async (email, agencyName, reason, agencyId) => {
    console.log("🔹 agencyId ที่ได้รับ:", agencyId); 
    console.log("🔹 reason ที่ได้รับ:", reason); 
    console.log("🔹 email:", email);
    console.log("🔹 agencyName:", agencyName);
    const token = jwt.sign({ id: agencyId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const editLink = `http://localhost:5173/Editregister?token=${token}`;
    const subject = "Request Rejection Notification";
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
                    <img src="https://sci.rmuti.ac.th/main/wp-content/uploads/2022/02/unnamed-1-270x300.png" alt="RMUTI Logo">
                </div>
                <div class="content">
                    <p>เรียนคุณ ${agencyName},</p>
                    <p>เราขอแจ้งให้ทราบว่า คำขอของคุณไม่ได้รับการอนุมัติด้วยเหตุผลดังต่อไปนี้:</p>
                    <p class="reason">${reason}</p>
                    <p>กรุณาคลิกลิงก์ด้านล่างเพื่อเข้าสู่ระบบและแก้ไขข้อมูลที่ผิดพลาด:</p>
                    <p><p><a href="${editLink}">http://localhost:5173/Editregister</a></p></p>
                    <p>หากคุณมีข้อสงสัยเพิ่มเติม กรุณาติดต่อฝ่ายสนับสนุนของเรา</p>
                </div>
                <div class="footer">
                    <p>© 2024 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</p>
                    <p>อีเมลนี้ส่งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
                </div>
            </div>
        </body>
        </html>
  
      `;
  
    await sendEmail(email, subject, null, htmlContent);
  };