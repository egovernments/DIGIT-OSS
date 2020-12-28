import React from "react";
import { ReopenComplaint } from "./ReopenComplaint/index";
import SelectRating from "./Rating/SelectRating";
import { PgrRoutes, getRoute } from "../../constants/Routes";
import { useRouteMatch, Switch } from "react-router-dom";
import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";

import { CreateComplaint } from "./Create";
import { ComplaintsList } from "./ComplaintsList";
import ComplaintDetailsPage from "./ComplaintDetails";
import Response from "./Response";

const App = () => {
  const { path, url, match } = useRouteMatch();
  console.log("pgr citizen", path, url);

  return (
    <Switch>
      <AppContainer>
        <BackButton>Back</BackButton>
        <PrivateRoute path={`${path}/create-complaint`} component={CreateComplaint} />
        <PrivateRoute path={`${path}/complaints`} exact component={ComplaintsList} />
        <PrivateRoute path={`${path}/complaints/:id`} component={ComplaintDetailsPage} />
        <PrivateRoute path={`${path}/reopen`} component={() => <ReopenComplaint parentRoute={path} />} />
        <PrivateRoute path={`${path}/rate/:id`} component={() => <SelectRating parentRoute={path} />} />
        <PrivateRoute path={`${path}/response`} component={() => <Response match={match} />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
