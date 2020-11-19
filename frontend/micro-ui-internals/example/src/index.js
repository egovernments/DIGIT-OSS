import React from "react";
import ReactDOM from "react-dom";

import initLibraries from "@egovernments/digit-ui-libraries";
import PGRApp from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";

initLibraries();

const citAuth = "9ee85f07-1031-428a-8292-b360e3d8ce65";

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
