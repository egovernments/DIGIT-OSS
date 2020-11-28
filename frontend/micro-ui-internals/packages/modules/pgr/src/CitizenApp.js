import React from "react";
import { CreateComplaint } from "./pages/citizen/CreateComplaint/index";
import { ReopenComplaint } from "./pages/citizen/ReopenComplaint/index";
import ComplaintDetailsPage from "./pages/citizen/ComplaintDetails";
import ComplaintsPage from "./pages/citizen/Complaints";
import RatingAndFeedBack from "./pages/citizen/Rating/Rating";
import AddtionalDetails from "./pages/citizen/ReopenComplaint/AddtionalDetails";
import ReasonPage from "./pages/citizen/ReopenComplaint/Reason";
import UploadPhoto from "./pages/citizen/ReopenComplaint/UploadPhoto";
import Response from "./pages/citizen/Response";
import { PgrRoutes, getRoute } from "./constants/Routes";
import { Route, BrowserRouter as Router, useRouteMatch } from "react-router-dom";
import { AppContainer, BackButton } from "@egovernments/digit-ui-react-components";

const App = () => {
  const match = useRouteMatch();

  return (
    <Router>
      <AppContainer>
        {/* <Route exact path="/" component={Create} /> */}
        <BackButton>Back</BackButton>
        {/* <Route path="/" component={CreateComplaint} /> */}

        {/* <Route path={getRoute(match, PgrRoutes.ComplaintsPage)} component={ComplaintsPage} />
        <Route exact path={getRoute(match, PgrRoutes.RatingAndFeedBack)} component={RatingAndFeedBack} />
        <Route path={getRoute(match, PgrRoutes.ComplaintDetailsPage)} component={ComplaintDetailsPage} />
        <Route exact path={getRoute(match, PgrRoutes.ReasonPage)} component={ReasonPage} />
        <Route path={getRoute(match, PgrRoutes.UploadPhoto)} component={UploadPhoto} />
        <Route path={getRoute(match, PgrRoutes.AddtionalDetails)} component={AddtionalDetails} /> */}
        <Route path={getRoute(match, PgrRoutes.ComplaintsPage)} component={() => <ComplaintsPage match={match} />} />
        <Route path={getRoute(match, PgrRoutes.ComplaintDetailsPage)} component={() => <ComplaintDetailsPage match={match} />} />
        <Route path={getRoute(match, PgrRoutes.CreateComplaint)} component={CreateComplaint} />
        <Route path={getRoute(match, PgrRoutes.ReopenComplaint)} component={ReopenComplaint} />
        <Route exact path={getRoute(match, PgrRoutes.RatingAndFeedBack)} component={() => <RatingAndFeedBack match={match} />} />
      </AppContainer>
    </Router>
  );
};

export default App;
