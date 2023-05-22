import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useParams, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import Routes from "./routes";
// import { myBillMap } from "./myBillsKeysMap";

export const MyBills = ({ stateCode }) => {
  const { businessService } = useParams();
  const { tenantId: _tenantId, isDisoconnectFlow } = Digit.Hooks.useQueryParams();

  const { isLoading: storeLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode: businessService,
    language: Digit.StoreData.getCurrentLanguage(),
  });

  const history = useHistory();
  const { url } = useRouteMatch();
  const location = useLocation();

  const { tenantId } = Digit.UserService.getUser()?.info || location?.state || { tenantId: _tenantId } || {};

  if (!tenantId && !location?.state?.fromSearchResults) {
    history.replace(`/${window?.contextPath}/citizen/login`, { from: url });
  }

  const { isLoading, data } = Digit.Hooks.useFetchCitizenBillsForBuissnessService(
    { businessService },
    { refetchOnMount: true, enabled: !location?.state?.fromSearchResults }
  );
  const { isLoading: mdmsLoading, data: mdmsBillingData } = Digit.Hooks.useGetPaymentRulesForBusinessServices(tenantId);

  const billsList = data?.Bill || [];

  const getPaymentRestrictionDetails = () => {
    const payRestrictiondetails = mdmsBillingData?.MdmsRes?.BillingService?.BusinessService;
    let updatedBussinessService = ((businessService === "WS" || businessService === "SW") && isDisoconnectFlow === "true") ? "DISCONNECT" : businessService;
    if (payRestrictiondetails?.length) return payRestrictiondetails.filter((e) => e.code == updatedBussinessService)?.[0]||{
      isAdvanceAllowed: false,
      isVoucherCreationEnabled: true,
      minAmountPayable: 100,
      partPaymentAllowed: false,
    };
    else
      return {
        // isAdvanceAllowed: false,
        // isVoucherCreationEnabled: true,
        // minAmountPayable: 100,
        // partPaymentAllowed: true,
      };
  };

  const getProps = () => ({ billsList, paymentRules: getPaymentRestrictionDetails(), businessService });

  if (mdmsLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Routes {...getProps()} />
    </React.Fragment>
  );
};
