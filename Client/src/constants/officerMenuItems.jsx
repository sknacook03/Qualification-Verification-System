export const topMenuItems = [
  { label: "หน้าหลัก", route: "/HomepagesOfficer" },
  { label: "ตรวจสอบคุณวุฒินักศึกษา", route: "/CheckQualificationsOfficer" },
  { label: "สถิติการเข้าถึง", route: "/" },
  { label: "จัดการหน่วยงาน", route: "/AgencyControlPanel" },
  { label: "จัดการเจ้าหน้าที่", route: "/" },
  { label: "จัดการนักศึกษา", route: "/" },
];

export const bottomMenuItems = (logout) => [
  { label: "ตั้งค่าความเป็นส่วนตัว", route: "/" },
  { label: "ออกจากระบบ", onClick: logout },
];
