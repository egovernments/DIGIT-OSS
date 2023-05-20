import React, { useRef, useEffect, useState } from "react";
import SubMenu from "./SubMenu";
import { Loader, SearchIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const checkMatch=(path="",searchCriteria="")=>(path.toLowerCase().includes(searchCriteria.toLowerCase()))



const EmployeeSideBar = () => {
  const sidebarRef = useRef(null);
  const { isLoading, data } = Digit.Hooks.useAccessControl();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
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
    .forEach((item) => {
      let index = item?.path?.split(".")?.[0] || "";
      if (search == "" && item.path !== "") {
        index = item.path.split(".")[0];
        if (!configEmployeeSideBar[index]) {
          configEmployeeSideBar[index] = [item];
        } else {
          configEmployeeSideBar[index].push(item);
        }
      } else if (
       checkMatch(t(`ACTION_TEST_${index?.toUpperCase()?.replace(/[ -]/g, "_")}`),search) || checkMatch(t(Digit.Utils.locale.getTransformedLocale(`ACTION_TEST_${item?.displayName}`)),search)
      ) {
        index = item.path.split(".")[0];
        if (!configEmployeeSideBar[index]) {
          configEmployeeSideBar[index] = [item];
        } else {
          configEmployeeSideBar[index].push(item);
        }
      }
    });
  let res = [];
  const splitKeyValue = () => {
    const keys = Object.keys(configEmployeeSideBar);
    keys.sort((a, b) => a.orderNumber - b.orderNumber);
    for (let i = 0; i < keys.length; i++) {
      if (configEmployeeSideBar[keys[i]][0].path.indexOf(".") === -1) {
        if (configEmployeeSideBar[keys[i]][0].displayName === "Home") {
          const homeURL = `/${window?.contextPath}/employee`;
          res.unshift({
            moduleName: keys[i].toUpperCase(),
            icon: configEmployeeSideBar[keys[i]][0],
            navigationURL: homeURL,
            type: "single",
          });
        } else {
          res.push({
            moduleName: configEmployeeSideBar[keys[i]][0]?.displayName.toUpperCase(),
            type: "single",
            icon: configEmployeeSideBar[keys[i]][0],
            navigationURL: configEmployeeSideBar[keys[i]][0].navigationURL,
          });
        }
      } else {
        res.push({
          moduleName: keys[i].toUpperCase(),
          links: configEmployeeSideBar[keys[i]],
          icon: configEmployeeSideBar[keys[i]][0],
          orderNumber: configEmployeeSideBar[keys[i]][0].orderNumber,
        });
      }
    }
    if (res.find((a) => a.moduleName === "HOME")) {
      const home = res?.filter((ob) => ob?.moduleName === "HOME");
      let res1 = res?.filter((ob) => ob?.moduleName !== "HOME");
      res = res1.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
      home?.[0] && res.unshift(home[0]);
    } else {
      res.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
    }
    return res?.map((item, index) => {
      return <SubMenu item={item} key={index + 1} />;
    });
  };

  if (isLoading) {
    return <Loader />;
  }
  if (!res) {
    return "";
  }

  const renderSearch = () => {
    return (
      <div className="submenu-container">
        <div className="sidebar-link">
          <div className="actions search-icon-wrapper">
            <SearchIcon className="search-icon" />
            <input
              className="employee-search-input"
              type="text"
              placeholder={t(`ACTION_TEST_SEARCH`)}
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="sidebar" ref={sidebarRef} onMouseOver={expandNav} onMouseLeave={collapseNav}>
      {renderSearch()}
      {splitKeyValue()}
    </div>
  );
};

export default EmployeeSideBar;
