import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useLocation, useHistory, Switch, Route, Redirect } from "react-router-dom";
import { newConfig } from "../../../config/buildingPermitConfig";
// import DocsRequired from "../../components/DocsRequired";
// import BasicDetails from "../../components/BasicDetails";


const NewBuildingPermit = () => {
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const { pathname, state } = useLocation();
  const history = useHistory();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BUILDING_PERMIT", state?.edcrNumber ? { data: { scrutinyNumber: { edcrNumber: state?.edcrNumber }}} : {});

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    redirectWithHistory(`${path}/${nextStep}`);

  }

  const handleSelect = (key, data, skipStep, isFromCreateApi) => {
    if (isFromCreateApi) setParams(data);
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data }}});
    goNext(skipStep);
  };
  const handleSkip = () => {};

  // const state = tenantId.split(".")[0];
  let config = [];
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "docs-required";

  useEffect(() => {
    if(sessionStorage.getItem("isPermitApplication") && sessionStorage.getItem("isPermitApplication") == "true") {
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
      <Route>
        <Redirect to={`${path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default NewBuildingPermit;