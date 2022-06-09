import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import CreateProperty from "./Create";
import SearchPropertyComponent from "./SearchProperty";
import SearchResultsComponent from "./SearchResults";
import PropertyLinkSuccess from "./LinkSuccess";
import CitizenOtp from "./Otp";
import ViewProperty from "../pageComponents/ViewProperty";

const App = ({ stateCode }) => {
  const { path, url, ...match } = useRouteMatch();
  return (
    <span className={"pt-citizen"}>
      <Switch>
        <AppContainer>
          <BackButton>Back</BackButton>
          <Route path={`${path}/property/citizen-search`} component={SearchPropertyComponent} />
          <Route path={`${path}/property/search-results`}>
            <SearchResultsComponent stateCode={stateCode} />
          </Route>
          <Route path={`${path}/property/citizen-otp`}>
            <CitizenOtp stateCode={stateCode} />{" "}
          </Route>
          <PrivateRoute path={`${path}/property/link-success/:propertyIds`} component={PropertyLinkSuccess}></PrivateRoute>
          <PrivateRoute path={`${path}/property/new-application`} component={CreateProperty} />
          <PrivateRoute path={`${path}/view-property`} component={() => <ViewProperty />} />
        </AppContainer>
      </Switch>
    </span>
  );
};

export default App;
