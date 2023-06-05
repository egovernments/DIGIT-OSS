import { AddFilled, Button, Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

// works-ui/employee/dss/search/commonMuktaUiConfig/SearchEstimateConfig
const DynamicSearchComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { moduleName, masterName } = useParams();
  const [pageConfig, setPageConfig] = useState(null);
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
  let configs = data || {};

  const updatedConfig = useMemo(() => Digit.Utils.preProcessMDMSConfigInboxSearch(t, pageConfig, "sections.search.uiConfig.fields", {}), [
    data,
    pageConfig,
  ]);

  useEffect(() => {
    setPageConfig(_.cloneDeep(configs));
  }, [data]);

  if (isLoading || !pageConfig) return <Loader />;
  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header styles={{ fontSize: "32px" }}>{t(updatedConfig?.label)}</Header>
        {Digit.Utils.didEmployeeHasRole(updatedConfig?.actionRole) && (
          <Button
            label={t(updatedConfig?.actionLabel)}
            variation="secondary"
            icon={<AddFilled style={{ height: "20px", width: "20px" }} />}
            onButtonClick={() => {
              history.push(`/${window?.contextPath}/employee/${updatedConfig?.actionLink}`);
            }}
            type="button"
          />
        )}
      </div>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={updatedConfig}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default DynamicSearchComponent;
