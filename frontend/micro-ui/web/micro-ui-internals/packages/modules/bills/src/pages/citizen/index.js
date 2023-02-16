import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Inbox from "../../pages/citizen/SearchBill/Inbox";
import { useTranslation } from "react-i18next";

const App = () => {
  const { path, url, ...match } = useRouteMatch();
  const { t } = useTranslation();
  const inboxInitialState = {
    searchParams: {},
  };
  return (
    <span className={"bill-citizen"}>
      <Switch>
        <AppContainer>
          <BackButton>Back</BackButton>
          <PrivateRoute
            path={`${path}/billSearch`}
            component={(props) => <Inbox filterComponent="CITIZEN_SEARCH_FILTER" initialStates={inboxInitialState} isInbox={true} />}
          />
        </AppContainer>
      </Switch>
    </span>
  );
};
export default App;
