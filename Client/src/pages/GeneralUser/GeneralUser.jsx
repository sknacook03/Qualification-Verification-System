import React from "react";
import LayoutAllpage from "../../components/LayoutAllPage/LayoutAllPage.jsx";
import AccessStatistics from "../../hooks/AccessStatistics/AccessStatistics.jsx";
import Icon from "../../assets/statistics.png";
import styles from "./GeneralUser.module.css";
import {
  topMenuItems,
} from "../../constants/userMenuItems.jsx";

function GeneralUser() {
  return (
    <LayoutAllpage
      generalUser
      topMenuItems={topMenuItems}
      icon={Icon}
      label="สถิติการเข้าถึง"
      guest
    >
      <AccessStatistics />
    </LayoutAllpage>
  );
}

export default GeneralUser;
