import React, {useEffect, useRef} from "react";
import { useTranslation } from "react-i18next";
import { SubmitBar, ActionBar, Menu } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsActionBar({ workflowDetails, displayMenu, onActionSelect, setDisplayMenu, businessService, forcedActionPrefix,ActionBarStyle={},MenuStyle={}, saveAttendanceState }) {
  const { t } = useTranslation();
  let user = Digit.UserService.getUser();
  const menuRef = useRef();
  if (window.location.href.includes("/obps") || window.location.href.includes("/noc")) {
    const userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
    const userInfo = userInfos ? JSON.parse(userInfos) : {};
    user = userInfo?.value;
  }
  const userRoles = user?.info?.roles?.map((e) => e.code);
  let isSingleButton = false;
  let isMenuBotton = false;
  let actions = workflowDetails?.data?.actionState?.nextActions?.filter((e) => {
    return userRoles.some((role) => e.roles?.includes(role)) || !e.roles;
  }) || workflowDetails?.data?.nextActions?.filter((e) => {
    return userRoles.some((role) => e.roles?.includes(role)) || !e.roles;
  });

    const closeMenu = () => {
          setDisplayMenu(false);
      }
    Digit.Hooks.useClickOutside(menuRef, closeMenu, displayMenu );

  if (((window.location.href.includes("/obps") || window.location.href.includes("/noc")) && actions?.length == 1) || (actions?.[0]?.redirectionUrl?.pathname.includes("/pt/property-details/")) && actions?.length == 1) {
    isMenuBotton = false;
    isSingleButton = true; 
  } else if (actions?.length > 0) {
    isMenuBotton = true; 
    isSingleButton = false;
  }

  if(saveAttendanceState?.displaySave) {
    isMenuBotton = false;
    isSingleButton = true;
    actions = [
      {
        action: "SAVE",
        state: "UPDATED"
      }
    ]
  }

  return (
    <React.Fragment>
      {!workflowDetails?.isLoading && isMenuBotton && !isSingleButton && (
        <ActionBar style={{...ActionBarStyle}}>
          {displayMenu && (workflowDetails?.data?.actionState?.nextActions || workflowDetails?.data?.nextActions) ? (
            <Menu
              localeKeyPrefix={forcedActionPrefix || `WORKS_${businessService?.toUpperCase()}`}
              options={actions}
              optionKey={"action"}
              t={t}
              onSelect={onActionSelect}
              style={MenuStyle}
            />
          ) : null}
          <SubmitBar ref={menuRef} label={t("WORKS_ACTIONS")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}
      {!workflowDetails?.isLoading && !isMenuBotton && isSingleButton && (
        <ActionBar style={{...ActionBarStyle}}>
          <button
              style={{ color: "#FFFFFF", fontSize: "18px" }}
              className={"submit-bar"}
              name={actions?.[0]?.action}
              value={actions?.[0]?.action}
              onClick={(e) => { onActionSelect(actions?.[0] || {})}}>
              {t(`${forcedActionPrefix || `WF_EMPLOYEE_${businessService?.toUpperCase()}`}_${actions?.[0]?.action}`)}
            </button>
        </ActionBar>
      )}
    </React.Fragment>
  );
}

export default ApplicationDetailsActionBar;
