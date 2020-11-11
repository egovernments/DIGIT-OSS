import React from "react";
import { CreateComplaint } from "./pages/CreateComplaint/index";
import { Route, BrowserRouter as Router } from "react-router-dom";
import RatingAndFeedBack from "./pages/Rating/Rating";
import { AppContainer, TopBar, Body } from "@egovernments/digit-ui-react-components";

const App = () => {
  return (
      <Router>
        <Body>
          <TopBar />
          <AppContainer>
            <Route path="/create-complaint" component={CreateComplaint} />
            <Route exact path="/rating" component={RatingAndFeedBack} />
          </AppContainer>
        </Body>
      </Router>
  );
};

export default App;
