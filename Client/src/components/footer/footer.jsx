import "./footer.css";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      <footer className="contrainer-footer">
        <div className="copy">
          <h5>
            © Rajamangala University of Technology Isan 2024 -
             ระบบตรวจสอบคุณวุฒิ
          </h5>
        </div>
        <div className="option">
          <Link to="/staff">สำหรับเจ้าหน้าที่</Link>
          <Link to="/terms-of-Use">ข้อตกลงการใช้ระบบ</Link>
          <Link to="/contact">ติดต่อ</Link>
        </div>
      </footer>
    </>
  );
}

export default Footer;