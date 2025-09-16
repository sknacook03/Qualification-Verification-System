import React from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import styles from "./Contact.module.css";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaMobileAlt, 
  FaEnvelope, 
  FaGlobe, 
  FaFacebook,
  FaUserTie 
} from "react-icons/fa";

function Contact() {
  
  return (
    <div className={styles.appContainer}>
      <Header />

      <div className={styles.heroSection}>
        <div className={styles.glassCard}>
          {/* LEFT: Info */}
          <div className={styles.infoSection}>
            <h2>
              <span className={styles.brandAccent}>Contact</span> RMUTI
              <br />
              <span className={styles.subTitle}>
                มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน นครราชสีมา
              </span>
            </h2>

            <ul className={styles.infoList} aria-label="ข้อมูลติดต่อหลัก">
              <li>
                <span className={styles.icon}><FaMapMarkerAlt /></span>
                744 ถนนสุรนารายณ์ ต.ในเมือง อ.เมือง จ.นครราชสีมา 30000
              </li>
              <li>
                <span className={styles.icon}><FaPhone /></span>
                <span className={styles.phoneTel}>044-233-000</span>
                <span className={styles.label}> ( ประชาสัมพันธ์: ต่อ 2751–2758 )</span>
              </li>
              <li>
                <span className={styles.icon}><FaMobileAlt /></span>
                085-537-6717
              </li>
              <li>
                <span className={styles.icon}><FaEnvelope /></span>
                <a href="mailto:adminregis@rmuti.ac.th" className={styles.link}>adminregis@rmuti.ac.th</a>
              </li>
              <li>
                <span className={styles.icon}><FaGlobe /></span>
                <a
                  href="https://regis.rmuti.ac.th/"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.regis.rmuti.ac.th
                </a>
              </li>
              <li>
                <span className={styles.icon}><FaFacebook /></span>
                <a
                  href="https://www.facebook.com/register112011"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  งานทะเบียนและประมวลผล มทร.อีสาน นครราชสีมา
                </a>
              </li>
            </ul>

            {/* CONTACT PERSON CARD */}
            <div className={styles.personCard} role="group" aria-label="ข้อมูลเจ้าหน้าที่ติดต่อ">
              <div className={styles.personHeader}>
                <div className={styles.avatar} aria-hidden><FaUserTie /></div>
                <div className={styles.personMeta}>
                  <div className={styles.personName}>คุณวรรณ์มณี บุญฟู</div>
                  <a
                    className={styles.personEmail}
                    href="mailto:wanmanee@rmuti.ac.th"
                    title="ส่งอีเมลถึงเจ้าหน้าที่"
                  >
                    wanmanee@rmuti.ac.th
                  </a>
                </div>
              </div>

              <div className={styles.tagList}>
                <span className={styles.tag}>แผนกงานตรวจสอบและรับรองผลการศึกษา</span>
                <span className={styles.tag}>งานทะเบียนและประมวลผล</span>
                <span className={styles.tag}>สำนักส่งเสริมวิชาการและงานทะเบียน</span>
              </div>

              <div className={styles.actions}>
                <a
                  className={styles.emailBtn}
                  href="mailto:wanmanee@rmuti.ac.th?subject=ติดต่อเรื่องการตรวจสอบผลการศึกษา"
                >
                  ✉️ อีเมลเจ้าหน้าที่
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Map */}
          <div className={styles.mapSection}>
            <iframe
              title="RMUTI Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7708.286515932381!2d102.11664351926781!3d14.984750769875907!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31194b80019e1771%3A0xc6979e02d8d878c7!2z4Lih4Lir4Liy4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Lij4Liy4LiK4Lih4LiH4LiE4Lil4Lit4Li14Liq4Liy4LiZICjguKrguLjguKPguJnguLLguKPguLLguKLguJPguYwp!5e0!3m2!1sth!2sth!4v1754161906378!5m2!1sth!2sth"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "20px", minHeight: "320px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default Contact;
