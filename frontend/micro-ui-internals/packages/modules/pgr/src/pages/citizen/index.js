import React from "react";
// import { CreateComplaint } from "./pages/citizen/CreateComplaint/index";
import { ReopenComplaint } from "./ReopenComplaint/index";
// import RatingAndFeedBack from "./pages/citizen/Rating/Rating";
// import AddtionalDetails from "./pages/citizen/ReopenComplaint/AddtionalDetails";
// import ReasonPage from "./pages/citizen/ReopenComplaint/Reason";
// import UploadPhoto from "./pages/citizen/ReopenComplaint/UploadPhoto";
// import Response from "./pages/citizen/Response";
import { PgrRoutes, getRoute } from "../../constants/Routes";
import { useRouteMatch, Switch } from "react-router-dom";
import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";

import { ComplaintsList } from "./ComplaintsList";
// import { ComplaintsDetail } from "./ComplaintDetail";
// import ComplaintsPage from "./Complaints";
import ComplaintDetailsPage from "./ComplaintDetails";

const CreateComplaint = () => <h2>create complaint</h2>;

const App = () => {
  const { path, url } = useRouteMatch();
  console.log("pgr citizen", path, url);

  return (
    <Switch>
      <AppContainer>
        <BackButton>Back</BackButton>

        {/* <Route path={getRoute(match, PgrRoutes.ComplaintsPage)} component={ComplaintsPage} />
        <Route exact path={getRoute(match, PgrRoutes.RatingAndFeedBack)} component={RatingAndFeedBack} />
        <Route path={getRoute(match, PgrRoutes.ComplaintDetailsPage)} component={ComplaintDetailsPage} />
        <Route exact path={getRoute(match, PgrRoutes.ReasonPage)} component={ReasonPage} />
        <Route path={getRoute(match, PgrRoutes.UploadPhoto)} component={UploadPhoto} />
        <Route path={getRoute(match, PgrRoutes.AddtionalDetails)} component={AddtionalDetails} /> */}
        {/* <Route path={getRoute(match, PgrRoutes.ComplaintsPage)} component={() => <ComplaintsPage match={match} />} />
        <Route path={getRoute(match, PgrRoutes.ComplaintDetailsPage)} component={() => <ComplaintDetailsPage match={match} />} />
        <Route path={getRoute(match, PgrRoutes.CreateComplaint)} component={CreateComplaint} />
        <Route path={getRoute(match, PgrRoutes.ReopenComplaint)} component={ReopenComplaint} />
        <Route exact path={getRoute(match, PgrRoutes.RatingAndFeedBack)} component={() => <RatingAndFeedBack match={match} />} />
        <Route exact path={getRoute(match, PgrRoutes.RatingAndFeedBack)} component={() => <RatingAndFeedBack match={match} />} /> */}

        <PrivateRoute path={`${path}/create-complaint`} component={CreateComplaint} />
        <PrivateRoute path={`${path}/complaints`} exact component={ComplaintsList} />
        <PrivateRoute path={`${path}/complaints/:id`} component={ComplaintDetailsPage} />
        <PrivateRoute path={`${path}/reopen`} component={ReopenComplaint} />
      </AppContainer>
    </Switch>
  );
};

export default App;
