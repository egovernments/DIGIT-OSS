import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import TradeLicensePage from "./components/module/TradeLicense";
import Home from "./components/module/Home";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import ServiceList from "../src/components/module/ServiceList";

function App() {
  return (
      <div>
        <BrowserRouter>
      <Switch>
        <Route exact path="/"><Home/></Route>
        <Route path="/external/create-license">
          <TradeLicensePage />
        </Route>
        <Route path = "/servicelist">
          <ServiceList/>
        </Route>
      </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
