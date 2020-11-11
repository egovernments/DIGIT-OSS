import React from "react";
import ReactDOM from "react-dom";

import initLibraries from "@egovernments/digit-ui-libraries";
import PGRApp from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";

initLibraries();

const citAuth = "c54c09cd-56c5-4193-a59d-76c3867500c8";

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
