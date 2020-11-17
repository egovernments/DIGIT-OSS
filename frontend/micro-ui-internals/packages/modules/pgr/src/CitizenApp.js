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
import { Citizen } from "./constants/Routes";
import { AppContainer, BackButton } from "@egovernments/digit-ui-react-components";

const App = () => {
  return (
    <Router>
      <AppContainer>
        {/* <Route exact path="/" component={Create} /> */}
        <BackButton>Back</BackButton>
        {/* <Route path="/" component={CreateComplaint} /> */}
        <Route path={Citizen.ComplaintsPage} component={ComplaintsPage} />
        <Route exact path={Citizen.RatingAndFeedBack} component={RatingAndFeedBack} />
        <Route path={Citizen.ComplaintDetailsPage} component={ComplaintDetailsPage} />
        <Route exact path={Citizen.ReasonPage} component={ReasonPage} />
        <Route path={Citizen.UploadPhoto} component={UploadPhoto} />
        <Route path={Citizen.AddtionalDetails} component={AddtionalDetails} />
        <Route path={Citizen.CreateComplaint} component={CreateComplaint} />
        <Route path={Citizen.Response} component={Response} />
      </AppContainer>
    </Router>
  );
};

export default App;
