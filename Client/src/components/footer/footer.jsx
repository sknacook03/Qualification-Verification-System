import "./footer.css";
import { Link } from "react-router-dom";

function Footer({ color, disableMenu }) {
  return (
    <>
      <footer
        className={`contrainer-footer ${disableMenu ? "center-content" : ""}`}
      >
        <div className="copy">
          <h5 style={{ color: color }}>
            © 2024 Rajamangala University of
            Technology Isan, Nakhon Ratchasima – ระบบตรวจสอบคุณวุฒิการศึกษา
          </h5>
        </div>
        {!disableMenu && (
          <div className="option">
            <Link to="/LoginOfficer" style={{ color: color }}>
              สำหรับเจ้าหน้าที่
            </Link>
            <Link to="/Term-of-Services" style={{ color: color }}>
              ข้อตกลงการใช้ระบบ
            </Link>
            <Link to="/Contact" style={{ color: color }}>
              ติดต่อ
            </Link>
          </div>
        )}
      </footer>
    </>
  );
}

export default Footer;
