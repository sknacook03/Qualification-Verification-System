import logo from '../../assets/logo-rmuti.png';
import './header.css'
export default function Header() {
  return (
    <div className="-contrainer-header">
      <div className="-logo">
        <img src={logo} alt="logo" width={65} />
      </div>
      <div className="-info">
        <h4>ระบบตรวจสอบคุณวุติ</h4>
        <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</p>
      </div>
    </div>
  );
}
