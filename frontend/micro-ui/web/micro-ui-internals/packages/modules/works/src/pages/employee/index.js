import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Switch } from "react-router-dom";

const App = ({ path }) => {
  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <PrivateRoute path={`${path}/create-application`} component={() => <div>Hi</div>} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default App;
