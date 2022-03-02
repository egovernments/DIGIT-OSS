import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { BillList } from "./my-bills/my-bills";
import BillDetails from "./bill-details/bill-details";
import { BackButton } from "@egovernments/digit-ui-react-components";

const BillRoutes = ({ billsList, paymentRules, businessService }) => {
  const { url: currentPath, ...match } = useRouteMatch();

  return (
    <React.Fragment>
      <BackButton />
      <Switch>
        <Route exact path={`${currentPath}`} component={() => <BillList {...{ billsList, currentPath, paymentRules, businessService }} />} />
        <Route path={`${currentPath}/:consumerCode`} component={() => <BillDetails {...{ paymentRules, businessService }} />} />
      </Switch>
    </React.Fragment>
  );
};

export default BillRoutes;
