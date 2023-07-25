import React, { Fragment } from "react";
import { ArrowRightInbox } from "./svgindex";
import { useHistory, useLocation, Link } from "react-router-dom";


const EmployeeModuleCard = ({ Icon, moduleName, kpis = [], links = [], isCitizen = false, className, styles, longModuleName=false }) => {
  const history = useHistory();

  return (
    <div className={className ? className : "employeeCard customEmployeeCard card-home home-action-cards"} style={styles ? styles : {}}>
      <div className="complaint-links-container">
        <div className="header" style={isCitizen ? { padding: "0px" } : longModuleName ? {alignItems:"flex-start"}:{}}>
          <span className="text removeHeight">{moduleName}</span>
          <span className="logo removeBorderRadiusLogo">{Icon}</span>
        </div>
        <div className="body" style={{ margin: "0px", padding: "0px" }}>
          {kpis.length !== 0 && (
            <div className="flex-fit" style={isCitizen ? { paddingLeft: "17px" } : {}}>
              {kpis.map(({ count, label, link }, index) => (
                <div className="card-count" key={index}>
                  <div>
                    <span>{count || "-"}</span>
                  </div>
                  <div>
                    {link ? (
                      <Link to={{ pathname:link, state: {count} }} className="employeeTotalLink">
                        {label}
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="links-wrapper" style={{ width: "80%" }}>
            {links.map(({ count, label, link }, index) => (
              <span className="link" key={index}>
                {link ? <Link to={{ pathname:link, state: {count} }}>{label}</Link> : null}
                {count ? (
                  <>
                    <span className={"inbox-total"} onClick={()=>history.push(`${link}`)}>{count || "-"}</span>
                    <Link to={{ pathname:link, state: {count} }}>
                      <ArrowRightInbox />
                    </Link>
                  </>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ModuleCardFullWidth = ({ moduleName,  links = [], isCitizen = false, className, styles, headerStyle, subHeader, subHeaderLink }) => {
  return (
    <div className={className ? className : "employeeCard card-home customEmployeeCard home-action-cards"} style={styles ? styles : {}}>
      <div className="complaint-links-container" style={{ padding: "10px" }}>
        <div className="header" style={isCitizen ? { padding: "0px" } : headerStyle}>
          <span className="text removeHeight">{moduleName}</span>
          <span className="link">
            <a href={subHeaderLink}>
              <span className={"inbox-total"} style={{ display: "flex", alignItems: "center", color: "#F47738", fontWeight: "bold" }} onClick={()=>history.push(`${link}`)}>
                {subHeader || "-"}
                <span style={{ marginLeft: "10px" }}>
                  {" "}
                  <ArrowRightInbox />
                </span>
              </span>
            </a>
          </span>
        </div>
        <div className="body" style={{ margin: "0px", padding: "0px" }}>
          <div className="links-wrapper" style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
            {links.map(({ count, label, link }, index) => (
              <span className="link full-employee-card-link" key={index}>
                {link ? (link?.includes(`${window?.contextPath}/`)?<Link to={link}>{label}</Link>:<a href={link}>{label}</a>) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployeeModuleCard, ModuleCardFullWidth };
