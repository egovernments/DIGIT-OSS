import React from "react";
import { AppContainer, EmployeeAppContainer } from "@egovernments/digit-ui-react-components";

import Complaint from "./pages/employee/index";
const App = () => {
  return (
    <EmployeeAppContainer>
      <Complaint />
    </EmployeeAppContainer>
  );
};

export default App;
