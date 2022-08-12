import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();

  const BRManageApplication = Digit?.ComponentRegistryService?.getComponent("BRManageApplication");
  const RegisterDetails = Digit?.ComponentRegistryService?.getComponent("RegisterDetails");

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
       
        <PrivateRoute path={`${path}/details`} component={() => <RegisterDetails />} />
          <PrivateRoute path={`${path}/myapplication`} component={() => <BRManageApplication />} />

        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
