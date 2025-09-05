export const topMenuItems = [
  { label: "หน้าหลัก", route: "/HomepagesOfficer" },
  { label: "ตรวจสอบคุณวุฒิ", route: "/CheckQualificationsOfficer" },
  { label: "สถิติการเข้าถึง", route: "/AccessStatisticsPageOfficer" },
  { label: "จัดการหน่วยงาน", route: "/AgencyControlPanel" },
  { label: "จัดการเจ้าหน้าที่", route: "/OfficerControlPanel" },
  { label: "จัดการผู้สำเร็จการศึกษา", route: "/StudentControlPanel" },
  { label: "จัดการทั่วไป", route: "/GeneralControlPanel" },
];

export const bottomMenuItems = (logout) => [
  { label: "แก้ไขข้อมูลส่วนตัว", route: "/PrivacySettingsPageOfficer" },
  { label: "ออกจากระบบ", onClick: logout },
];
