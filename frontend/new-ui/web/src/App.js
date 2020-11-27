import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";

function App() {
  return (
    <Router>
      <Body>
        <TopBar />
        <Switch>
          <Route path="/digit-ui/pgr">
            <PGRModule stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
          </Route>
          <Route>
            <PGRLinks />
          </Route>
        </Switch>
      </Body>
    </Router>
  );
}

export default App;
