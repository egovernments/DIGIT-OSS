import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch, useLocation } from "react-router-dom";
import { config } from "./config";
import SearchPropertyComponent from "./searchProperty";

const SearchProperty = ({ onSelect }) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  
  const search = useLocation().search;
  const redirectToUrl = new URLSearchParams(search).get('redirectToUrl');
  
  const params = useMemo(() =>
    config.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [config]
    )
  );

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <SearchPropertyComponent config={params[0]} onSelect={onSelect} redirectToUrl={redirectToUrl} />
      </Route>
    </Switch>
  );
};

export default SearchProperty;
