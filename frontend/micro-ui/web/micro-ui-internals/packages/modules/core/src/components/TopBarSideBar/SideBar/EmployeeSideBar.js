import React, { useRef, useEffect } from "react";
import SubMenu from "./SubMenu";
import {
  Loader,
  HomeIcon,
  ComplaintIcon,
  BPAHomeIcon,
  PropertyHouse,
  CaseIcon,
  ReceiptIcon,
  PersonIcon,
  DocumentIconSolid,
  DropIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
} from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const IconsObject = {
  home: <HomeIcon />,
  announcement: <ComplaintIcon />,
  business: <BPAHomeIcon />,
  store: <PropertyHouse />,
  assignment: <CaseIcon />,
  receipt: <ReceiptIcon />,
  "business-center": <PersonIcon />,
  description: <DocumentIconSolid />,
  "water-tap": <DropIcon />,
  "collections-bookmark": <CollectionsBookmarIcons />,
  "insert-chart": <FinanceChartIcon />,
  edcr: <CollectionIcon />,
  collections: <CollectionIcon />,
  "open-complaints": <ComplaintIcon />,
};
const EmployeeSideBar = () => {
  const sidebarRef = useRef(null);
  const { isLoading, data } = Digit.Hooks.useAccessControl();

  useEffect(() => {
    if (isLoading) {
      return <Loader />;
    }
    sidebarRef.current.style.cursor = "pointer";
    collapseNav();
  }, [isLoading]);

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

  const configEmployeeSideBar = {};
  const singleItem = [];
  data?.actions
    .filter((e) => e.url === "url")
    .sort((a, b) => a.orderNumber - b.orderNumber)
    .forEach((item) => {
      if (item.path !== "" && item.path.indexOf(".") !== -1) {
        let index = item.path.split(".")[0];
        if (index === "TradeLicense") index = "Trade License";
        if (!configEmployeeSideBar[index]) {
          configEmployeeSideBar[index] = [item];
        } else {
          configEmployeeSideBar[index].push(item);
        }
      } else {
        if (item.displayName === "Home") {
          item.navigationURL = "/digit-ui/employee";
          singleItem.unshift({
            displayName: item.displayName,
            navigationURL: item.navigationURL,
            icon: item.leftIcon,
            orderNumber: item.orderNumber,
          });
        }
        if (item.path !== "" && item.displayName !== "Home") {
          singleItem.push({
            displayName: item.displayName,
            navigationURL: item.navigationURL,
            icon: item.leftIcon,
            orderNumber: item.orderNumber,
          });
        }
      }
    });

  const splitKeyValue = () => {
    const keys = Object.keys(configEmployeeSideBar);
    const res = [];
    for (let i = 0; i < keys.length; i++) {
      res.push({
        moduleName: keys[i],
        links: configEmployeeSideBar[keys[i]],
        icon: configEmployeeSideBar[keys[i]][0],
        orderNumber: configEmployeeSideBar[keys[i]][0].orderNumber,
      });
    }
    return res
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map((item, index) => {
        return <SubMenu item={item} key={index} />;
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  const renderSingleItem = () => {
    return singleItem
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map((item) => {
        const leftIconArray = item.icon.split(":")[1];
        const leftIcon = leftIconArray ? IconsObject[leftIconArray] : IconsObject.collections;
        const getOrigin = window.location.origin;
        return (
          <div className="submenu-container">
            <div className={`sidebar-link`}>
              <div className="actions">
                {leftIcon}
                {item.navigationURL.indexOf("/digit-ui") === -1 ? (
                  <a className="custom-link" href={getOrigin + "/employee/" + item.navigationURL}>
                    {item.displayName}
                  </a>
                ) : (
                  <Link className="custom-link" to={item.navigationURL}>
                    {item.displayName}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      });
  };

  return (
    <div className="sidebar" ref={sidebarRef} onMouseOver={expandNav} onMouseLeave={collapseNav}>
      {renderSingleItem()}

      {splitKeyValue()}
    </div>
  );
};

export default EmployeeSideBar;
