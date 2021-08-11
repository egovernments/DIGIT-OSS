import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import NewBuildingPermit from "./NewBuildingPermit";

const App = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {!location.pathname.includes("response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
      <Switch>
        <PrivateRoute
          path={`${path}/new-building-permit`}
          component={() => <NewBuildingPermit />}
        />      
      </Switch>
    </React.Fragment>
  )
}

export default App; 