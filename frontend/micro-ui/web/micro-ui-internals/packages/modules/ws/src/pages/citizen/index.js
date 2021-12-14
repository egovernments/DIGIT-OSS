import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";

const App = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();
  return (
        <React.Fragment>
          <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>
          <Switch>
            {/* <PrivateRoute path={`${path}/home`} component={} /> */}
          </Switch>
        </React.Fragment>
  )
}

export default App;