import React from "react";

import { Route, Switch } from "react-router-dom";
// import UserOnboarding from "../UserOnboarding/index";
import { PgrRoutes, getRoute } from "../../../constants/Routes";
import ReasonPage from "./Reason";
import UploadPhoto from "./UploadPhoto";
import AddtionalDetails from "./AddtionalDetails";
import Response from "../Response";

const ReopenComplaint = ({ match, history, parentRoute }) => {
  console.log("match:", match);
  return (
    <Switch>
      <Route exact path={getRoute(match, PgrRoutes.ReasonPage)} component={() => <ReasonPage match={match} />} />
      <Route path={getRoute(match, PgrRoutes.UploadPhoto)} component={() => <UploadPhoto match={match} skip={true} />} />
      <Route path={getRoute(match, PgrRoutes.AddtionalDetails)} component={() => <AddtionalDetails match={match} parentRoute={parentRoute} />} />
      {/* <Route path={getRoute(match, PgrRoutes.Response)} component={() => <Response match={match} />} /> */}
    </Switch>
  );
};

export { ReopenComplaint };
