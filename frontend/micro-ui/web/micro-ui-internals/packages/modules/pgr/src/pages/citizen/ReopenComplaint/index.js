import React, { useMemo } from "react";

import { Route, Switch, useRouteMatch } from "react-router-dom";
// import UserOnboarding from "../UserOnboarding/index";
import { PgrRoutes, getRoute } from "../../../constants/Routes";
import ReasonPage from "./Reason";
import UploadPhoto from "./UploadPhoto";
import AddtionalDetails from "./AddtionalDetails";
import Response from "../Response";

const ReopenComplaint = ({ match, history, parentRoute }) => {
  
  const allParams = window.location.pathname.split("/")
  const id = allParams[allParams.length - 1]
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();

  const complaintDetails = Digit.Hooks.pgr.useComplaintDetails({ tenantId: tenantId, id: id }).complaintDetails;
  return (
    <Switch>
      <Route exact path={getRoute(match, PgrRoutes.ReasonPage)} component={() => <ReasonPage match={match} {...{complaintDetails}} />} />
      <Route path={getRoute(match, PgrRoutes.UploadPhoto)} component={() => <UploadPhoto match={match} skip={true} {...{complaintDetails}} />} />
      <Route path={getRoute(match, PgrRoutes.AddtionalDetails)} component={() => <AddtionalDetails match={match} parentRoute={parentRoute} {...{complaintDetails}} />} />
      <Route path={getRoute(match, PgrRoutes.Response)} component={() => <Response match={match} />} />
    </Switch>
  );
};

export { ReopenComplaint };
