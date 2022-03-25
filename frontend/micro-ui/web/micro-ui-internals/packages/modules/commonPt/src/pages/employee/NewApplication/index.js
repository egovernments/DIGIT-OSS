import React from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";

import CreatePropertyForm from '../../pageComponents/createForm';
import PTAcknowledgement from '../../pageComponents/PTAcknowledgement';

const NewApplication = ({ path }) => {
  let config = [];
  const { t } = useTranslation();
  
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY", {});
  let { data: commonFields, isLoading } = Digit.Hooks.pt.useMDMS(stateId, "PropertyTax", "CommonFieldsConfig");
  
  const search = useLocation().search;
  const redirectUrl = new URLSearchParams(search).get('redirectToUrl');

  const createProperty = async () => {
    history.push(`${match.path}/acknowledgement`);
  };

  const onSuccess = () => {
    clearParams();
    queryClient.invalidateQueries("PT_CREATE_PROPERTY");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <CreatePropertyForm onSubmit={createProperty} value={params} redirectUrl={redirectUrl} userType={"employee"} />
      </Route>
      <Route exact path={`${match.path}/save-property`}>
        <PTAcknowledgement data={params} onSuccess={onSuccess} redirectUrl={redirectUrl} userType={"employee"} />
      </Route>
    </Switch>
  );
};

export default NewApplication;