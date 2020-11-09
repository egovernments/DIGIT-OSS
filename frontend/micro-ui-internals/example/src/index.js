import React from "react";
import ReactDOM from "react-dom";

import initLibraries from "@egovernments/digit-ui-libraries";
import PGRApp from "@egovernments/digit-ui-module-pgr";

initLibraries();

ReactDOM.render(
  <>
    <p>Topbar</p>
    <PGRApp />
  </>,
  document.getElementById("root")
);
