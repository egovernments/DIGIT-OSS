import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { config } from "./config";
import SelectPropertyType from "./SelectPropertyType";

const FileComplaint = () => {
  const { path, url } = useRouteMatch();
  const { t } = useTranslation();
  const stepItems = useMemo(
    () =>
      config.map((step, index) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      }),
    [config]
  );

  function log(data) {
    console.log("data", data);
  }

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <SelectPropertyType config={stepItems[0]} onSelect={log} />
      </Route>
      <Route path={`${path}/property-sub-type`}>
        <h1>property sub type</h1>
      </Route>
    </Switch>
  );
};

export default FileComplaint;
