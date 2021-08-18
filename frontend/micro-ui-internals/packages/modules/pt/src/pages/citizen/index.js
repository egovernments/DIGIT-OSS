import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Redirect, Switch, useRouteMatch } from "react-router-dom";
import CreateProperty from "./Create";
import { PTMyApplications } from "./PTMyApplications";
import { MyProperties } from "./MyProperties/index";
import PropertyInformation from "./MyProperties/propertyInformation";
import PTApplicationDetails from "./PTApplicationDetails";
import SearchPropertyComponent from "./SearchProperty";
import SearchResultsComponent from "./SearchResults";
import { shouldHideBackButton } from "../../utils";
import propertyOwnerHistory from "./MyProperties/propertyOwnerHistory";
import EditProperty from "./EditProperty";

const hideBackButtonConfig = [{ screenPath: "property/new-application/acknowledgement" },{ screenPath: "property/edit-application/acknowledgement" }];

const App = () => {
  const { path, url, ...match } = useRouteMatch();
  return (
    <span className={"pt-citizen"}>
      <Switch>
        <AppContainer>
          {!shouldHideBackButton(hideBackButtonConfig) ? <BackButton style={{ position: "fixed", top: "55px" }}>Back</BackButton> : ""}
          <PrivateRoute path={`${path}/property/new-application`} component={CreateProperty} />
          <PrivateRoute path={`${path}/property/edit-application`} component={EditProperty} />
          <PrivateRoute path={`${path}/property/search`} component={SearchPropertyComponent} />
          <PrivateRoute path={`${path}/property/search-results`} component={SearchResultsComponent} />
          <PrivateRoute path={`${path}/property/application/:acknowledgementIds`} component={PTApplicationDetails}></PrivateRoute>
          <PrivateRoute path={`${path}/property/my-applications`} component={PTMyApplications}></PrivateRoute>
          <PrivateRoute path={`${path}/property/my-properties`} component={MyProperties}></PrivateRoute>
          <PrivateRoute path={`${path}/property/properties/:propertyIds`} component={PropertyInformation}></PrivateRoute>
          <PrivateRoute path={`${path}/property/owner-history/:tenantId/:propertyIds`} component={propertyOwnerHistory}></PrivateRoute>
          {/* <Redirect to={`/`}></Redirect> */}
        </AppContainer>
      </Switch>
    </span>
  );
};

export default App;
