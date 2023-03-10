import React, { Fragment } from "react";
import { ArrowRightInbox } from "./svgindex";
import { Link } from "react-router-dom";

const EmployeeModuleCard = ({ Icon, moduleName, kpis = [], links = [], isCitizen = false, className, styles }) => {
  return (
    <div className="ServiceCardOptions empCard">
      <div className="ServiceCardData ">
        <div className="ServiceCardHeader">
          <div className="Icon-side">{Icon}</div>
        </div>
        <div className="ServiceCardCaption">
          <h3>{moduleName}</h3>
          <div className="links-redirect">
            {links.map(({ count, label, link }, index) => (
              <span className="link" key={index}>
                {link ? (
                  <Link to={link}>
                    {label}{" "}
                    {count ? (
                      <>
                        <span className={"inbox-total"}>{count || "-"}</span>
                      </>
                    ) : null}
                  </Link>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ModuleCardFullWidth = ({ moduleName, links = [], isCitizen = false, className, styles, headerStyle, subHeader, subHeaderLink }) => {
  return (
    // <div className={className ? className : "employeeCard card-home customEmployeeCard"} style={styles ? styles : {}}>
    //   <div className="complaint-links-container" style={{ padding: "10px" }}>
    //     <div className="header" style={isCitizen ? { padding: "0px" } : headerStyle}>
    //       <span className="text removeHeight">{moduleName}</span>
    //       <span className="link">
    //         <a href={subHeaderLink}>
    //           <span className={"inbox-total"} style={{ display: "flex", alignItems: "center", color: "#F47738", fontWeight: "bold" }}>
    //             {subHeader || "-"}
    //             <span style={{ marginLeft: "10px" }}>
    //               {" "}
    //               <ArrowRightInbox />
    //             </span>
    //           </span>
    //         </a>
    //       </span>
    //     </div>
    //     <div className="body" style={{ margin: "0px", padding: "0px" }}>
    //       <div className="links-wrapper" style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
    //         {links.map(({ count, label, link }, index) => (
    //           <span className="link full-employee-card-link" key={index}>
    //             {link ? link?.includes("digit-ui/") ? <Link to={link}>{label}</Link> : <a href={link}>{label}</a> : null}
    //           </span>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="ServiceCardOptions empCard">
      <div className="ServiceCardData ">
        <div className="ServiceCardHeader">
          <div className="Icon-side">{Icon}</div>
        </div>
        <div className="ServiceCardCaption">
          <h3>{moduleName}</h3>
          <span className="link">
            <a href={subHeaderLink}>
              <span className={"inbox-total"} style={{ display: "flex", alignItems: "center", color: "#F47738", fontWeight: "bold" }}>
                {subHeader || "-"}
                <span style={{ marginLeft: "10px" }}>
                  {" "}
                  <ArrowRightInbox />
                </span>
              </span>
            </a>
          </span>
          <div className="links-redirect">
            {links.map(({ count, label, link }, index) => (
              <span className="link full-employee-card-link" key={index}>
                {link ? link?.includes("digit-ui/") ? <Link to={link}>{label}</Link> : <a href={link}>{label}</a> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployeeModuleCard, ModuleCardFullWidth };
