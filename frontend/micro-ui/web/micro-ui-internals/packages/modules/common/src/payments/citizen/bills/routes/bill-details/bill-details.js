import { Card, CardSubHeader, Header, KeyNote, Loader, RadioButtons, SubmitBar, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ArrearSummary from "./arrear-summary";
import BillSumary from "./bill-summary";
import { stringReplaceAll } from "./utils";

const BillDetails = ({ paymentRules, businessService }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state, pathname, search } = useLocation();
  const userInfo = Digit.UserService.getUser();
  let { consumerCode } = useParams();
  const { workflow: wrkflow, tenantId: _tenantId, authorization, ConsumerName } = Digit.Hooks.useQueryParams();
  const [bill, setBill] = useState(state?.bill);
  const tenantId = state?.tenantId || _tenantId || Digit.UserService.getUser().info?.tenantId;
  const propertyId = state?.propertyId;
  if (wrkflow === "WNS" && consumerCode.includes("?")) consumerCode = consumerCode.substring(0, consumerCode.indexOf("?"));
  const { data, isLoading } = state?.bill
    ? { isLoading: false }
    : Digit.Hooks.useFetchPayment({
        tenantId,
        businessService,
        consumerCode: wrkflow === "WNS" ? stringReplaceAll(consumerCode, "+", "/") : consumerCode,
      });

  let Useruuid = data?.Bill?.[0]?.userId || "";
  let requestCriteria = [
    "/user/_search",
    {},
    { data: { uuid: [Useruuid] } },
    { recordId: Useruuid, plainRequestFields: ["mobileNumber"] },
    {
      enabled: Useruuid ? true : false,
      cacheTime: 100,
    },
  ];

  const { isLoading: isUserLoading, data: userData, revalidate } = Digit.Hooks.useCustomAPIHook(...requestCriteria);
  
  const { isLoading: isFSMLoading, isError, error, data: application, error: errorApplication } = Digit.Hooks.fsm.useApplicationDetail(
    t,
    tenantId,
    consumerCode,
    { enabled: pathname.includes("FSM") ? true : false },
    "CITIZEN"
  );
  let { minAmountPayable, isAdvanceAllowed } = paymentRules;
  minAmountPayable = wrkflow === "WNS" ? 100 : minAmountPayable;
  const billDetails = bill?.billDetails?.sort((a, b) => b.fromPeriod - a.fromPeriod)?.[0] || [];
  const Arrears =
    bill?.billDetails
      ?.sort((a, b) => b.fromPeriod - a.fromPeriod)
      ?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;

  const { key, label } = Digit.Hooks.useApplicationsForBusinessServiceSearch({ businessService }, { enabled: false });

  const getBillingPeriod = () => {
    const { fromPeriod, toPeriod } = billDetails;
    if (fromPeriod && toPeriod) {
      let from, to;
      if (wrkflow === "mcollect" || wrkflow === "WNS") {
        from =
          new Date(fromPeriod).getDate().toString() +
          " " +
          Digit.Utils.date.monthNames[new Date(fromPeriod).getMonth()]?.toString() +
          " " +
          new Date(fromPeriod).getFullYear().toString();
        to =
          new Date(toPeriod).getDate() +
          " " +
          Digit.Utils.date.monthNames[new Date(toPeriod).getMonth()] +
          " " +
          new Date(toPeriod).getFullYear();
        return from + " - " + to;
      }
      from = new Date(billDetails.fromPeriod).getFullYear().toString();
      to = new Date(billDetails.toPeriod).getFullYear().toString();
      if (from === to) {
        if(window.location.href.includes("BPA"))
        {
          if(new Date(data?.Bill?.[0]?.billDate).getMonth()+1 < 4)
          {
            let newfrom =  (parseInt(from)-1).toString();
            return "FY " + newfrom + "-" + to;
          }
          else
          {
            let newTo = (parseInt(to)+1).toString();
            return "FY " + from + "-" + newTo;
          }
        }
        else
        return "FY " + from;
      }
      return "FY " + from + "-" + to;
    } else return "N/A";
  };

  const getBillBreakDown = () => billDetails?.billAccountDetails || [];

  const getTotal = () => bill?.totalAmount || 0;
  const getAdvanceAmount = () => application?.pdfData?.advanceAmount;

  const [paymentType, setPaymentType] = useState(t("CS_PAYMENT_FULL_AMOUNT"));
  const [amount, setAmount] = useState(getTotal());
  const [paymentAllowed, setPaymentAllowed] = useState(true);
  const [formError, setError] = useState("");

  if (authorization === "true" && !userInfo?.access_token) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = `/${window?.contextPath}/citizen/login?from=${encodeURIComponent(pathname + search)}`;
  }
  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paymentType == t("CS_PAYMENT_FULL_AMOUNT")) setAmount(getTotal());
  }, [paymentType, bill]);

  useEffect(() => {
    let changeAdvanceAllowed = isAdvanceAllowed;
    if (isAdvanceAllowed && wrkflow === "WNS") changeAdvanceAllowed = false;
    const allowPayment = minAmountPayable && amount >= minAmountPayable && !changeAdvanceAllowed && amount <= getTotal() && !formError;
    if (paymentType != t("CS_PAYMENT_FULL_AMOUNT")) setPaymentAllowed(allowPayment);
    else setPaymentAllowed(true);
  }, [paymentType, amount]);

  useEffect(() => {
    if (!isFSMLoading && application?.pdfData?.applicationStatus === "PENDING_APPL_FEE_PAYMENT") {
      setPaymentAllowed(true);
      setPaymentType(t("CS_PAYMENT_ADV_COLLECTION"));
    }
  });

  useEffect(() => {
    if (!bill && data) {
      let requiredBill = data.Bill.filter((e) => e.consumerCode == (wrkflow === "WNS" ? stringReplaceAll(consumerCode, "+", "/") : consumerCode))[0];
      setBill(requiredBill);
    }
  }, [isLoading]);

  const onSubmit = () => {
    let paymentAmount =
      paymentType === t("CS_PAYMENT_FULL_AMOUNT")
        ? getTotal()
        : amount || businessService === "FSM.TRIP_CHARGES"
        ? application?.pdfData?.advanceAmount
        : amount;
    if (window.location.href.includes("mcollect")) {
      history.push(`/${window?.contextPath}/citizen/payment/collect/${businessService}/${consumerCode}?workflow=mcollect`, {
        paymentAmount,
        tenantId: billDetails.tenantId,
      });
    } else if (wrkflow === "WNS") {
      history.push(`/${window?.contextPath}/citizen/payment/billDetails/${businessService}/${consumerCode}/${paymentAmount}?workflow=WNS&ConsumerName=${ConsumerName}`, {
        paymentAmount,
        tenantId: billDetails.tenantId,
        name: bill.payerName,
        mobileNumber: bill.mobileNumber && bill.mobileNumber?.includes("*") ? userData?.user?.[0]?.mobileNumber : bill.mobileNumber,
      });
    } else if (businessService === "PT") {
      history.push(`/${window?.contextPath}/citizen/payment/billDetails/${businessService}/${consumerCode}/${paymentAmount}`, {
        paymentAmount,
        tenantId: billDetails.tenantId,
        name: bill.payerName,
        mobileNumber: bill.mobileNumber && bill.mobileNumber?.includes("*") ? userData?.user?.[0]?.mobileNumber : bill.mobileNumber,      });
    } else {
      history.push(`/${window?.contextPath}/citizen/payment/collect/${businessService}/${consumerCode}`, { paymentAmount, tenantId: billDetails.tenantId, propertyId: propertyId });
    }
  };

  const onChangeAmount = (value) => {
    setError("");
    if (isNaN(value) || value.includes(".")) {
      setError("AMOUNT_INVALID");
    } else if (!isAdvanceAllowed && value > getTotal()) {
      setError("CS_ADVANCED_PAYMENT_NOT_ALLOWED");
    } else if (value < minAmountPayable) {
      setError("CS_CANT_PAY_BELOW_MIN_AMOUNT");
    }
    setAmount(value);
  };

  if (isLoading || isFSMLoading) return <Loader />;

  return (
    <React.Fragment>
      <Header>{t("CS_PAYMENT_BILL_DETAILS")}</Header>
      <Card>
        <div>
          <KeyNote
            keyValue={t(businessService == "PT.MUTATION" ? "PDF_STATIC_LABEL_MUATATION_NUMBER_LABEL" : label)}
            note={wrkflow === "WNS" ? stringReplaceAll(consumerCode, "+", "/") : consumerCode}
          />
          {businessService !== "PT.MUTATION" && businessService !== "FSM.TRIP_CHARGES" && (
            <KeyNote keyValue={t("CS_PAYMENT_BILLING_PERIOD")} note={getBillingPeriod()} />
          )}
          {businessService?.includes("PT") ||
            (wrkflow === "WNS" && billDetails?.currentBillNo && <KeyNote keyValue={t("CS_BILL_NO")} note={billDetails?.currentBillNo} />)}
          {businessService?.includes("PT") ||
            (wrkflow === "WNS" && billDetails?.currentExpiryDate && (
              <KeyNote keyValue={t("CS_BILL_DUEDATE")} note={new Date(billDetails?.currentExpiryDate).toLocaleDateString()} />
            ))}
          {businessService === "FSM.TRIP_CHARGES" ? (
            <div>
              <KeyNote keyValue={t("ES_PAYMENT_DETAILS_TOTAL_AMOUNT")} note={application?.pdfData?.totalAmount} />
              <KeyNote keyValue={t("ES_PAYMENT_DETAILS_ADV_AMOUNT")} note={application?.pdfData?.advanceAmount} />
              {application?.pdfData?.applicationStatus !== "PENDING_APPL_FEE_PAYMENT" ? (
                <KeyNote keyValue={t("FSM_DUE_AMOUNT_TO_BE_PAID")} note={bill?.totalAmount} />
              ) : null}
            </div>
          ) : (
            <BillSumary billAccountDetails={getBillBreakDown()} total={getTotal()} businessService={businessService} arrears={Arrears} />
          )}
          <ArrearSummary bill={bill} />
        </div>

        <div className="bill-payment-amount">
          <hr className="underline" />
          <CardSubHeader>{t("CS_COMMON_PAYMENT_AMOUNT")}</CardSubHeader>
          {businessService === "FSM.TRIP_CHARGES" ? null : (
            <RadioButtons
              selectedOption={paymentType}
              onSelect={setPaymentType}
              options={
                paymentRules.partPaymentAllowed &&
                application?.pdfData?.paymentPreference !== "POST_PAY" &&
                application?.pdfData?.applicationStatus === "PENDING_APPL_FEE_PAYMENT"
                  ? [t("CS_PAYMENT_ADV_COLLECTION")]
                  : [t("CS_PAYMENT_FULL_AMOUNT")]
              }
            />
          )}

          <div style={{ position: "relative" }}>
            <span
              className="payment-amount-front"
              style={{ border: `1px solid ${paymentType === t("CS_PAYMENT_FULL_AMOUNT") ? "#9a9a9a" : "#9a9a9a"}` }}
            >
              ₹
            </span>
            {paymentType !== t("CS_PAYMENT_FULL_AMOUNT") ? (
              businessService === "FSM.TRIP_CHARGES" ? (
                <TextInput className="text-indent-xl" onChange={() => {}} value={getAdvanceAmount()} disable={true} />
              ) : (
                <TextInput className="text-indent-xl" onChange={(e) => onChangeAmount(e.target.value)} value={amount} disable={getTotal() === 0} />
              )
            ) : (
              <TextInput className="text-indent-xl" value={getTotal()} onChange={() => {}} disable={true} />
            )}
            {formError === "CS_CANT_PAY_BELOW_MIN_AMOUNT" ? (
              <span className="card-label-error">
                {t(formError)}: {"₹" + minAmountPayable}
              </span>
            ) : (
              <span className="card-label-error">{t(formError)}</span>
            )}
          </div>
          <SubmitBar disabled={!paymentAllowed || getTotal() === 0} onSubmit={onSubmit} label={t("CS_COMMON_PROCEED_TO_PAY")} />
        </div>
      </Card>
    </React.Fragment>
  );
};

export default BillDetails;
