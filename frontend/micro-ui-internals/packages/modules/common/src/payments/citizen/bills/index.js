import React, { useEffect } from "react";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import Routes from "./routes";
// import { myBillMap } from "./myBillsKeysMap";

export const MyBills = ({ ...props }) => {
  const { businessService } = useParams();

  const history = useHistory();
  const { url } = useRouteMatch();

  const { isLoading, data } = Digit.Hooks.useFetchCitizenBillsForBuissnessService({ businessService });
  const { tenantId } = Digit.UserService.getUser()?.info || {};

  if (!tenantId) history.push(`/digit-ui/citizen/login`, { from: url });

  const { isLoading: mdmsLoading, data: mdmsBillingData } = Digit.Hooks.useGetPaymentRulesForBusinessServices(tenantId);

  const billsList = data?.Bill || [];

  const getPaymentRestrictionDetails = () => {
    const payRestrictiondetails = mdmsBillingData?.MdmsRes?.BillingService?.BusinessService;
    if (payRestrictiondetails?.length) return payRestrictiondetails.filter((e) => e.code == businessService)[0];
    else
      return {
        // isAdvanceAllowed: false,
        // isVoucherCreationEnabled: true,
        // minAmountPayable: 100,
        // partPaymentAllowed: true,
      };
  };

  const getProps = () => ({ billsList, paymentRules: getPaymentRestrictionDetails(), businessService });

  return (
    <React.Fragment>
      <Routes {...getProps()} />
    </React.Fragment>
  );
};
