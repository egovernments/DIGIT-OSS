import React from "react";
import ReactDOM from "react-dom";

import initLibraries from "@egovernments/digit-ui-libraries";
import PGRApp from "@egovernments/digit-ui-module-pgr";

initLibraries();

ReactDOM.render(
  <>
    <p>Topbar</p>
    <PGRApp deltaConfig={} stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
  </>,
  document.getElementById("root")
);
