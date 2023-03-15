import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { newConfig as newConfigOCBPA } from "../../../config/ocbuildingPermitConfig";
import { getBPAEditDetails, getPath } from "../../../utils";
import { Loader } from "@egovernments/digit-ui-react-components";

const OCSendBackToCitizen = ({ parentRoute }) => {
  sessionStorage.setItem("BPA_SUBMIT_APP", JSON.stringify("BPA_SUBMIT_APP"));
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const stateCode = Digit.ULBService.getStateId();
  const { applicationNo: applicationNo, tenantId } = useParams();

  let config = [], application = {};

  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BUILDING_PERMIT_EDITFLOW", {});

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig } = Digit.Hooks.obps.SearchMdmsTypes.getFormConfig(stateId, []);

  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["RiskTypeComputation", "homePageUrlLinks"]);

  const { data: bpaData, isLoading: isBpaSearchLoading } = Digit.Hooks.obps.useBPASearch(tenantId, { applicationNo: applicationNo });

  let scrutinyNumber = { edcrNumber: bpaData?.[0]?.edcrNumber }, sourceRefId = applicationNo;

  const { data: edcrDetails, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(stateCode, scrutinyNumber, {
    enabled: bpaData?.[0]?.edcrNumber ? true : false
  });

  const { data: nocdata, isLoading: isNocLoading, refetch: nocRefetch } = Digit.Hooks.obps.useNocDetails(tenantId, { sourceRefId: sourceRefId });

  const editApplication = window.location.href.includes("editApplication");

  useEffect(async () => {
    let isAlready = sessionStorage.getItem("BPA_IS_ALREADY_WENT_OFF_DETAILS");
    isAlready = isAlready ? JSON.parse(isAlready) : true;
    if (!isAlready && !isNocLoading && !isBpaSearchLoading && !isLoading && !isMdmsLoading) {
      application = bpaData ? bpaData[0] : {};
      if (bpaData && application && edcrDetails && mdmsData && nocdata) {
        application = bpaData[0];
        if (editApplication) {
          application.isEditApplication = true;
        }
        sessionStorage.setItem("bpaInitialObject", JSON.stringify({ ...application }));
        let bpaEditDetails = await getBPAEditDetails(application, edcrDetails, mdmsData, nocdata, t);
        setParams({ ...params, ...bpaEditDetails });
      }
    }
  }, [bpaData, edcrDetails, mdmsData, nocdata]);


  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${getPath(match.path, match.params)}/check`);
    }
    redirectWithHistory(`${getPath(match.path, match.params)}/${nextStep}`);

  }

  const onSuccess = () => {
    queryClient.invalidateQueries("PT_CREATE_PROPERTY");
  };

  const createApplication = async () => {
    // history.push(`${getPath(match.path, match.params)}/acknowledgement`);
  };

  const handleSelect = (key, data, skipStep, isFromCreateApi) => {
    if (isFromCreateApi) setParams(data);
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    goNext(skipStep);
  };
  const handleSkip = () => { };

  newConfig = newConfig?.OCBuildingPermitConfig ? newConfig?.OCBuildingPermitConfig : newConfigOCBPA;
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "check";

  useEffect(() => {
    if (sessionStorage.getItem("isPermitApplication") && sessionStorage.getItem("isPermitApplication") == "true") {
      clearParams();
      sessionStorage.setItem("isPermitApplication", false);
    }
  }, []);

  const CheckPage = Digit?.ComponentRegistryService?.getComponent('OCBPASendBackCheckPage') ;
  const Acknowledgement = Digit?.ComponentRegistryService?.getComponent('OCSendBackAcknowledgement');

  if (isNocLoading || isBpaSearchLoading || isLoading) {
    return <Loader />
  }
  
  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${getPath(match.path, match.params)}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} />
          </Route>
        );
      })}
      <Route path={`${getPath(match.path, match.params)}/check`}>
        <CheckPage onSubmit={createApplication} value={params} />
      </Route>
      <Route path={`${getPath(match.path, match.params)}/acknowledgement`}>
        <Acknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default OCSendBackToCitizen;