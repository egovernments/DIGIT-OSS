import React from "react";
import { CreateComplaint } from "./pages/CreateComplaint/index";
import { Route, BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" component={CreateComplaint} />
    </Router>
  );
};

export default App;
