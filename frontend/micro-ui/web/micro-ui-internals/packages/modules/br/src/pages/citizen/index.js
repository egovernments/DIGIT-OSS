import { AppContainer, BackButton,PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import {  Switch, useRouteMatch } from "react-router-dom";
// import { shouldHideBackButton } from "../../utils";
import { useTranslation } from "react-i18next";

// const hideBackButtonConfig = [
//   { screenPath: "property/new-application/acknowledgement" },
//   { screenPath: "property/edit-application/acknowledgement" },
// ];

const App = () => {
  const { path, url, ...match } = useRouteMatch();
  const { t } = useTranslation();

  const Create = Digit?.ComponentRegistryService?.getComponent("BRCreate");

  return (
    <span className={"pt-citizen"}>
      <Switch>
        <AppContainer>
        {/* {!shouldHideBackButton(hideBackButtonConfig) ? <BackButton>Back</BackButton> : ""} */}
        <BackButton>Back</BackButton> 
          <PrivateRoute path={`${path}/birth`} component={Create} />
         
        </AppContainer>
      </Switch>
    </span>
  );
};

export default App;
