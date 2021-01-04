import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { config } from "./defaultConfig";
import SelectPropertyType from "./SelectPropertyType";
import SelectPropertySubtype from "./SelectPropertySubtype";
import CheckPage from "./CheckPage";

const FileComplaint = ({ parentRoute }) => {
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});

  const goNext = () => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.routes[currentPath];
    if (nextStep === null) return submitComplaint();
    history.push(`${match.path}/${nextStep}`);
  };

  const submitComplaint = async () => {
    await Digit.FileDesludging.create("pb.amritsar");
    history.push(`${parentRoute}/new-application/check`);
  };

  useEffect(() => {
    console.log("params----->", params);
  }, [params]);

  function saveParams(data) {
    setParams({ ...params, ...data });
    goNext();
  }

  const handleSkip = () => {};

  return (
    <Switch>
      {Object.keys(config.routes).map((route, index) => {
        const { component, texts, inputs } = config.routes[route];
        const Component = typeof component === "string" ? registry.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${route}`} key={index}>
            <Component config={{ texts, inputs }} onSelect={saveParams} onSkip={handleSkip} value={params} t={t} />
          </Route>
        );
      })}
      <Route path={`${match.path}/check`}>
        <CheckPage />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
      {/* <Route exact path={`${path}/`}>
        <SelectPropertyType config={stepItems[0]} onSelect={log} t={t} />
      </Route>
      <Route path={`${path}/property-sub-type`}>
        <SelectPropertySubtype config={stepItems[1]} onSelect={log} t={t} />
      </Route> */}
    </Switch>
  );
};

export default FileComplaint;
