import React, { useState, useEffect } from "react";
import { Switch, useLocation, Link } from "react-router-dom";
import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Search from "./Search";
const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
 console.log("pathIndex",path);
 debugger;
  

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container" style={{width: "100%"}}>        
          <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>        
          <PrivateRoute path={`${path}/search/application`} component={(props) => <Search {...props} parentRoute={path} />} />
          
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
