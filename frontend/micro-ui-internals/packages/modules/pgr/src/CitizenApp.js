import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

const Create = () => {
  return <>Create Complaint</>;
};

const App = () => {
  return (
    <Router>
      <Route path="/" component={Create} />
    </Router>
  );
};

export default App;
