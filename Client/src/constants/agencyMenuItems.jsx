export const topMenuItems = [
  { label: "หน้าหลัก", route: "/Homepages" },
  { label: "ตรวจสอบคุณวุฒินักศึกษา", route: "/CheckQualificationsPage" },
  { label: "สถิติการเข้าถึง", route: "/AccessStatisticsPage" },
];

export const bottomMenuItems = (logout) => [
  { label: "ตั้งค่าความเป็นส่วนตัว", route: "/PrivacySettingsPage" },
  { label: "ออกจากระบบ", onClick: logout },
];
