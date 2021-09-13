import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useRouteMatch, useLocation, useHistory, Switch, Route, Redirect } from "react-router-dom";
import { newConfig } from "../../../config/ocbuildingPermitConfig";
import CheckPage from "./CheckPage";
import OBPSAcknowledgement from "./OBPSAcknowledgement";


const OCBuildingPermit = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const { pathname, state } = useLocation();
  const history = useHistory();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BUILDING_PERMIT", state?.edcrNumber ? { data: { scrutinyNumber: { edcrNumber: state?.edcrNumber } } } : {});

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${path}/check`);
    }
    redirectWithHistory(`${path}/${nextStep}`);

  }

  const onSuccess = () => {
    //clearParams();
    queryClient.invalidateQueries("PT_CREATE_PROPERTY");
  };
  const createApplication = async () => {
    history.push(`${path}/acknowledgement`);
  };

  const handleSelect = (key, data, skipStep, isFromCreateApi) => {
    if (isFromCreateApi) setParams(data);
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    goNext(skipStep);
  };
  const handleSkip = () => { };

  let config = [];
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "basic-details";

  useEffect(() => {
    if (sessionStorage.getItem("isPermitApplication") && sessionStorage.getItem("isPermitApplication") == "true") {
      clearParams();
      sessionStorage.setItem("isPermitApplication", false);
    }
  }, []);

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${path}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} />
          </Route>
        );
      })}
      <Route path={`${path}/check`}>
        <CheckPage onSubmit={createApplication} value={params} />
      </Route>
      <Route path={`${path}/acknowledgement`}>
        <OBPSAcknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        <Redirect to={`${path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default OCBuildingPermit;