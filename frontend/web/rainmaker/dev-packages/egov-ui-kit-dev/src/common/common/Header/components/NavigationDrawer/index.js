import React from "react";
import { Image, Drawer, List } from "components";
import UserProfile from "./UserProfile";
import MenuItem from "material-ui/MenuItem";
import { CommonMenuItems } from "./commonMenuItems";
import Divider from "@material-ui/core/Divider";
import digitLogo from "egov-ui-kit/assets/images/Digit_logo.png";

// import { Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import LanguageSelection from "./LanguageSelection";
// import menuItems from "./menuItems";
import { ActionMenu } from "modules/common";
import logoMseva from "egov-ui-kit/assets/images/logo_black.png";
import logo from "egov-ui-kit/assets/images/logo_black.png";

const styles = {
  // listInnerDivStyle: {
  //   padding: "16px 0px 16px 60px",
  // },
  menuStyle: {
    marginLeft: 15,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    flex: 1,
  },
  defaultMenuItemStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: "4px",
    padding: 0,
    lineHeight: "unset",
  },
};

const defaultContainerStyle = {
  paddingBottom: 30,
  background: "#fff",
};

const NavigationDrawer = ({
  handleItemClick,
  role,
  toggleMenu,
  width,
  openSecondary,
  onUpdateMenuStatus,
  userInfo,
  cities,
  fetchLocalizationLabel,
  containerStyle,
  isCSR,
  isADMIN,
}) => {
  return (
    <Drawer
      containerStyle={{ ...defaultContainerStyle, ...containerStyle }}
      docked={false}
      width={width}
      openSecondary={openSecondary}
      open={toggleMenu}
      onRequestChange={(open) => onUpdateMenuStatus(open)}
    >
      <UserProfile role={role} cities={cities} userInfo={userInfo} />
      <div className="col-sm-1 drawer-list-poweredBy-wrapper">
        {/* <List
          onItemClick={handleItemClick}
          innerDivStyle={styles.listInnerDivStyle}
          className="drawer-list-style"
          items={menuItems(role, "one", isCSR, isADMIN)}
          listContainerStyle={{ background: "#ffffff" }}
          listItemStyle={{ borderBottom: "1px solid #e0e0e0" }}
        /> */}

        {/* <List
          onItemClick={handleItemClick}
          innerDivStyle={styles.listInnerDivStyle}
          className="drawer-list-style"
          items={menuItems(role, "two", isCSR, isADMIN)}
          listContainerStyle={{ background: "#ffffff" }}
          listItemStyle={{ borderBottom: "1px solid #e0e0e0" }}
        /> */}
        {window && window.outerWidth <= 768 && <ActionMenu role={role} />}
        {/* <Divider light /> */}
        <LanguageSelection fetchLocalizationLabel={fetchLocalizationLabel} />
        {CommonMenuItems.map((item) => {
          return (
            <div className="sideMenuItem">
              <MenuItem
                innerDivStyle={styles.defaultMenuItemStyle}
                style={{ whiteSpace: "initial" }}
                onClick={() => {
                  handleItemClick(item, true);
                }}
                leftIcon={item.leftIcon}
                primaryText={
                  <div className="menuStyle" style={styles.menuStyle}>
                    {item.primaryText || ""}
                  </div>
                }
              />
            </div>
          );
        })}

        <div className="rainmaker-displayInline" style={{ justifyContent: "left" ,marginLeft:"10px"}}>
          <div style={{ marginTop: "42px" }}>
            <img  src={logo} height="14px !important"/>
          </div >
          <div style={{ marginLeft: "2px", marginTop: "44px"  }}>
            <Label bold={true} fontSize="13px" bold={true} label="|" />
          </div>
          <div style={{ marginLeft: "2px" ,marginTop: "44px"  }}>
            <Label bold={true} color="black" bold={true} fontSize="13px" label="STATE_LABEL" />
          </div >
          <div style={{ marginTop: "42px" ,marginLeft:"65px" }}>
          <img src={digitLogo} height="14px !important" />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
