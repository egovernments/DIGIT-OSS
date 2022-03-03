import { Loader } from "@egovernments/digit-ui-react-components";
import React ,{Fragment}from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
// import { newConfig } from "../../../config/Create/config";
import CreatePropertyForm from '../../pageComponents/createForm';
import PTAcknowledgement from '../../pageComponents/PTAcknowledgement';

const CreateProperty = ({ parentRoute, onSelect }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  const stateId = Digit.ULBService.getStateId();
  let config = [];
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY", {});
  let { data: commonFields, isLoading } = Digit.Hooks.pt.useMDMS(stateId, "PropertyTax", "CommonFieldsConfig");

  const search = useLocation().search;
  const redirectUrl = new URLSearchParams(search).get('redirectUrl');

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
        <CreatePropertyForm onSubmit={createProperty} value={params} userType={"citizen"} />
      </Route>
      <Route exact path={`${match.path}/save-property`}>
        <PTAcknowledgement data={params} onSuccess={onSuccess} redirectUrl={redirectUrl} userType={"citizen"} />
      </Route>
    </Switch>
  );
};

export default CreateProperty;
