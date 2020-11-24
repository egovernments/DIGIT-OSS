import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";
import PGRApp from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";

const GetLink = ({ to, children }) => (
  <Link to={to} style={{ marginLeft: 16 }}>
    {children}
  </Link>
);

function App() {
  return (
    <Router>
      <Body>
        <TopBar />
        <Switch>
          <Route path="/digit-ui/pgr">
            <PGRApp stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
          </Route>
          <Route>
            <Header>Home page</Header>
            <GetLink to="/digit-ui/pgr/citizen/create-complaint">Create Complaint</GetLink>
            <br />
            <GetLink to="/digit-ui/pgr/citizen/complaints">My Complaint</GetLink>
          </Route>
        </Switch>
      </Body>
    </Router>
  );
}

export default App;
