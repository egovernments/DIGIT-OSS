import React from "react";
import { useTranslation } from "react-i18next";
import { SubmitBar, ActionBar, Menu } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsActionBar({ workflowDetails, displayMenu, onActionSelect, setDisplayMenu, businessService, forcedActionPrefix,ActionBarStyle={},MenuStyle={} }) {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);

  let actions = workflowDetails?.data?.actionState?.nextActions?.filter((e) => {
    return userRoles.some((role) => e.roles?.includes(role)) || !e.roles;
  });

  return (
    <React.Fragment>
      {!workflowDetails?.isLoading && actions?.length > 0 && (
        <ActionBar style={{...ActionBarStyle}}>
          {displayMenu && workflowDetails?.data?.actionState?.nextActions ? (
            <Menu
              localeKeyPrefix={forcedActionPrefix || `WF_EMPLOYEE_${businessService?.toUpperCase()}`}
              options={actions}
              optionKey={"action"}
              t={t}
              onSelect={onActionSelect}
              style={MenuStyle}
            />
          ) : null}
          <SubmitBar label={t("WF_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}
    </React.Fragment>
  );
}

export default ApplicationDetailsActionBar;
