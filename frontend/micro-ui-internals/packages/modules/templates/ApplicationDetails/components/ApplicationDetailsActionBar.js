import React from "react";
import { useTranslation } from "react-i18next";
import { SubmitBar, ActionBar, Menu } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsActionBar({ workflowDetails, displayMenu, onActionSelect, setDisplayMenu, businessService }) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && (
        <ActionBar>
          {displayMenu && workflowDetails?.data?.nextActions ? (
            <Menu
              localeKeyPrefix={businessService === "PT" ? "ES_PT" : "ES_FSM"}
              options={workflowDetails?.data?.nextActions.map((action) => action.action)}
              t={t}
              onSelect={onActionSelect}
            />
          ) : null}
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}
    </React.Fragment>
  );
}

export default ApplicationDetailsActionBar;
