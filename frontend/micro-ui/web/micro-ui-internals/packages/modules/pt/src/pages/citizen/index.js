import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { shouldHideBackButton } from "../../utils";
import Search from "../employee/Search";
import { useTranslation } from "react-i18next";
import { PTMyPayments } from "./MyPayments";

const hideBackButtonConfig = [
  { screenPath: "property/new-application/acknowledgement" },
  { screenPath: "property/edit-application/acknowledgement" },
  //{ screenPath: "property/feedback-acknowledgement" }
];

const App = () => {
  const { path, url, ...match } = useRouteMatch();
  const { t } = useTranslation();
  const inboxInitialState = {
    searchParams: {},
  };

  const CreateProperty = Digit?.ComponentRegistryService?.getComponent("PTCreateProperty");
  const EditProperty = Digit?.ComponentRegistryService?.getComponent("PTEditProperty");
  const SearchPropertyComponent = Digit?.ComponentRegistryService?.getComponent("PTSearchPropertyComponent");
  const SearchResultsComponent = Digit?.ComponentRegistryService?.getComponent("PTSearchResultsComponent");
  const PTApplicationDetails = Digit?.ComponentRegistryService?.getComponent("PTApplicationDetails");
  const PTMyApplications = Digit?.ComponentRegistryService?.getComponent("PTMyApplications");
  const MyProperties = Digit?.ComponentRegistryService?.getComponent("PTMyProperties");
  const MutateProperty = Digit?.ComponentRegistryService?.getComponent("PTMutateProperty");
  const PropertyInformation = Digit?.ComponentRegistryService?.getComponent("PropertyInformation");
  const PropertyOwnerHistory = Digit?.ComponentRegistryService?.getComponent("PropertyOwnerHistory");

  return (
    <span className={"pt-citizen"}>
      <Switch>
        <AppContainer>
          {!shouldHideBackButton(hideBackButtonConfig) ? <BackButton>Back</BackButton> : ""}
          <PrivateRoute path={`${path}/property/new-application`} component={CreateProperty} />
          <PrivateRoute path={`${path}/property/edit-application`} component={EditProperty} />
          <Route path={`${path}/property/citizen-search`} component={SearchPropertyComponent} />
          <Route path={`${path}/property/search-results`} component={SearchResultsComponent} />
          <PrivateRoute path={`${path}/property/application/:acknowledgementIds/:tenantId`} component={PTApplicationDetails}></PrivateRoute>
          <PrivateRoute path={`${path}/property/my-applications`} component={PTMyApplications}></PrivateRoute>
          <PrivateRoute path={`${path}/property/my-properties`} component={MyProperties}></PrivateRoute>
          <PrivateRoute path={`${path}/property/my-payments`} component={PTMyPayments}></PrivateRoute>
          <PrivateRoute path={`${path}/property/property-mutation`} component={MutateProperty}></PrivateRoute>
          <PrivateRoute path={`${path}/property/properties/:propertyIds`} component={PropertyInformation}></PrivateRoute>
          {/* <PrivateRoute path={`${path}/property/transfer-ownership`} component={MutateProperty}></PrivateRoute> */}
          <PrivateRoute path={`${path}/property/owner-history/:tenantId/:propertyIds`} component={PropertyOwnerHistory}></PrivateRoute>
          {/* <Redirect to={`/`}></Redirect> */}
          <PrivateRoute path={`${path}/property/search`} component={(props) => <Search {...props} t={t} parentRoute={path} />} />
        </AppContainer>
      </Switch>
    </span>
  );
};

export default App;
