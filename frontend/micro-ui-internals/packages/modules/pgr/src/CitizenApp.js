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
import { AppContainer, BackButton } from "@egovernments/digit-ui-react-components";

const App = () => {
  return (
    <Router>
        <AppContainer>
          {/* <Route exact path="/" component={Create} /> */}
          <BackButton>Back</BackButton>
          <Route path="/" component={CreateComplaint} />
          <Route path="/complaints" component={ComplaintsPage} />
          <Route exact path="/rate/:id" component={RatingAndFeedBack} />
          <Route path="/complaint/details/:id" component={ComplaintDetailsPage} />
          <Route exact path="/reopen/:id" component={ReasonPage} />
          <Route path="/reopen/upload-photo/:id" component={UploadPhoto} />
          <Route path="/reopen/addional-details/:id" component={AddtionalDetails} />
          <Route path="/create-complaint" component={CreateComplaint} />
          <Route path="/response" component={Response} />
        </AppContainer>
    </Router>
  );
};

export default App;
