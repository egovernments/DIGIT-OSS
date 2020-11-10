import React from "react";
import { CreateComplaint } from "./pages/CreateComplaint";
import { Route, BrowserRouter as Router } from "react-router-dom";
import RatingAndFeedBack from "./pages/Rating/Rating";

const App = () => {
  console.log("citizen app loaded");
  return (
    <Router>
      <Route path="/" component={CreateComplaint} />
      <Route exact path="/rating" component={RatingAndFeedBack} />
    </Router>
  );
};

export default App;
