import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ToolTipWrapper = ({ child, label, t }) => (
  <span className="tooltip">
    {child}
    <span className="tooltiptext" style={{ fontSize: "14px", marginLeft: "0px", bottom: "20%" }}>
      <div style={{ background: "#555", width: "100%", padding: "5px", borderRadius: "6px", whiteSpace: "pre" }}>{t(label)}</div>
    </span>
  </span>
);

const EmployeeSideBar = () => {
  const STADMIN = Digit.UserService.hasAccess("STADMIN");
  const NATADMIN = Digit.UserService.hasAccess("NATADMIN");

  let key = "ACTION_TEST_HOME";

  if (STADMIN) {
    key = "ACTION_TEST_SURE_DASHBOARD";
  }
  if (NATADMIN) {
    key = "ACTION_TEST_NATDASHBOARD";
  }

  function getRedirectionUrl(){
    if (NATADMIN)
      return "/digit-ui/employee/payment/integration/dss/NURT_DASHBOARD";
    else if(STADMIN)
      return "/employee/integration/dss/home";
    else
      return "/employee";
  }

  const { t } = useTranslation();
  return (
    <div className="sidebar">
      <Link to="/digit-ui/employee">
        <div className="actions active">
          <ToolTipWrapper
            child={
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="white" />
              </svg>
            }
            t={t}
            label={"ACTION_TEST_HOME"}
          />
        </div>
      </Link>
      <a href={getRedirectionUrl()}>
        <div className="actions">
          <ToolTipWrapper
            child={
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M8.17 5.7L1 10.48V21h5v-8h4v8h5V10.25z" fill="white" />
                <path d="M17 7h2v2h-2z" fill="none" />
                <path d="M10 3v1.51l2 1.33L13.73 7H15v.85l2 1.34V11h2v2h-2v2h2v2h-2v4h6V3H10zm9 6h-2V7h2v2z" fill="white" />
              </svg>
            }
            t={t}
            label={"CORE_CHANGE_TENANT_DESCRIPTION"}
          />
        </div>
      </a>
      {/*
      <a href={key.includes("DASHBOARD") ? `/employee/integration/dss/${NATADMIN ? "NURT_DASHBOARD" : "home"}` : "/employee"}>
        <div className="actions">
          <ToolTipWrapper
            child={
              key.includes("DASHBOARD") ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10H8V0H0V10ZM0 18H8V12H0V18ZM10 18H18V8H10V18ZM10 0V6H18V0H10Z" fill="white" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" title="National DSS Home">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
                    fill="white"
                  />
                </svg>
              )
            }
            t={t}
            label={key}
          />
        </div>
      </a>
      <a href="/employee/integration/dss/home">
        <div className="actions">
          <ToolTipWrapper
            child={
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" title="State DSS Home">
                <path d="M24 0H0v24h24z" fill="none" />
                <path
                  d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"
                  fill="white"
                />
              </svg>
            }
            t={t}
            label={"ACTION_TEST_HOME"}
          />
        </div>
      </a> 
      */}
    </div>
  );
};

export default EmployeeSideBar;
