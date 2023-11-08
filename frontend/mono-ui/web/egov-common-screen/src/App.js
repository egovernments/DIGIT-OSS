import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import TradeLicensePage from "./components/module/TradeLicense";
import Home from "./components/module/Home";

function App() {
  return (
      <div>
      <Switch>
        <Route exact path="/"><Home/></Route>
        <Route path="/citizen/external/create-license"><TradeLicensePage /></Route>
      </Switch>
    </div>
  );
}
export default App;
