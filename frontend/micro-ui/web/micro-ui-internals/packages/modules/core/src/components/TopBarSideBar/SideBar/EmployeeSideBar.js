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
  CaseIcon,
} from "@egovernments/digit-ui-react-components";
import { checkForEmployee } from "../../../../../tl/src/utils";
import { Link } from "react-router-dom";
const EmployeeSideBar = () => {
  const sidebarRef = useRef(null);
  const { t } = useTranslation();
  const userRoles = Digit.SessionStorage.get("User")?.info?.roles;
  const DSS = userRoles.find((role) => role.code === "EMPLOYEE");
  const HRMS = Digit.Utils.hrmsAccess();
  const FSM = Digit.Utils.fsmAccess();
  const PT = Digit.Utils.ptAccess();
  const mCollect = Digit.Utils.mCollectAccess();
  const RECEIPTS = Digit.Utils.receiptsAccess();
  const TL = Digit.Utils.tlAccess();
  const NOC = Digit.Utils.NOCAccess();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const COLLECTOR = Digit.UserService.hasAccess("FSM_COLLECTOR") || false;
  const FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;
  const FSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const PGR = Digit.Utils.pgrAccess();

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

  let links = [
    {
      label: t("ES_COMMON_INBOX"),
      link: `/digit-ui/employee/tl/inbox`,
    },
    {
      label: t("TL_NEW_APPLICATION"),
      link: "/digit-ui/employee/tl/new-application",
      role: "TL_CEMP",
    },
    {
      label: t("TL_SEARCH_APPLICATIONS"),
      link: `/digit-ui/employee/tl/search/application`,
    },
    {
      label: t("TL_SEARCH_LICENSE"),
      link: `/digit-ui/employee/tl/search/license`,
      role: "TL_CEMP",
    },
  ];

  let propsForCSR = [
    {
      label: t("ES_PGR_NEW_COMPLAINT"),
      link: `/digit-ui/employee/pgr/complaint/create`,
      role: "CSR",
    },
  ];

  links = links.filter((link) => (link.role ? checkForEmployee(link.role) : true));
  propsForCSR = propsForCSR.filter((link) => link.role && Digit.Utils.didEmployeeHasRole(link.role));

  let menuItems = [...EmployeeSideBarMenu(t, HRMS, FSM, PT, mCollect, DSS, RECEIPTS, TL, NOC, FSTPOperator, PGR)];
  let index = menuItems.findIndex((item) => item.moduleName === "Trade License");

  if (index !== -1) {
    menuItems[index].links = [...menuItems[index].links, ...links];
  } else {
    menuItems.push({
      Icon: <CaseIcon />,
      moduleName: "Trade License",
      links: links,
    });
  }
  menuItems.unshift({
    type: "link",
    Icon: <HomeIcon />,
    moduleName: t("ES_COMMON_HOME"),
    link: "/digit-ui/employee/",
  });

  //append the  propsForCSR to the PGR module
  let pgrIndex = menuItems.findIndex((item) => item.moduleName === "Complaint");
  if (pgrIndex !== -1) {
    menuItems[pgrIndex].links = [...menuItems[pgrIndex].links, ...propsForCSR];
  } else {
    menuItems.push({
      Icon: <CaseIcon />,
      moduleName: "PGR",
      links: propsForCSR,
    });
  }

  // const linksForSomeFSMEmployees =
  //   !DSO && !COLLECTOR && !FSM_EDITOR
  //     ? [
  //         {
  //           label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
  //           link: `/digit-ui/employee/fsm/new-application`,
  //         },
  //       ]
  //     : [];

  // let index1 = menuItems.findIndex((item) => item.moduleName === "FAECAL SLUDEG MGMT");
  // if (index1 !== -1) {
  //   menuItems[index1].links = [...menuItems[index1].links, ...linksForSomeFSMEmployees];
  // } else {
  //   menuItems.push({
  //     links: linksForSomeFSMEmployees,
  //   });
  // }
  let result = menuItems.filter((e) => e);

  return (
    <div className="sidebar" ref={sidebarRef} onMouseOver={expandNav} onMouseLeave={collapseNav}>
      {result.map((item, index) => {
        if (item.type === "link") {
          return (
            <div className="sidebar-link">
              <div className="actions">
                <Link to={item.link} key={index}>
                  {item.Icon}
                  <span>{item.moduleName}</span>
                </Link>
              </div>
            </div>
          );
        } else {
          return <SubMenu item={item} key={index} />;
        }
      })}
    </div>
  );
};

export default EmployeeSideBar;
