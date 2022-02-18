import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import EmployeeSideBarMenu from "../../../config/employee-sidebar-menu";
import SubMenu from "./SubMenu";
import {
  PersonIcon,
  ShippingTruck,
  PTIcon,
  PMBIconSolid,
  EventsIconSolid,
  DocumentIconSolid,
  HomeIcon,
} from "@egovernments/digit-ui-react-components";

const EmployeeSideBar = ({ userDetails, modules }) => {
  const sidebarRef = useRef(null);
  const { t } = useTranslation();
  const ADMIN = Digit.Utils.hrmsAccess();
  const D = Digit.Utils.fsmAccess();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const COLLECTOR = Digit.UserService.hasAccess("FSM_COLLECTOR") || false;
  const FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;

  const userRoles = Digit.SessionStorage.get("User")?.info?.roles;

  const isEmployee = userRoles.find((role) => role.code === "EMPLOYEE");

  useEffect(() => {
    sidebarRef.current.style.cursor = "pointer";
    collapseNav();
  }, []);

  const expandNav = () => {
    sidebarRef.current.style.width = "260px";
    sidebarRef.current.querySelectorAll(".dropdown-link").forEach((element) => {
      element.style.display = "flex";
    });
  };
  const collapseNav = () => {
    sidebarRef.current.style.width = "55px";

    sidebarRef.current.querySelectorAll(".dropdown-link").forEach((element) => {
      element.style.display = "none";
    });
    sidebarRef.current.querySelectorAll(".actions").forEach((element) => {
      element.style.padding = "0";
    });
  };
  const p1 = {
    Icon: <ShippingTruck />,
    moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: `/digit-ui/employee/fsm/inbox`,
      },
      {
        label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
        link: `/digit-ui/employee/fsm/new-application`,
      },
    ],
  };
  const propsForModuleCard = {
    Icon: <PersonIcon />,
    moduleName: t("ACTION_TEST_HRMS"),

    links: [
      {
        label: t("HR_HOME_SEARCH_RESULTS_HEADING"),
        link: `/digit-ui/employee/hrms/inbox`,
      },
      {
        label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
        link: `/digit-ui/employee/hrms/create`,
      },
    ],
  };

  let menuItems = [...EmployeeSideBarMenu(t, ADMIN)];

  console.log("menuItems", menuItems);

  // if (ADMIN) {
  //   let p = [propsForModuleCard];
  //   return (
  //     <div className="sidebar" ref={sidebarRef} onMouseOver={expandNav} onMouseLeave={collapseNav}>
  //       {p.map((item, index) => {
  //         return <SubMenu item={item} key={index} />;
  //       })}

  //       {/* <SubMenu  item={...menu} /> */}
  //     </div>
  //   );
  // }

  //return sidebar base on user role from EmployeeSideBarMenu using switch case
  console.log({ D, ADMIN });

  //pass flag to check if user is employee or admin

  return (
    <div className="sidebar" ref={sidebarRef} onMouseOver={expandNav} onMouseLeave={collapseNav}>
      {menuItems.map((item, index) => {
        return <SubMenu item={item} key={index} />;
      })}

      {/* <SubMenu  item={...menu} /> */}
    </div>
  );
};

export default EmployeeSideBar;
