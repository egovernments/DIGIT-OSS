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
  const Acknowledgement = Digit?.ComponentRegistryService?.getComponent('WSAcknowledgement') ;

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig } = Digit.Hooks.ws.useWSConfigMDMS.getFormConfig(stateId, []);
  let isModifyEdit = window.location.href.includes("/modify-connection/") || window.location.href.includes("/edit-application/")

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    let { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let routeObject = config.find((routeObj) => routeObj.route === currentPath && routeObj);
    if (typeof nextStep == "object" && nextStep != null) {
    if (
        nextStep[sessionStorage.getItem("KnowProperty")] &&
        (nextStep[sessionStorage.getItem("KnowProperty")] === "search-property" || nextStep[sessionStorage.getItem("KnowProperty")] === "create-property")
      ) {
        nextStep = `${nextStep[sessionStorage.getItem("KnowProperty")]}`;
      }
    }
    if (routeObject[sessionStorage.getItem("serviceName")]) nextStep = routeObject[sessionStorage.getItem("serviceName")];
    if( (params?.cptId?.id || params?.cpt?.details?.propertyId || (isModifyEdit && params?.cpt?.details?.propertyId ))  && nextStep === "know-your-property" )
    { 
      nextStep = "property-details";
    }
    if(nextStep === "docsrequired" && sessionStorage.getItem("changePropertySelected") === "yes")
    {
      nextStep = "property-details";
    }
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${getPath(match.path, match.params)}/check`);
    }
    redirectWithHistory(`${getPath(match.path, match.params)}/${nextStep}`);
  }

  if(params && Object.keys(params).length>0 && window.location.href.includes("/citizen/ws/create-application/search-property"))
    {
      clearParams();
      queryClient.invalidateQueries("WS_CREATE");
    }

  const onSuccess = () => {
    queryClient.invalidateQueries("WS_CREATE");
  };
  const createApplication = async () => {
    sessionStorage.setItem("isCreateEnabled","true");
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
  newConfig = newConfig?.WSCreateConfig ? newConfig?.WSCreateConfig : newConfigWS;
  //newConfig = newConfigWS;
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "search-property";

  // const CheckPage = Digit?.ComponentRegistryService?.getComponent('BPACheckPage') ;
  // const OBPSAcknowledgement = Digit?.ComponentRegistryService?.getComponent('BPAAcknowledgement');
  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key, isSkipEnabled } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${getPath(match.path, match.params)}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key, isSkipEnabled }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} userType={"citizen"} />
          </Route>
        );
      })}
      <Route path={`${getPath(match.path, match.params)}/check`}>
        <CheckPage onSubmit={createApplication} value={params} />
      </Route>
      <Route path={`${getPath(match.path, match.params)}/acknowledgement`}>
        <Acknowledgement data={params} onSuccess={onSuccess} clearParams={clearParams} />
      </Route>
      <Route>
        <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default WSCreate;