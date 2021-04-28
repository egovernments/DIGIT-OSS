import React from "react";
import { Route, Switch } from "react-router-dom";
import FileUploader from "../create-job";
import UserJobs from "../jobs";
import LoginUser from "./Login";

// const urlParts = window.location.pathname.split("/");
// const base = urlParts.slice(0, urlParts.length - 1).join("/");
const base ="";
const Main = () => {
  return (
    <main>
      <Switch>
        <Route exact path={`${base}/`} component={LoginUser} />
        <Route exact path={`${base}/view-jobs`} component={UserJobs} />
        <Route exact path={`${base}/file-uploader`} component={FileUploader} />
      </Switch>
    </main>
  );
};

export default Main;
