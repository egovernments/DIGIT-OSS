import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SubMenu from "./SubMenu";
import { Loader } from "@egovernments/digit-ui-react-components";

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
  data?.actions
    .filter((e) => e.url === "url")
    .sort((a, b) => a.orderNumber - b.orderNumber)
    .forEach((item) => {
      if (item.path !== "") {
        let index = item.path.split(".")[0];
        if (index === "TradeLicense") index = "Trade License";
        if (!configEmployeeSideBar[index]) {
          configEmployeeSideBar[index] = [item];
        } else {
          configEmployeeSideBar[index].push(item);
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
      });
    }
    return res.map((item, index) => {
      return <SubMenu item={item} key={index} />;
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="sidebar" ref={sidebarRef} onMouseOver={expandNav} onMouseLeave={collapseNav}>
      {splitKeyValue()}
    </div>
  );
};

export default EmployeeSideBar;
