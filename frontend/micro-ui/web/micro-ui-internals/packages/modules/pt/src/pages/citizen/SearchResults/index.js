import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { config as defaultConfig } from "./config";
import SearchResultsComponent from "./searchResults";

const CitizenSearchResults = (props) => {
  const { config: propConfig, onSelect, clearParams } = props;
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  let config = propConfig ? [propConfig] : defaultConfig;

  const params = useMemo(() => {
    return config?.map?.((step) => {
      const texts = {};
      for (const key in step.texts) {
        texts[key] = t(step.texts[key]);
      }
      return { ...step, texts };
    });
  }, [config]);

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <SearchResultsComponent
          template={params[0].labels}
          header={params[0].texts.header}
          actionButtonLabel={params[0].texts.actionButtonLabel}
          t={t}
          isMutation={propConfig?.action === "MUTATION"}
          onSelect={onSelect}
          config={propConfig}
          clearParams={clearParams}
        />
      </Route>
    </Switch>
  );
};

export default CitizenSearchResults;
