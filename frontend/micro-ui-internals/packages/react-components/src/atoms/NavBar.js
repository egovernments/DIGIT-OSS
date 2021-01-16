import React, { useRef } from "react";

const NavBar = ({ open, profileItem, menuItems, onClose }) => {
  const node = useRef();
  Digit.Hooks.useClickOutside(node, onClose);

  return (
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
          ref={node}
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "56px",
            height: "100vh",
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
          {profileItem}
          <div className="drawer-list">
            {menuItems.map((item, index) => (
              <div
                key={index}
                // style={{
                //   marginLeft: 0,
                //   padding: 0,
                //   position: "relative",
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "flex-start"
                // }}
              >
                <span className="menu-item" {...item.populators}>
                  {item?.icon && item.icon}
                  <div className="menu-label">{item?.type && item.type === "component" ? item.action : item.text}</div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavBar;
