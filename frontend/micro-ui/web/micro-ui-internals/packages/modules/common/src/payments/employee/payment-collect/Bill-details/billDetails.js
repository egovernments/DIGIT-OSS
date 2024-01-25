import { CardSectionHeader, Loader, RadioButtons, Row, StatusTable, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { BillDetailsKeyNoteConfig } from "./billDetailsConfig";

export const BillDetailsFormConfig = (props, t) => ({
  PT: [
    {
      head: t("ES_BILL_DETAILS_PT_DETAILS_HEADING"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: "PT", consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  mcollect: [
    {
      head: t("COMMON_PAY_SCREEN_HEADER"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: props.businessService, consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  "PT.MUTATION": [
    {
      head: t("COMMON_PAY_SCREEN_HEADER"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: props.businessService, consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  TL: [
    {
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: "TL", consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  WS: [
    {
      head: t("COMMON_PAY_SCREEN_HEADER"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: "WS", consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  "WS.ONE_TIME_FEE": [
    {
      head: t("COMMON_PAY_SCREEN_HEADER"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: "WS.ONE_TIME_FEE", consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  "SW.ONE_TIME_FEE": [
    {
      head: t("COMMON_PAY_SCREEN_HEADER"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: "SW.ONE_TIME_FEE", consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  SW: [
    {
      head: t("COMMON_PAY_SCREEN_HEADER"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: "SW", consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
  FSM: [
    {
      head: t("ES_TITLE_PAYMENT_DETAILS"),
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "amount",
            customProps: { businessService: props.businessService, consumerCode: props.consumerCode },
            component: (props, customProps) => <BillDetails onChange={props.onChange} amount={props.value} {...customProps} />,
          },
        },
      ],
    },
  ],
});

const BillDetails = ({ businessService, consumerCode, _amount, onChange }) => {
  const { t } = useTranslation();
  const { workflow: ModuleWorkflow, IsDisconnectionFlow } = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data, isLoading } = Digit.Hooks.useFetchPayment({ tenantId, businessService, consumerCode });
  const checkFSM = window.location.href.includes("FSM");

  const { isLoading: isDataLoading, data: applicationData } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: consumerCode },
    { staleTime: Infinity, enabled: businessService?.toUpperCase()?.includes("FSM") ? true : false }
  );
  const [bill, setBill] = useState();
  const [showDetails, setShowDetails] = useState(true);
  const { isLoading: isFSMLoading, isError, error, data: application, error: errorApplication } = Digit.Hooks.fsm.useApplicationDetail(
    t,
    tenantId,
    consumerCode,
    { enabled: checkFSM ? true : false },
    "EMPLOYEE"
  );
  const yearWiseBills = bill?.billDetails?.sort((a, b) => b.fromPeriod - a.fromPeriod);
  const billDetails = yearWiseBills?.[0] || [];
  // const currentYear = new Date().getFullYear();
  const getTotal = () => (bill?.totalAmount ? bill?.totalAmount : 0);
  const getTotalFSM = () => (application?.totalAmount ? application?.totalAmount : 0);
  const getAdvanceAmount = () => (applicationData?.advanceAmount ? applicationData?.advanceAmount : 0);
  const dueAmountTobePaid = () => (bill?.totalAmount ? bill?.totalAmount : 0);
  const getAmountPerTrip = () => (application?.additionalDetails?.tripAmount ? application?.additionalDetails?.tripAmount : 0);

  const arrears =
    bill?.billDetails
      ?.sort((a, b) => b.fromPeriod - a.fromPeriod)
      ?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;

  const { isLoading: mdmsLoading, data: mdmsBillingData } = Digit.Hooks.useGetPaymentRulesForBusinessServices(tenantId);
  const [paymentRules, setPaymentRules] = useState();

  useEffect(() => {
    const payRestrictiondetails = mdmsBillingData?.MdmsRes?.BillingService?.BusinessService;
    if (payRestrictiondetails?.length) {
      if (IsDisconnectionFlow) {
        setPaymentRules({
          ...payRestrictiondetails.filter((e) => e.code == businessService)[0],
          partPaymentAllowed: false,
        });
      } else setPaymentRules(payRestrictiondetails.filter((e) => e.code == businessService)[0]);
    } else
      setPaymentRules({
        // isAdvanceAllowed: false,
        // isVoucherCreationEnabled: true,
        // minAmountPayable: 100,
        // partPaymentAllowed: true,
      });
  }, [mdmsBillingData]);

  const { minAmountPayable, isAdvanceAllowed } = paymentRules || {};

  const [paymentType, setPaymentType] = useState(t("CS_PAYMENT_FULL_AMOUNT"));
  const [amount, setAmount] = useState(getTotal());
  const [paymentAllowed, setPaymentAllowed] = useState(true);
  const [formError, setError] = useState("");

  const changeAmount = (value) => {
    setAmount(value);
  };

  useEffect(() => {
    ModuleWorkflow === "mcollect" &&
      billDetails?.billAccountDetails &&
      billDetails?.billAccountDetails.map((ob) => {
        if (ob.taxHeadCode.includes("CGST")) ob.order = 3;
        else if (ob.taxHeadCode.includes("SGST")) ob.order = 4;
      });
  }, [billDetails?.billAccountDetails]);

  useEffect(() => {
    let allowPayment = minAmountPayable && amount >= minAmountPayable && amount <= getTotal() && !formError;

    if ((businessService === "WS" || businessService === "SW") && amount > getTotal() && isAdvanceAllowed) {
      allowPayment = minAmountPayable && amount >= minAmountPayable && !formError;
    }

    if (paymentType != t("CS_PAYMENT_FULL_AMOUNT")) setPaymentAllowed(allowPayment);
    else setPaymentAllowed(true);
  }, [paymentType, amount]);

  useEffect(() => {
    if (!bill && data) {
      let requiredBill = data.Bill.filter((e) => e.consumerCode == consumerCode)[0];
      setBill(requiredBill);
    }
  }, [data]);

  useEffect(() => {
    if (paymentType !== t("CS_PAYMENT_FULL_AMOUNT")) onChangeAmount(amount.toString());
    else {
      setError("");
      changeAmount(getTotal());
    }
  }, [paymentType, bill]);

  useEffect(() => {
    if (paymentType !== t("CS_PAYMENT_FULL_AMOUNT")) onChange({ amount, paymentAllowed, error: formError, minAmountPayable });
    else onChange({ amount: getTotal(), paymentAllowed: true, error: formError, minAmountPayable });
  }, [paymentAllowed, formError, amount, paymentType]);

  // for setting error
  const onChangeAmount = (value) => {
    setError("");
    if (isNaN(value) || value.includes(".")) {
      setError("AMOUNT_INVALID");
    } else if (!isAdvanceAllowed && value > getTotal()) {
      setError("CS_ADVANCED_PAYMENT_NOT_ALLOWED");
    } else if (value < minAmountPayable) {
      setError("CS_CANT_PAY_BELOW_MIN_AMOUNT");
    }
    changeAmount(value);
  };

  if (isLoading || mdmsLoading) return <Loader />;

  const getFinancialYear = (_bill) => {
    const { fromPeriod, toPeriod } = _bill;
    let from = new Date(fromPeriod).getFullYear().toString();
    let to = new Date(toPeriod).getFullYear().toString();
    return from + "-" + to;
  };

  const getBillingPeriod = (_bill) => {
    const { fromPeriod, toPeriod } = _bill;
    let from = new Date(fromPeriod).toLocaleDateString();
    let to = new Date(toPeriod).toLocaleDateString();
    return from + "-" + to;
  };

  const thStyle = { textAlign: "left", borderBottom: "#D6D5D4 1px solid", padding: "16px 12px", whiteSpace: "break-spaces" };
  const tdStyle = { textAlign: "left", borderBottom: "#D6D5D4 1px solid", padding: "8px 10px", breakWord: "no-break" };

  const config = BillDetailsKeyNoteConfig()[ModuleWorkflow ? ModuleWorkflow : businessService];
  const getAdvanceAmountPaid = applicationData?.applicationStatus === "DSO_INPROGRESS";

  const renderArrearDetailsForWNS = () => {
    return (
      <table className="table-fixed-column-common-pay">
        <thead>
          <tr>
            <th style={thStyle}>{t("CS_BILL_NO")}</th>
            <th style={{ ...thStyle }}>{t("CS_PAYMENT_BILLING_PERIOD")}</th>
            <th style={{ ...thStyle }}>{t("CS_BILL_DUEDATE")}</th>
            {yearWiseBills
              ?.filter((e, ind) => ind > 0)?.[0]
              ?.billAccountDetails?.sort((a, b) => a.order - b.order)
              ?.map((head, index) => (
                <th style={{ ...thStyle }} key={index}>
                  {t(head.taxHeadCode)}
                </th>
              ))}
            <th style={thStyle}>{t("TOTAL_TAX")}</th>
          </tr>
        </thead>
        <tbody>
          {yearWiseBills
            ?.filter((e, ind) => ind > 0)
            ?.map((year_bill, index) => {
              const sorted_tax_heads = year_bill?.billAccountDetails?.sort((a, b) => a.order - b.order);
              return (
                <tr key={index}>
                  <td style={tdStyle}>{year_bill?.billNumber}</td>
                  <td style={tdStyle}>{getBillingPeriod(year_bill)}</td>
                  <td style={tdStyle}>{year_bill?.expiryDate && new Date(year_bill?.expiryDate).toLocaleDateString()}</td>
                  {sorted_tax_heads.map((e, i) => (
                    <td style={tdStyle} key={i}>
                      {e.amount}
                    </td>
                  ))}
                  <td style={tdStyle}>{year_bill.amount}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };

  return (
    <React.Fragment>
      <StatusTable>
        {!checkFSM &&
          bill &&
          config.details.map((obj, index) => {
            const value = obj.keyPath.reduce((acc, key) => {
              if (typeof key === "function") acc = key(acc);
              else acc = acc[key];
              return acc;
            }, bill);
            return <Row key={index + "bill"} label={t(obj.keyValue)} text={value} />;
          })}
      </StatusTable>
      {checkFSM ? (
        <StatusTable>
          <Row
            label={t("ES_PAYMENT_DETAILS_AMOUNT_PER_TRIP")}
            textStyle={{ textAlign: "left" }}
            text={"₹ " + Number(getAmountPerTrip()).toFixed(2)}
          />
          <Row
            label={t("ES_PAYMENT_DETAILS_TOTAL_AMOUNT")}
            textStyle={{ textAlign: "left" }}
            text={!applicationData?.paymentPreference ? "₹ " + Number(getTotalFSM()).toFixed(2) : "₹ " + Number(bill?.totalAmount).toFixed(2)}
          />
          {!applicationData?.paymentPreference &&
            (getAdvanceAmountPaid ? (
              <Row
                label={t("ES_PAYMENT_DETAILS_ADV_AMOUNT_PAID")}
                textStyle={{ fontWeight: "bold", textAlign: "left" }}
                text={"₹ " + Number(getAdvanceAmount()).toFixed(2)}
              />
            ) : (
              <Row
                label={t("ES_PAYMENT_DETAILS_ADV_AMOUNT_DUE")}
                textStyle={{ fontWeight: "bold", textAlign: "left" }}
                text={"₹ " + Number(getAdvanceAmount()).toFixed(2)}
              />
            ))}

          {applicationData?.applicationStatus !== "PENDING_APPL_FEE_PAYMENT" ? (
            <Row
              label={t("FSM_DUE_AMOUNT_TO_BE_PAID")}
              textStyle={{ fontWeight: "bold", textAlign: "left" }}
              text={"₹ " + Number(dueAmountTobePaid()).toFixed(2)}
            />
          ) : null}
        </StatusTable>
      ) : (
        <StatusTable style={{ paddingTop: "46px" }}>
          <Row label={t("ES_PAYMENT_TAXHEADS")} textStyle={{ fontWeight: "bold" }} text={t("ES_PAYMENT_AMOUNT")} />
          <hr style={{ width: "40%" }} className="underline" />
          {billDetails?.billAccountDetails
            ?.sort((a, b) => a.order - b.order)
            .map((amountDetails, index) => (
              <Row
                key={index + "taxheads"}
                labelStyle={{ fontWeight: "normal" }}
                textStyle={{ textAlign: "right", maxWidth: "100px" }}
                label={t(amountDetails.taxHeadCode)}
                text={"₹ " + amountDetails.amount?.toFixed(2)}
              />
            ))}

          {arrears?.toFixed?.(2) ? (
            <Row
              labelStyle={{ fontWeight: "normal" }}
              textStyle={{ textAlign: "right", maxWidth: "100px" }}
              label={t("COMMON_ARREARS")}
              text={"₹ " + arrears?.toFixed?.(2) || Number(0).toFixed(2)}
            />
          ) : null}

          <hr style={{ width: "40%" }} className="underline" />
          <Row
            label={t("CS_PAYMENT_TOTAL_AMOUNT")}
            textStyle={{ fontWeight: "bold", textAlign: "right", maxWidth: "100px" }}
            text={"₹ " + Number(getTotal()).toFixed(2)}
          />

          {!showDetails && !ModuleWorkflow && businessService !== "TL" && yearWiseBills?.length > 1 && (
            <Fragment>
              {businessService === "WS" || "SW" ? (
                <div className="row last">
                  <div style={{ maxWidth: "100px" }} onClick={() => setShowDetails(true)} className="filter-button value">
                    {t("ES_COMMON_VIEW_DETAILS")}
                  </div>
                </div>
              ) : (
                <div className="row last">
                  <h2></h2>
                  <div style={{ textAlign: "right", maxWidth: "100px" }} onClick={() => setShowDetails(true)} className="filter-button value">
                    {t("ES_COMMON_VIEW_DETAILS")}
                  </div>
                </div>
              )}
            </Fragment>
          )}
        </StatusTable>
      )}
      {showDetails && yearWiseBills?.length > 1 && !ModuleWorkflow && businessService !== "TL" && (
        <React.Fragment>
          <div style={{ maxWidth: "95%", display: "inline-block", textAlign: "right" }}>
            <div style={{ display: "flex", padding: "10px", paddingLeft: "unset", maxWidth: "95%" }}>
              <div style={{ backgroundColor: "#EEEEEE", overflowX: "auto" }}>
                {businessService === "WS" || "SW" ? (
                  renderArrearDetailsForWNS()
                ) : (
                  <table className="table-fixed-column-common-pay">
                    <thead>
                      <tr>
                        <th style={thStyle}>{t("FINANCIAL_YEAR")}</th>
                        <th style={{ ...thStyle }}>{t("CS_BILL_NO")}</th>
                        <th style={{ ...thStyle }}>{t("CS_BILL_DUEDATE")}</th>
                        {yearWiseBills
                          ?.filter((e, ind) => ind > 0)?.[0]
                          ?.billAccountDetails?.sort((a, b) => a.order - b.order)
                          ?.map((head, index) => (
                            <th style={{ ...thStyle }} key={index}>
                              {t(head.taxHeadCode)}
                            </th>
                          ))}
                        <th style={thStyle}>{t("TOTAL_TAX")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearWiseBills
                        ?.filter((e, ind) => ind > 0)
                        ?.map((year_bill, index) => {
                          const sorted_tax_heads = year_bill?.billAccountDetails?.sort((a, b) => a.order - b.order);
                          return (
                            <tr key={index}>
                              <td style={tdStyle}>{getFinancialYear(year_bill)}</td>
                              <td style={tdStyle}>{year_bill?.billNumber}</td>
                              <td style={tdStyle}>{year_bill?.expiryDate && new Date(year_bill?.expiryDate).toLocaleDateString()}</td>
                              {sorted_tax_heads.map((e, i) => (
                                <td style={tdStyle} key={i}>
                                  {e.amount}
                                </td>
                              ))}
                              <td style={tdStyle}>{year_bill.amount}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            {businessService === "WS" || "SW" ? (
              <div style={{ float: "left" }} onClick={() => setShowDetails(false)} className="filter-button">
                {t("ES_COMMON_HIDE_DETAILS")}
              </div>
            ) : (
              <div style={{ float: "right" }} onClick={() => setShowDetails(false)} className="filter-button">
                {t("ES_COMMON_HIDE_DETAILS")}
              </div>
            )}
          </div>
        </React.Fragment>
      )}
      {!checkFSM && paymentRules?.partPaymentAllowed && (
        <div style={{ marginTop: "50px" }} className="bill-payment-amount">
          <CardSectionHeader>{t("CS_COMMON_PAYMENT_AMOUNT")}</CardSectionHeader>
          <RadioButtons
            style={{ display: "flex" }}
            innerStyles={{ padding: "5px" }}
            selectedOption={paymentType}
            onSelect={setPaymentType}
            options={paymentRules.partPaymentAllowed ? [t("CS_PAYMENT_FULL_AMOUNT"), t("CS_PAYMENT_CUSTOM_AMOUNT")] : [t("CS_PAYMENT_FULL_AMOUNT")]}
          />
          <div style={{ position: "relative" }}>
            <span
              className="payment-amount-front"
              style={{ border: `1px solid ${paymentType === t("CS_PAYMENT_FULL_AMOUNT") ? "#9a9a9a" : "black"}` }}
            >
              ₹
            </span>
            {paymentType !== t("CS_PAYMENT_FULL_AMOUNT") ? (
              <TextInput
                style={{ width: "30%" }}
                className="text-indent-xl"
                onChange={(e) => onChangeAmount(e.target.value)}
                value={amount}
                disable={getTotal() === 0}
              />
            ) : (
              <TextInput style={{ width: "30%" }} className="text-indent-xl" value={getTotal()} disable={true} />
            )}
            {formError === "CS_CANT_PAY_BELOW_MIN_AMOUNT" ? (
              <span className="card-label-error">
                {t(formError)}: {"₹" + minAmountPayable}
              </span>
            ) : (
              <span className="card-label-error">{t(formError)}</span>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default BillDetails;
