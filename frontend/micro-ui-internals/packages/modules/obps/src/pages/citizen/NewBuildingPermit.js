import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";
import DocsRequired from "../../components/DocsRequired";
import BasicDetails from "../../components/BasicDetails";

const NewBuildingPermit = () => {
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId.split(".")[0];
  return (
    <Switch>
      <Route path={`${path}/docs-required`}>
        <DocsRequired />
      </Route>
      <Route path={`${path}/basic-details`}>
        <BasicDetails />
      </Route>
      <Route>
        <Redirect to={`${path}/docs-required`} />
      </Route>
    </Switch>
  );
};

export default NewBuildingPermit;