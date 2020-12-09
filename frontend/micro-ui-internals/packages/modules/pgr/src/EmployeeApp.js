import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContainer, EmployeeAppContainer } from "@egovernments/digit-ui-react-components";

import Complaint from "./pages/employee/index";
const App = ({ stateCode, cityCode }) => {
  return (
    <EmployeeAppContainer>
      <Complaint stateCode={stateCode} cityCode={cityCode} />
    </EmployeeAppContainer>
  );
};

export default App;
