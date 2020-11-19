import React from "react";
import ReactDOM from "react-dom";
import initLibraries from "@egovernments/digit-ui-libraries";
import PGRApp from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";
initLibraries();

const userServiceData = {
  userInfo: {
    id: 23349,
    uuid: "530968f3-76b3-4fd1-b09d-9e22eb1f85df",
    userName: "9404052047",
    name: "Aniket T",
    mobileNumber: "9404052047",
    emailId: "xc@gmail.com",
    locale: null,
    type: "CITIZEN",
    roles: [
      {
        name: "Citizen",
        code: "CITIZEN",
        tenantId: "pb",
      },
    ],
    active: true,
    tenantId: "pb",
  },
};

Digit.SessionStorage.set("citizen.userServiceData", userServiceData);
const citAuth = "9ee85f07-1031-428a-8292-b360e3d8ce65";

Digit.SessionStorage.set("citizen.token", citAuth);

ReactDOM.render(
  <>
    <Body>
      {/* <TopBar /> */}
      <PGRApp stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
    </Body>
  </>,
  document.getElementById("root")
);
