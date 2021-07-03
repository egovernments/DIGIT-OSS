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
  isUserSetting,
}) => {
  let sourceUrl=`${window.location.origin}/employee`;
  return (
    <Drawer
      containerStyle={{ ...defaultContainerStyle, ...containerStyle }}
      docked={false}
      width={width}
      openSecondary={openSecondary}
      open={toggleMenu}
      onRequestChange={(open) => onUpdateMenuStatus(open)}
    >
      {isUserSetting && <UserProfile role={role} cities={cities} userInfo={userInfo} />}
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
        {window && window.outerWidth <= 768 && isUserSetting && <ActionMenu role={role} />}
        {/* <Divider light /> */}
        <LanguageSelection fetchLocalizationLabel={fetchLocalizationLabel} />
        {isUserSetting && CommonMenuItems.map((item) => {
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
        <div style={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img style={{ display: "inline-flex", height: '1em' ,cursor:'pointer'}} alt={"Powered by DIGIT"} src={`${sourceUrl}/digit-footer.png`} onError={"this.src='./../digit-footer.png'"} onClick={() => {
              window.open('https://www.digit.org/', '_blank').focus();
            }}></img>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
