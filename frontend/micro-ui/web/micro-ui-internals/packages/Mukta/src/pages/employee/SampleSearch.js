import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader, Button, AddFilled } from "@egovernments/digit-ui-react-components";
import searchWageSeekerConfig from "../../configs/searchWageSeekerConfig";
import { useHistory, useLocation } from "react-router-dom";

const SearchWageSeeker = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const location = useLocation()

  const wageSeekerSession = Digit.Hooks.useSessionStorage("WAGE_SEEKER_CREATE", {});
  const [sesionFormData, clearSessionFormData] = wageSeekerSession;

  //const indConfigs = searchWageSeekerConfig();
  const configModuleName = Digit.Utils.getConfigModuleName()
  const tenant = Digit.ULBService.getStateId();
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(
      tenant,
      configModuleName,
   [
    {
      name: "SearchIndividualConfig",
    },
  ]);

  const indConfigs = data?.[configModuleName]?.SearchIndividualConfig?.[0]

  let configs = useMemo(
    () => Digit.Utils.preProcessMDMSConfigInboxSearch(t, indConfigs, "sections.search.uiConfig.fields",{
      updateDependent : [
        {
          key : "createdFrom",
          value : [new Date().toISOString().split("T")[0]]
        },
        {
          key : "createdTo",
          value : [new Date().toISOString().split("T")[0]]
        }
      ]
    }
    ),[indConfigs]);

  useEffect(() => {
    if (!window.location.href.includes("modify-wageseeker") && sesionFormData && Object.keys(sesionFormData) != 0) {
      clearSessionFormData();
    }
  }, [location])

  if (isLoading) return <Loader />;
  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header className="works-header-search">{t(configs?.label)}</Header>
        {Digit.Utils.didEmployeeHasRole(configs?.actionRole) && (
          <Button
            label={t(configs?.actionLabel)}
            variation="secondary"
            icon={<AddFilled />}
            onButtonClick={() => {
              history.push(`/${window?.contextPath}/employee/${configs?.actionLink}`)
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

export default SearchWageSeeker;
