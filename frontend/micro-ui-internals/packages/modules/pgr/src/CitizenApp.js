import React from "react";
import { CreateComplaint } from "./pages/CreateComplaint/index";
import { Route, BrowserRouter as Router } from "react-router-dom";
import RatingAndFeedBack from "./pages/Rating/Rating";

const App = () => {
  return (
    <Router>
      <Route path="/create-complaint" component={CreateComplaint} />
      <Route exact path="/rating" component={RatingAndFeedBack} />
    </Router>
  );
};

export default App;
