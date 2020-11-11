import React from "react";
import { CreateComplaint } from "./pages/CreateComplaint/index";
import { Route, BrowserRouter as Router } from "react-router-dom";
import ComplaintDetailsPage from "./pages/ComplaintDetails";
import ComplaintsPage from "./pages/Complaints";
import RatingAndFeedBack from "./pages/Rating/Rating";
import AddtionalDetails from "./pages/ReopenComplaint/AddtionalDetails";
import ReasonPage from "./pages/ReopenComplaint/Reason";
import UploadPhoto from "./pages/ReopenComplaint/UploadPhoto";
import Response from "./pages/Response";
import { PgrRoutes } from "./constants/Routes";
import { AppContainer, BackButton } from "@egovernments/digit-ui-react-components";

const App = () => {
  return (
    <Router>
      <AppContainer>
        {/* <Route exact path="/" component={Create} /> */}
        <BackButton>Back</BackButton>
        {/* <Route path="/" component={CreateComplaint} /> */}
        <Route path={PgrRoutes.ComplaintsPage} component={ComplaintsPage} />
        <Route exact path={PgrRoutes.RatingAndFeedBack} component={RatingAndFeedBack} />
        <Route path={PgrRoutes.ComplaintDetailsPage} component={ComplaintDetailsPage} />
        <Route exact path={PgrRoutes.ReasonPage} component={ReasonPage} />
        <Route path={PgrRoutes.UploadPhoto} component={UploadPhoto} />
        <Route path={PgrRoutes.AddtionalDetails} component={AddtionalDetails} />
        <Route path={PgrRoutes.CreateComplaint} component={CreateComplaint} />
        <Route path={PgrRoutes.Response} component={Response} />
      </AppContainer>
    </Router>
  );
};

export default App;
