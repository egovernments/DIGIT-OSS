import React, { useState } from "react"
import { LogoutIcon } from "@egovernments/digit-ui-react-components";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

const TopBarSideBar = ({ t, stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl }) => {
    const [isSidebarOpen, toggleSidebar] = useState(false);
  
    const handleLogout = () => {
      toggleSidebar(false);
      Digit.UserService.logout();
    };
  
    const userOptions = [{ name: t("CORE_COMMON_LOGOUT"), icon: <LogoutIcon className="icon" />, func: handleLogout }];
  
    return (
      <React.Fragment>
        <TopBar
          t={t}
          stateInfo={stateInfo}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          handleLogout={handleLogout}
          userDetails={userDetails}
          CITIZEN={CITIZEN}
          cityDetails={cityDetails}
          mobileView={mobileView}
          userOptions={userOptions}
          handleUserDropdownSelection={handleUserDropdownSelection}
          logoUrl={logoUrl}
        />
        <SideBar
          t={t}
          CITIZEN={CITIZEN}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
          mobileView={mobileView}
          userDetails={userDetails}
        />
      </React.Fragment>
    );
  }

  export default TopBarSideBar