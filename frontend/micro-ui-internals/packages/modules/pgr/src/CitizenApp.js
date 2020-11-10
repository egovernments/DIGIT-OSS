import React from "react";
import { CreateComplaint } from "./pages/CreateComplaint/index";
import { Route, BrowserRouter as Router } from "react-router-dom";
import ComplaintDetailsPage from "./pages/ComplaintDetails";
import ComplaintsPage from "./pages/Complaints";
import RatingAndFeedBack from "./pages/Rating/Rating";
import AddtionalDetails from "./pages/ReopenComplaint/AddtionalDetails";
import ReasonPage from "./pages/ReopenComplaint/Reason";
import UploadPhoto from "./pages/ReopenComplaint/UploadPhoto";

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={Create} />
      <Route path="/complaints" component={ComplaintsPage} />
      <Route exact path="/rate/:id" component={RatingAndFeedBack} />
      <Route path="/complaint/details/:id" component={ComplaintDetailsPage} />
      <Route exact path="/reopen/:id" component={ReasonPage} />
      <Route path="/reopen/upload-photo/:id" component={UploadPhoto} />
      <Route path="/reopen/addional-details/:id" component={AddtionalDetails} />
      <Route path="/" component={CreateComplaint} />
    </Router>
  );
};

export default App;
