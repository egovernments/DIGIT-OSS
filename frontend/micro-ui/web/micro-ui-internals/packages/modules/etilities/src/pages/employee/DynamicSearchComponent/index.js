import { AddFilled, Button, Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

// works-ui/employee/dss/search/commonMuktaUiConfig/SearchEstimateConfig
const DynamicSearchComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { moduleName, masterName } = useParams();

  const tenant = Digit.ULBService.getStateId();
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(
    tenant,
    moduleName,
    [
      {
        name: masterName,
      },
    ],
    {
      select: (data) => {
        return data?.[moduleName]?.[masterName]?.[0];
      },
    }
  );

  if (isLoading) return <Loader />;
  let configs = data || {};
  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header styles={{ fontSize: "32px" }}>{t(configs?.label)}</Header>
        {Digit.Utils.didEmployeeHasRole(configs?.actionRole) && (
          <Button
            label={t(configs?.actionLabel)}
            variation="secondary"
            icon={<AddFilled style={{ height: "20px", width: "20px" }} />}
            onButtonClick={() => {
              history.push(`/${window?.contextPath}/employee/${configs?.actionLink}`);
            }}
            type="button"
          />
        )}
      </div>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={configs}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default DynamicSearchComponent;
