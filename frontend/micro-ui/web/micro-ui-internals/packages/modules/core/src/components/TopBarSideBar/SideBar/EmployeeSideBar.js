import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import EmployeeSideBarMenu from "../../../config/employee-sidebar-menu";
import SubMenu from "./SubMenu";
import { EventsIconSolid, HomeIcon, CaseIcon, ReceiptIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import { checkForEmployee } from "../../../../../tl/src/utils";
import { Link } from "react-router-dom";

const nationalScreenURLs = {
  propertytax: { key: "national-propertytax", stateKey: "propertytax", label: "ACTION_TEST_PROPERTY_TAX", active: false, nActive: true },
  tradelicense: { key: "national-tradelicense", stateKey: "tradelicense", label: "ACTION_TEST_TRADELICENSE", active: false, nActive: true },
  pgr: { key: "national-pgr", stateKey: "pgr", label: "ACTION_TEST_PGR", active: false, nActive: true },
  fsm: { key: "fsm", stateKey: "fsm", label: "ACTION_TEST_FSM", active: true, nActive: false },
  mCollect: { key: "national-mcollect", stateKey: "mCollect", label: "ACTION_TEST_MCOLLECT", active: true, nActive: true },
  ws: { key: "national-ws", stateKey: "ws", label: "ACTION_TEST_WATER_&_SEWERAGE", active: true, nActive: true },
  obps: { key: "nss-obps", stateKey: "obps", label: "CS_COMMON_OBPS", active: true, nActive: true },
  noc: { key: "national-firenoc", stateKey: "noc", label: "ACTION_TEST_FIRE_NOC", active: true, nActive: true },
  overview: { key: "national-overview", stateKey: "overview", label: "ACTION_TEST_OVERVIEW", active: false, nActive: false },
};

const EmployeeSideBar = () => {
  const sidebarRef = useRef(null);
  const { t } = useTranslation();
  const userRoles = Digit.SessionStorage.get("User")?.info?.roles;
  const DSS = userRoles.find((role) => role.code === "EMPLOYEE") || false;
  const HRMS = Digit.Utils.hrmsAccess();
  const FSM = Digit.Utils.fsmAccess();
  const PT = Digit.Utils.ptAccess();
  const mCollect = Digit.Utils.mCollectAccess();
  const RECEIPTS = Digit.Utils.receiptsAccess();
  const TL = Digit.Utils.tlAccess();
  const NOC = Digit.Utils.NOCAccess();
  const FSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const PGR = Digit.Utils.pgrAccess();
  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;
  const STADMIN = Digit.UserService.hasAccess("STADMIN");
  const NATADMIN = Digit.UserService.hasAccess("NATADMIN");

  useEffect(() => {
    sidebarRef.current.style.cursor = "pointer";
    collapseNav();
  }, []);

  const expandNav = () => {
    sidebarRef.current.style.width = "260px";
    sidebarRef.current.style.overflow = "auto";

    sidebarRef.current.querySelectorAll(".dropdown-link").forEach((element) => {
      element.style.display = "flex";
    });
  };
  const collapseNav = () => {
    sidebarRef.current.style.width = "55px";
    sidebarRef.current.style.overflow = "hidden";

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

  let ptProps = [
    {
      label: t("ES_COMMON_INBOX"),
      link: `/digit-ui/employee/pt/inbox`,
    },
    {
      label: t("SEARCH_PROPERTY"),
      link: `/digit-ui/employee/pt/search`,
    },
    {
      label: t("ES_COMMON_APPLICATION_SEARCH"),
      link: `/digit-ui/employee/pt/application-search`,
    },
  ];

  propsForCSR = propsForCSR.filter((link) => link.role && Digit.Utils.didEmployeeHasRole(link.role));

  let pgrLinks = [
    {
      label: t("ES_PGR_INBOX"),
      link: `/digit-ui/employee/pgr/inbox`,
    },
    ...propsForCSR,
  ];

  links = links.filter((link) => (link.role ? checkForEmployee(link.role) : true));
  
  let menuItems = [...EmployeeSideBarMenu(t, HRMS, FSM, PT, mCollect, DSS, RECEIPTS, TL, NOC, FSTPOperator, PGR, pgrLinks)];

  console.log(menuItems, DSS);
  
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

  let pgrIndex = menuItems.findIndex((item) => item.moduleName === "Complaints");
  if (pgrIndex !== -1) {
    if (!menuItems[pgrIndex].links) {
      menuItems[pgrIndex].links = [];
    }
    menuItems[pgrIndex].links = [...menuItems[pgrIndex].links, ...pgrLinks];
  } else {
    menuItems.push({
      Icon: <ReceiptIcon />,
      moduleName: "Complaints",
      links: pgrLinks,
    });
  }

  let ptIndex = menuItems.findIndex((item) => item.moduleName === "Property Tax");
  if (ptIndex !== -1) {
    if (!menuItems[ptIndex].links) {
      menuItems[ptIndex].links = [];
    }
    menuItems[ptIndex].links = [...menuItems[ptIndex].links, ...ptProps];
  }

  let nsLinks = Object.values(nationalScreenURLs)
    .filter((ele) => ele[NATADMIN ? "nActive" : "active"] == true)
    .map((obj) => ({
      label: t(obj?.label),
      link: `/digit-ui/employee/dss/dashboard/${NATADMIN ? obj?.key : obj?.stateKey}`,
    }));

  if (STADMIN && NATADMIN) {
    menuItems.push({
      Icon: <EventsIconSolid />,
      moduleName: NATADMIN ? t("ACTION_TEST_NATDASHBOARD") : t("ES_TITLE_DSS"),
      links: [...nsLinks],
    });
  }

  let result = menuItems.filter((ele) => ele);

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
