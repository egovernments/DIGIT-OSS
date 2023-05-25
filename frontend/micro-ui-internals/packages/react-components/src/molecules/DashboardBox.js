import React from "react";
import { Link } from "react-router-dom";

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <svg style={{ display: "inline", height: "24px" }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#F47738" />
      <path d="M16 5.33325L14.12 7.21325L21.56 14.6666H5.33337V17.3333H21.56L14.12 24.7866L16 26.6666L26.6667 15.9999L16 5.33325Z" fill="white" />
    </svg>
  </Link>
);

const DashboardBox = ({ t = (val) => val, svgIcon, header, info, subHeader, links, total }) => {
  const mobileView = innerWidth <= 640;
  const employeeCardStyles = mobileView
    ? {
        width: "96vw",
        margin: "8px auto",
      }
    : {
        width: "328px",
      };
  return (
    <div className="employeeCard card-home" style={{ padding: 0, ...employeeCardStyles }}>
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            {/* <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                fill="white"
              ></path>
            </svg> */}
            {svgIcon}
          </span>
          <span className="text">{t(header)}</span>
        </div>
        <div className="body ">
          <div className="employeeCard-info-box">
            {Object.keys(info).map((key, index) => {
              return (
                <div key={index} className="employeeCard-info-data">
                  <span>{t(info[key])}</span>
                  <span style={{ fontWeight: "bold" }}>{t(key)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <hr className="underline" />
        <div className="body">
          {links.map((link, index) => (
            <span key={index} className="link">
              <Link to={link.pathname}>
                <span>{t(link.label)}</span>
              </Link>
              {!isNaN(link.total) && <span className="inbox-total">{link.total}</span>}
              {<ArrowRight to={link.pathname} />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardBox;
