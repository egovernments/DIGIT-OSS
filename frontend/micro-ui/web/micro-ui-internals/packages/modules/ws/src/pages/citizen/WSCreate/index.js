import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useRouteMatch, useLocation, useHistory, Switch, Route, Redirect } from "react-router-dom";
import { newConfig as newConfigWS } from "../../../config/wsCreateConfig";

const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}


const WSCreate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const { pathname, state } = useLocation();
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("WS_CREATE", state?.edcrNumber ? { data: { scrutinyNumber: { edcrNumber: state?.edcrNumber } } } : {});

  const CheckPage = Digit?.ComponentRegistryService?.getComponent('WSCheckPage') ;

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig } = Digit.Hooks.obps.SearchMdmsTypes.getFormConfig(stateId, []);

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    let { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let routeObject = config.find((routeObj) => routeObj.route === currentPath && routeObj);
    if (routeObject[sessionStorage.getItem("serviceName")]) nextStep = routeObject[sessionStorage.getItem("serviceName")];
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${getPath(match.path, match.params)}/check`);
    }
    redirectWithHistory(`${getPath(match.path, match.params)}/${nextStep}`);
  }

  const onSuccess = () => {
    queryClient.invalidateQueries("WS_CREATE");
  };
  const createApplication = async () => {
    history.push(`${getPath(match.path, match.params)}/acknowledgement`);
  };

  const handleSelect = (key, data, skipStep, isFromCreateApi) => {
    if (isFromCreateApi) setParams(data);
    else if (key === "") setParams({ ...data });
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    goNext(skipStep);
  };
  const handleSkip = () => { };

  let config = [];
  // newConfig = newConfig?.BuildingPermitConfig ? newConfig?.BuildingPermitConfig : newConfigWS;
  newConfig = newConfigWS;
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "docs-required";

  // const CheckPage = Digit?.ComponentRegistryService?.getComponent('BPACheckPage') ;
  // const OBPSAcknowledgement = Digit?.ComponentRegistryService?.getComponent('BPAAcknowledgement');
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
      {/*<Route path={`${getPath(match.path, match.params)}/acknowledgement`}>
        <OBPSAcknowledgement data={params} onSuccess={onSuccess} />
      </Route> */}
      <Route>
        <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default WSCreate;