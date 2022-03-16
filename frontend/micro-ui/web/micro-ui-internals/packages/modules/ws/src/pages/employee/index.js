import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import ApplicationBillAmendment from "./ApplicationBillAmendment"
import RequiredDocuments from "./RequiredDocuments"
import NewApplication from "./NewApplication"
import WSDocsRequired from "../../pageComponents/WSDocsRequired";
import ApplicationDetails from "./ApplicationDetails";

const App = ({ path }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <BreadCrumb></BreadCrumb>
      <Switch>
        <PrivateRoute path={`${path}/create-application`} component={WSDocsRequired} />
        <PrivateRoute path={`${path}/new-application`} component={NewApplication} />
        <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/bill-amendment`} component={() => <ApplicationBillAmendment {...{path}}/>} />
        <PrivateRoute path={`${path}/required-documents`} component={() => <RequiredDocuments {...{path}}/>} />
      </Switch>
    </React.Fragment>
  )
}

export default App;