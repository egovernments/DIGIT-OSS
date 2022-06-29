import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useRouteMatch, useLocation, useHistory, Switch, Route, Redirect } from "react-router-dom";
import { newConfig as newConfigWS } from "../../../config/wsDisconnectionConfig";

const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}


const WSDisconnection = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const match = useRouteMatch();


  let config = [];
  let newConfig = newConfigWS;
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "docsrequired";

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key, isSkipEnabled } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${getPath(match.path, match.params)}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key, isSkipEnabled }} t={t} userType={"citizen"} />
          </Route>
        );
      })}
      <Route>
        <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default WSDisconnection;