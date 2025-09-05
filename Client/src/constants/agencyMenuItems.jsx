export const topMenuItems = [
  { label: "หน้าหลัก", route: "/Homepages" },
  { label: "ตรวจสอบคุณวุฒิ", route: "/CheckQualificationsPage" },
  { label: "สถิติการเข้าถึง", route: "/AccessStatisticsPage" },
];

export const bottomMenuItems = (logout) => [
  { label: "แก้ไขข้อมูลส่วนตัว", route: "/PrivacySettingsPage" },
  { label: "ออกจากระบบ", onClick: logout },
];
