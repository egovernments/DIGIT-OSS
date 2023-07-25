import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

const App = () => {
    const { path, url, ...match } = useRouteMatch();
    const { t } = useTranslation();

    const Create = Digit?.ComponentRegistryService?.getComponent("FSCreate");
    const Response = Digit?.ComponentRegistryService?.getComponent("Response");

    return (
        <span className={"pt-citizen"}>
            <Switch>
                <AppContainer>
                    <BackButton>Back</BackButton>
                    <PrivateRoute path={`${path}/birth`} component={Create} />
                    <PrivateRoute path={`${path}/response`} component={Response} />
                </AppContainer>
            </Switch>
        </span>
    );
};

export default App;
