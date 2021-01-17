import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import getRootReducer from "./redux/reducers";
import CitizenApp from "./pages/citizen";

import EmployeeApp from "./EmployeeApp";
import { Header, HomeLink, Loader } from "@egovernments/digit-ui-react-components";
import { PGR_CITIZEN_CREATE_COMPLAINT } from "./constants/Citizen";

export const PGRReducers = getRootReducer;

export const PGRModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "PGR";
  const state = useSelector((state) => state["pgr"]);
  const language = state?.common?.selectedLanguage;
  const store = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  Digit.SessionStorage.set("PGR_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp />;
  } else {
    return <EmployeeApp />;
  }
};

export const PGRLinks = ({ matchPath }) => {
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {});

  useEffect(() => {
    clearParams();
  }, []);

  return (
    <React.Fragment>
      <Header>Complaints</Header>
      <HomeLink to={`${matchPath}/create-complaint/complaint-type`}>File a Complaint</HomeLink>
      <HomeLink to={`${matchPath}/complaints`}>My Complaints</HomeLink>
    </React.Fragment>
  );
};
