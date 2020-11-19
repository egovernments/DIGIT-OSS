import React from "react";
import ReactDOM from "react-dom";

import initLibraries from "@egovernments/digit-ui-libraries";
import PGRApp from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";

initLibraries();

const citAuth = "da40258e-9598-44fe-8262-4d08a00c8bd1";

Digit.SessionStorage.set("citizen.token", citAuth);

ReactDOM.render(
  <>
    <Body>
      <TopBar />
      <PGRApp stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
    </Body>
  </>,
  document.getElementById("root")
);
