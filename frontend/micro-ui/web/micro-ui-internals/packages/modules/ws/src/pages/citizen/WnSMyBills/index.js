import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { config } from "./config";
import WNSMyBillsComponent from "./wnsMyBills";

const BillSearchResults = () => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();

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
        <WNSMyBillsComponent
          template={params[0].labels}
          header={params[0].texts.header}
          actionButtonLabel={params[0].texts.actionButtonLabel}
          t={t}
        />
      </Route>
    </Switch>
  );
};

export default BillSearchResults;