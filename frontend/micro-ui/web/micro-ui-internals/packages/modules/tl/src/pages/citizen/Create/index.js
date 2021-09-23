import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { newConfig } from "../../../config/config";
import CheckPage from "./CheckPage";
import TLAcknowledgement from "./TLAcknowledgement";

const CreateTradeLicence = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_TRADE", {});

  const goNext = (skipStep, index, isAddMultiple, key) => {
    let currentPath = pathname.split("/").pop(),
      nextPage;
    let { nextStep = {} } = config.find((routeObj) => routeObj.route === currentPath);
    if (typeof nextStep == "object" && nextStep != null) {
      if (nextStep[sessionStorage.getItem("isAccessories")] && (nextStep[sessionStorage.getItem("isAccessories")]==="accessories-details" || nextStep[sessionStorage.getItem("isAccessories")]==="map")) {
        nextStep = `${nextStep[sessionStorage.getItem("isAccessories")]}`;
      } else if (nextStep[sessionStorage.getItem("StructureType")]) {
        nextStep = `${nextStep[sessionStorage.getItem("StructureType")]}`;
      }
    }
    let redirectWithHistory = history.push;
    if (skipStep) {
      redirectWithHistory = history.replace;
    }
    if (isAddMultiple) {
      nextStep = key;
    }
    if (nextStep === null) {
      return redirectWithHistory(`${match.path}/check`);
    }
    nextPage = `${match.path}/${nextStep}`;
    redirectWithHistory(nextPage);
  };

  const createProperty = async () => {
    history.push(`${match.path}/acknowledgement`);
  };

  function handleSelect(key, data, skipStep, index, isAddMultiple = false) {
    setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    goNext(skipStep, index, isAddMultiple, key);
  }

  const handleSkip = () => { };
  const handleMultiple = () => { };

  const onSuccess = () => {
    sessionStorage.removeItem("CurrentFinancialYear");
    queryClient.invalidateQueries("TL_CREATE_TRADE");
  };
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "info";

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} onAdd={handleMultiple} />
          </Route>
        );
      })}
      <Route path={`${match.path}/check`}>
        <CheckPage onSubmit={createProperty} value={params} />
      </Route>
      <Route path={`${match.path}/acknowledgement`}>
        <TLAcknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default CreateTradeLicence;
