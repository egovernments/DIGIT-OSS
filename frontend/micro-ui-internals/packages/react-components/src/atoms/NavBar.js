import React from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";

const NavBar = ({ img, open, menuItems }) => {
  return (
    // <div className="navbar">
    //   <img src={img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png"} alt="mSeva" />
    // </div>
    <React.Fragment>
      <div>
        <div
          style={{
            position: "fixed",
            height: "100%",
            width: "100%",
            top: "0px",
            left: `${open ? "0px" : "-100%"}`,
            opacity: "1",
            backgroundColor: "rgba(0, 0, 0, 0.54)",
            willChange: "opacity",
            transform: "translateZ(0px)",
            transition: "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
            zIndex: "1200",
            pointerzevents: "auto",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "5px",
            height: "100vh",
            padding: "2rem",
            position: "absolute",
            top: 0,
            left: 0,
            transition: "transform 0.3s ease-in-out",
            background: "#fff",
            zIndex: "1999",
            width: "300px",
            transform: `${open ? "translateX(0)" : "translateX(-310px)"}`,
          }}
        >
          {menuItems.map((item, index) => {
            console.log("item::::::::::::", item);
            console.log("index::::::::::::", index);
            return (
              <div
                key={index}
                style={{ marginLeft: "0px", height: "48px", padding: "0px", display: "flex", alignItems: "center", justifyContent: "flexStart" }}
              >
                {item?.type && item.type === "component" ? <div>{item.action}</div> : <div>{item.text}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavBar;
