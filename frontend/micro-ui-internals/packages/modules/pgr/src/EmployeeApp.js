import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Employee } from "./constants/Routes";
import { AppContainer, BackButton } from "@egovernments/digit-ui-react-components";
import Inbox from "./pages/citizen/inbox";

const App = () => {
  console.log("Employee.Inbox:", Employee.Inbox);
  return (
    <Router>
      <AppContainer>
        {/* <Route exact path="/" component={Create} /> */}
        <BackButton>Back</BackButton>
        {/* <Route path="/" component={CreateComplaint} /> */}
        <Route path={Employee.Inbox} component={Inbox} />
      </AppContainer>
    </Router>
  );
};

export default App;
