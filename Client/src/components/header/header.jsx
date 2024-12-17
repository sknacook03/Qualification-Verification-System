import logo from "../../assets/Cassia-flowers-rmuti.png";
import { Link } from "react-router-dom";
import "./header.css";
function Header() {
  return (
    <div className="contrainer-header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" width={65} />
        </Link>
      </div>
      <div className="info">
        <h4>ระบบตรวจสอบคุณวุติ</h4>
        <p>มหาวิทยาลัยเทคโนโลยี ราชมงคลอีสาน</p>
      </div>
    </div>
  );
}
export default Header;
