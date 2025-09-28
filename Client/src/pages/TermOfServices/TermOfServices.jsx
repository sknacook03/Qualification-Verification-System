import React, { useState } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import styles from "./TermOfServices.module.css";

function TermOfServices() {
  const [language, setLanguage] = useState("th");

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.pageContent}>
        <div className={styles.termsBox}>
          <div className={styles.languageSelector}>
            <div className={styles.langButton}>
              <div
                className={`${styles.langSide} ${
                  language === "th" ? styles.active : ""
                }`}
                onClick={() => setLanguage("th")}
              >
                TH
              </div>
              <div
                className={`${styles.langSide} ${
                  language === "en" ? styles.active : ""
                }`}
                onClick={() => setLanguage("en")}
              >
                EN
              </div>
            </div>
          </div>
          {language === "th" ? (
            <>
              <h2 className={styles.termsTitle}>📝 ข้อตกลงในการใช้บริการ</h2>
              <p className={styles.termsSubtitle}>
                ระบบตรวจสอบคุณวุฒิการศึกษาของมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน
                นครราชสีมา
              </p>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>1. วัตถุประสงค์ของระบบ</h3>
                <p className={styles.termsText}>
                  ระบบนี้จัดทำขึ้นเพื่อให้หน่วยงานภาครัฐ เอกชน รัฐวิสาหกิจ
                  หรือบุคคลทั่วไปที่ได้รับอนุญาต
                  สามารถตรวจสอบคุณวุฒิของผู้สำเร็จการศึกษาจากมหาวิทยาลัยได้อย่างถูกต้อง
                  โปร่งใส และปลอดภัย
                </p>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>2. เงื่อนไขการใช้งาน</h3>
                <ul className={styles.termsList}>
                  <li>
                    2.1 ใช้งานระบบเพื่อวัตถุประสงค์ที่ถูกต้องตามกฎหมายเท่านั้น
                  </li>
                  <li>2.2 ต้องให้ข้อมูลที่เป็นจริงและรับผิดชอบต่อการใช้งาน</li>
                  <li>2.3 ห้ามละเมิดสิทธิส่วนบุคคลหรือทำให้ระบบเสียหาย</li>
                  <li>2.4 บางข้อมูลเข้าถึงได้เฉพาะผู้ที่ได้รับอนุญาต</li>
                </ul>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>
                  3. การให้ความยินยอมและ PDPA
                </h3>
                <ul className={styles.termsList}>
                  <li>
                    3.1 ยินยอมให้มหาวิทยาลัยเก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคล
                  </li>
                  <li>
                    3.2 ข้อมูลที่เก็บ เช่น อีเมล ชื่อหน่วยงาน ที่อยู่ เบอร์โทร
                    หนังสือรับรอง
                  </li>
                  <li>
                    3.3 มหาวิทยาลัยจะไม่เปิดเผยข้อมูล
                    เว้นแต่มีความยินยอมหรือข้อกฎหมาย
                  </li>
                  <li>
                    3.4 ผู้ใช้งานระบบมีสิทธิ์เข้าถึงหรือแก้ไขข้อมูลของตนเองได้
                  </li>
                  <li>3.5 มีมาตรการรักษาความปลอดภัยของข้อมูล</li>
                </ul>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>
                  4. การเปลี่ยนแปลงหรือยกเลิกบริการ
                </h3>
                <p className={styles.termsText}>
                  มหาวิทยาลัยขอสงวนสิทธิ์ในการปรับปรุง แก้ไข
                  หรือยกเลิกการให้บริการระบบ โดยไม่จำเป็นต้องแจ้งล่วงหน้า
                </p>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>
                  5. ข้อจำกัดความรับผิดชอบ
                </h3>
                <p className={styles.termsText}>
                  มหาวิทยาลัยจะไม่รับผิดชอบหากใช้ข้อมูลในระบบผิดวัตถุประสงค์นอกจากการตรวจสอบคุณวุฒิ
                </p>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>6. การยอมรับข้อตกลง</h3>
                <p className={styles.termsText}>
                  การใช้งานระบบนี้ถือว่าผู้ใช้ได้อ่านและยอมรับข้อตกลงนี้อย่างสมบูรณ์
                  และให้ความยินยอมในการเก็บข้อมูลตาม PDPA
                </p>
              </section>
            </>
          ) : (
            <>
              <h2 className={styles.termsTitle}>📝 Terms of Service</h2>
              <p className={styles.termsSubtitle}>
                Educational Qualification Verification System – Rajamangala
                University of Technology Isan, Nakhon Ratchasima
              </p>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>
                  1. Purpose of the System
                </h3>
                <p className={styles.termsText}>
                  This system has been developed to enable authorized government
                  agencies, private organizations, state enterprises, and
                  members of the public to verify the academic qualifications of
                  university graduates accurately, transparently, and securely.
                </p>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>2. Terms of Use</h3>
                <ul className={styles.termsList}>
                  <li>
                    2.1 The system must be used for lawful and appropriate
                    purposes only.
                  </li>
                  <li>
                    2.2 Users must provide true and accurate information and are
                    responsible for their actions.
                  </li>
                  <li>
                    2.3 Unauthorized access or misuse of the system is
                    prohibited.
                  </li>
                  <li>2.4 Some data is restricted to authorized users only.</li>
                </ul>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>3. Consent and PDPA</h3>
                <ul className={styles.termsList}>
                  <li>
                    3.1 Users give explicit consent to collect, use, and
                    disclose personal data.
                  </li>
                  <li>
                    3.2 Collected data includes email address, organization
                    name, address, phone number, and letters of certification.
                  </li>
                  <li>
                    3.3 The University will not disclose information unless
                    consent has been obtained or disclosure is required by law.
                  </li>
                  <li>
                    3.4 System users have the right to access and correct their
                    own information.
                  </li>
                  <li>
                    3.5 Data is protected under standard security practices.
                  </li>
                </ul>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>
                  4. Changes or Discontinuation
                </h3>
                <p className={styles.termsText}>
                  The university reserves the right to change, suspend, or
                  terminate this service at any time without prior notice.
                </p>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>
                  5. Limitation of Liability
                </h3>
                <p className={styles.termsText}>
                  The University shall not be liable for any use of data in the
                  system for purposes other than verifying academic
                  qualifications.
                </p>
              </section>
              <section className={styles.termsSection}>
                <h3 className={styles.termsHeading}>6. Acceptance of Terms</h3>
                <p className={styles.termsText}>
                  By using this system, users acknowledge and accept all terms
                  and give consent according to PDPA.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermOfServices;
