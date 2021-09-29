import React, { Fragment, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Card, CardSectionHeader, PDFSvg, Loader, StatusTable, Menu, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";

const EventDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [displayMenu, setDisplayMenu] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data } = Digit.Hooks.events.useEventDetails(tenantId, { ids: id });

  function onActionSelect(action) {
    // setSelectedAction(action);
    if (action === "EDIT") {
      history.push(`/digit-ui/employee/engagement/event/edit-event/${id}`)
    }
    setDisplayMenu(false);
  }
  return (
    <Fragment>
      <div>
        <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={data}
        isLoading={isLoading}
        isDataLoading={isLoading}
        // workflowDetails={workflowDetails}
        // businessService={
        //   workflowDetails?.data?.applicationBusinessService
        //     ? workflowDetails?.data?.applicationBusinessService
        //     : data?.applicationData?.businessService
        // }
      />
      <ActionBar>
        {displayMenu ? (
          <Menu
            localeKeyPrefix={"ES_EVENT"}
            options={['EDIT']}
            t={t}
            onSelect={onActionSelect}
          />
        ) : null}
        <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
    </Fragment>
  );
};

export default EventDetails;