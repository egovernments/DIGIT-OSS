import React, { useRef, useEffect } from "react";
import EmployeeSideBarMenu from "../../../config/employee-sidebar-menu";
import SubMenu from "./SubMenu";

const EmployeeSideBar = () => {
  const sidebarRef = useRef(null);

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

  return (
    <div className="sidebar" ref={sidebarRef} onMouseOver={expandNav} onMouseLeave={collapseNav}>
      {EmployeeSideBarMenu.map((item, index) => {
        return <SubMenu item={item} key={index} />;
      })}
    </div>
  );
};

export default EmployeeSideBar;
