import "./footer.css";
import { Link } from "react-router-dom";

function Footer({ color, disableMenu }) {
  return (
    <>
      <footer className="contrainer-footer">
        <div className="copy">
          <h5 style={{ color: color }}>
            Developed by Khon Rak Khrop Khrua and Khon Chao Choo © Rajamangala
            University of Technology Isan 2024 - ระบบตรวจสอบคุณวุฒิ
          </h5>
        </div>
        {!disableMenu && (
          <div className="option">
            <Link to="/LoginOfficer" style={{ color: color }}>
              สำหรับเจ้าหน้าที่
            </Link>
            <Link to="/terms-of-Use" style={{ color: color }}>
              ข้อตกลงการใช้ระบบ
            </Link>
            <Link to="/contact" style={{ color: color }}>
              ติดต่อ
            </Link>
          </div>
        )}
      </footer>
    </>
  );
}

export default Footer;
