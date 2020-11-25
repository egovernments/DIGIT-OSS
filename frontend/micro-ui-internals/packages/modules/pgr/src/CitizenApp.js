import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { CreateComplaint } from "./pages/citizen/CreateComplaint/index";
import ComplaintDetailsPage from "./pages/citizen/ComplaintDetails";
import ComplaintsPage from "./pages/citizen/Complaints";
import RatingAndFeedBack from "./pages/citizen/Rating/Rating";
import AddtionalDetails from "./pages/citizen/ReopenComplaint/AddtionalDetails";
import ReasonPage from "./pages/citizen/ReopenComplaint/Reason";
import UploadPhoto from "./pages/citizen/ReopenComplaint/UploadPhoto";
import Response from "./pages/citizen/Response";
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
