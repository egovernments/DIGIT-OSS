import React, { useEffect, useState } from "react";
import { RadioButtons, FormComposer, Dropdown, CardSectionHeader, Loader, Toast, Card, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useCashPaymentDetails } from "./ManualReciept";
import { useCardPaymentDetails } from "./card";
import { useChequeDetails } from "./cheque";
import isEqual from "lodash/isEqual";
import { BillDetailsFormConfig } from "./Bill-details/billDetails";

export const CollectPayment = (props) => {
  // const { formData, addParams } = props;
  const { workflow: ModuleWorkflow, IsDisconnectionFlow } = Digit.Hooks.useQueryParams();
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { path: currentPath } = useRouteMatch();
  let { consumerCode, businessService } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const search = useLocation().search;
  if (window.location.href.includes("ISWSAPP")) consumerCode = new URLSearchParams(search).get("applicationNumber");
  if (window.location.href.includes("ISWSCON") || ModuleWorkflow === "WS") consumerCode = decodeURIComponent(consumerCode);

  const { data: paymentdetails, isLoading } = Digit.Hooks.useFetchPayment({ tenantId: tenantId, consumerCode, businessService });
  const bill = paymentdetails?.Bill ? paymentdetails?.Bill[0] : {};
  const { data: applicationData } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: consumerCode },
    { staleTime: Infinity, enabled: businessService?.toUpperCase()?.includes("FSM") ? true : false }
  );

  const advanceBill = applicationData?.advanceAmount;

  // const { data: applicationData } = Digit.Hooks.fsm.useSearch(tenantId, { applicationNos: consumerCode }, { staleTime: Infinity });
  // const advanceBill = applicationData?.advanceAmount;

  // const { isLoading: storeLoading, data: store } = Digit.Services.useStore({
  //   stateCode: props.stateCode,
  //   moduleCode: businessService.split(".")[0],
  //   language: Digit.StoreData.getCurrentLanguage(),
  // });

  const { cardConfig } = useCardPaymentDetails(props, t);
  const { chequeConfig } = useChequeDetails(props, t);
  const { cashConfig } = useCashPaymentDetails(props, t);

  const [formState, setFormState] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (paymentdetails?.Bill && paymentdetails.Bill.length === 0) {
      setToast({ key: "error", action: "CS_BILL_NOT_FOUND" });
    }
  }, [paymentdetails]);

  const defaultPaymentModes = [
    { code: "CASH", label: t("COMMON_MASTERS_PAYMENTMODE_CASH") },
    { code: "CHEQUE", label: t("COMMON_MASTERS_PAYMENTMODE_CHEQUE") },
    { code: "CARD", label: t("COMMON_MASTERS_PAYMENTMODE_CREDIT/DEBIT CARD") },
    // { code: "DD", label: "Demand Draft" },
    // { code: "OFFLINE_NEFT", label: "Offline NEFT" },
    // { code: "OFFLINE_RTGS", label: "Offline RTGS" },
    // { code: "POSTAL_ORDER", label: "Postal Order" },
  ];

  const formConfigMap = {
    CHEQUE: chequeConfig,
    CARD: cardConfig,
  };

  useEffect(() => {
    props.setLink(t("PAYMENT_COLLECT_LABEL"));
  }, []);

  const getPaymentModes = () => defaultPaymentModes;
  const paidByMenu = [
    { code: "OWNER", name: t("COMMON_OWNER") },
    { code: "OTHER", name: t("COMMON_OTHER") },
  ];
  const [selectedPaymentMode, setPaymentMode] = useState(formState?.selectedPaymentMode || getPaymentModes()[0]);
  const [selectedPaidBy, setselectedPaidBy] = useState(formState?.paidBy || { code: "OWNER", name: t("COMMON_OWNER") });

  const onSubmit = async (data) => {
    bill.totalAmount = Math.round(bill.totalAmount);
    data.paidBy = data.paidBy.code;

    if (
      BillDetailsFormConfig({ consumerCode, businessService }, t)[
        ModuleWorkflow ? (businessService === "SW" && ModuleWorkflow === "WS" ? businessService : ModuleWorkflow) : businessService
      ] &&
      !data?.amount?.paymentAllowed
    ) {
      let action =
        data?.amount?.error === "CS_CANT_PAY_BELOW_MIN_AMOUNT"
          ? t(data?.amount?.error) + "- " + data?.amount?.minAmountPayable
          : t(data?.amount?.error);

      setToast({
        key: "error",
        action,
      });
      return;
    }

    const { ManualRecieptDetails, paymentModeDetails, ...rest } = data;
    const { errorObj, ...details } = paymentModeDetails || {};

    let recieptRequest = {
      Payment: {
        mobileNumber: data.payerMobile,
        paymentDetails: [
          {
            businessService,
            billId: bill.id,
            totalDue: bill.totalAmount,
            totalAmountPaid: data?.amount?.amount || bill.totalAmount,
          },
        ],
        tenantId: bill.tenantId,
        totalDue: bill.totalAmount,
        totalAmountPaid: data?.amount?.amount || bill.totalAmount,
        paymentMode: data.paymentMode.code,
        payerName: data.payerName,
        paidBy: data.paidBy,
      },
    };
    if (advanceBill !== null && applicationData?.applicationStatus === "PENDING_APPL_FEE_PAYMENT" && !applicationData.paymentPreference) {
      (recieptRequest.Payment.paymentDetails[0].totalAmountPaid = advanceBill),
        (recieptRequest.Payment.totalAmountPaid = advanceBill),
        (recieptRequest.Payment.totalDue = bill.totalAmount);
    }

    if (data.ManualRecieptDetails.manualReceiptDate) {
      recieptRequest.Payment.paymentDetails[0].manualReceiptDate = new Date(ManualRecieptDetails.manualReceiptDate).getTime();
    }
    if (data.ManualRecieptDetails.manualReceiptNumber) {
      recieptRequest.Payment.paymentDetails[0].manualReceiptNumber = ManualRecieptDetails.manualReceiptNumber;
    }
    recieptRequest.Payment.paymentMode = data?.paymentMode?.code;

    if (data.paymentModeDetails) {
      recieptRequest.Payment = { ...recieptRequest.Payment, ...details };
      delete recieptRequest.Payment.paymentModeDetails;
      if (data.paymentModeDetails.errorObj) {
        const errors = data.paymentModeDetails.errorObj;
        const messages = Object.keys(errors)
          .map((e) => t(errors[e]))
          .join();
        if (messages) {
          setToast({ key: "error", action: `${messages} ${t("ES_ERROR_REQUIRED")}` });
          setTimeout(() => setToast(null), 5000);
          return;
        }
      }
      if (data.errorMsg) setToast({ key: "error", action: t(errorMsg) });

      recieptRequest.Payment.instrumentDate = new Date(recieptRequest?.Payment?.instrumentDate).getTime();
      recieptRequest.Payment.transactionNumber = data.paymentModeDetails.transactionNumber;
    }

    if (data?.paymentModeDetails?.transactionNumber) {
      if (data.paymentModeDetails.transactionNumber !== data.paymentModeDetails.reTransanctionNumber && ["CARD"].includes(data.paymentMode.code)) {
        setToast({ key: "error", action: t("ERR_TRASACTION_NUMBERS_DONT_MATCH") });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      delete recieptRequest.Payment.last4Digits;
      delete recieptRequest.Payment.reTransanctionNumber;
    }

    if (
      recieptRequest.Payment?.instrumentNumber?.length &&
      recieptRequest.Payment?.instrumentNumber?.length < 6 &&
      recieptRequest?.Payment?.paymentMode === "CHEQUE"
    ) {
      setToast({ key: "error", action: t("ERR_CHEQUE_NUMBER_LESS_THAN_6") });
      setTimeout(() => setToast(null), 5000);
      return;
    }

    try {
      const resposne = await Digit.PaymentService.createReciept(tenantId, recieptRequest);
      queryClient.invalidateQueries();
      history.push(
        IsDisconnectionFlow ? `${props.basePath}/success/${businessService}/${resposne?.Payments[0]?.paymentDetails[0]?.receiptNumber.replace(/\//g, "%2F")}/${
          resposne?.Payments[0]?.paymentDetails[0]?.bill?.consumerCode
        }?IsDisconnectionFlow=${IsDisconnectionFlow}` : 
        `${props.basePath}/success/${businessService}/${resposne?.Payments[0]?.paymentDetails[0]?.receiptNumber.replace(/\//g, "%2F")}/${
          resposne?.Payments[0]?.paymentDetails[0]?.bill?.consumerCode
        }?IsDisconnectionFlow=${IsDisconnectionFlow}`
      );
    } catch (error) {
      setToast({ key: "error", action: error?.response?.data?.Errors?.map((e) => t(e.code)) })?.join(" , ");
      setTimeout(() => setToast(null), 5000);
      return;
    }
  };

  useEffect(() => {
    document?.getElementById("paymentInfo")?.scrollIntoView({ behavior: "smooth" });
    document?.querySelector("#paymentInfo + .label-field-pair input")?.focus();
  }, [selectedPaymentMode]);

  let config = [
    {
      head: !ModuleWorkflow && businessService !== "TL" ? t("COMMON_PAYMENT_HEAD") : "",
      body: [
        {
          label: t("PAY_TOTAL_AMOUNT"),
          populators: <CardSectionHeader style={{ marginBottom: 0, textAlign: "right" }}> {`₹ ${bill?.totalAmount}`} </CardSectionHeader>,
        },
      ],
    },
    {
      head: t("PAYMENT_PAID_BY_HEAD"),
      body: [
        {
          label: t("PAYMENT_PAID_BY_LABEL"),
          isMandatory: true,
          type: "custom",
          populators: {
            name: "paidBy",
            customProps: { t, isMendatory: true, option: paidByMenu, optionKey: "name" },
            component: (props, customProps) => (
              <Dropdown
                {...customProps}
                selected={props.value}
                select={(d) => {
                  if (d.name == paidByMenu[0].name) {
                    props.setValue("payerName", bill?.payerName);
                    // SM-1953: commenting to resolve showing mobile number when selecting the owner option
                    // props.setValue("payerMobile", bill?.mobileNumber);
                  } else {
                    props.setValue("payerName", "");
                    props.setValue("payerMobile", "");
                  }
                  props.onChange(d);
                  setselectedPaidBy(d);
                }}
              />
            ),
            defaultValue: formState?.paidBy || paidByMenu[0],
          },
        },
        {
          label: t("PAYMENT_PAYER_NAME_LABEL"),
          isMandatory: true,
          disable: selectedPaidBy?.code === "OWNER" && (bill?.payerName || formState?.payerName) ? true : false,
          type: "text",
          populators: {
            name: "payerName",
            validation: {
              required: true,
              pattern: /^[A-Za-z]/,
            },
            error: t("PAYMENT_INVALID_NAME"),
            defaultValue: bill?.payerName || formState?.payerName || "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: t("PAYMENT_PAYER_MOB_LABEL"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "payerMobile",
            validation: {
              required: true,
              pattern: /^[6-9]\d{9}$/,
            },
            error: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
            className: "payment-form-text-input-correction",
          },
        },
      ],
    },
    {
      head: t("PAYMENT_MODE_HEAD"),
      body: [
        {
          label: t("PAYMENT_MODE_LABEL"),
          type: "custom",
          populators: {
            name: "paymentMode",
            customProps: {
              options: getPaymentModes(),
              optionsKey: "label",
              style: { display: "flex", flexWrap: "wrap" },
              innerStyles: { minWidth: "33%" },
            },
            defaultValue: formState?.paymentMode || getPaymentModes()[0],
            component: (props, customProps) => (
              <RadioButtons
                selectedOption={props.value}
                onSelect={(d) => {
                  props.onChange(d);
                }}
                {...customProps}
              />
            ),
          },
        },
      ],
    },
  ];

  const getDefaultValues = () => ({
    payerName: ((bill?.payerName || formState?.payerName || "")?.trim()) || "",
  });

  const getFormConfig = () => {
    if (
      BillDetailsFormConfig({ consumerCode, businessService }, t)[
        ModuleWorkflow ? (businessService === "SW" && ModuleWorkflow === "WS" ? businessService : ModuleWorkflow) : businessService
      ] ||
      ModuleWorkflow ||
      businessService === "TL" ||
      businessService.includes("ONE_TIME_FEE")
    ) {
      config.splice(0, 1);
    }
    let conf = config.concat(formConfigMap[formState?.paymentMode?.code] || []);
    conf = conf?.concat(cashConfig);
    return BillDetailsFormConfig({ consumerCode, businessService }, t)[
      ModuleWorkflow ? (businessService === "SW" && ModuleWorkflow === "WS" ? businessService : ModuleWorkflow) : businessService
    ]
      ? BillDetailsFormConfig({ consumerCode, businessService }, t)[
          ModuleWorkflow ? (businessService === "SW" && ModuleWorkflow === "WS" ? businessService : ModuleWorkflow) : businessService
        ].concat(conf)
      : conf;
  };
  const checkFSM = window.location.href.includes("FSM");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Header styles={{ marginLeft: "15px" }}>{checkFSM ? t("PAYMENT_COLLECT_LABEL") : t("PAYMENT_COLLECT")}</Header>
      <FormComposer
        cardStyle={{ paddingBottom: "100px" }}
        label={t("PAYMENT_COLLECT_LABEL")}
        config={getFormConfig()}
        onSubmit={onSubmit}
        formState={formState}
        defaultValues={getDefaultValues()}
        isDisabled={IsDisconnectionFlow ? false : bill?.totalAmount ? !bill.totalAmount > 0 : true}
        // isDisabled={BillDetailsFormConfig({ consumerCode }, t)[businessService] ? !}
        onFormValueChange={(setValue, formValue) => {
          if (!isEqual(formValue.paymentMode, selectedPaymentMode)) {
            setFormState(formValue);
            setPaymentMode(formState.paymentMode);
          }
        }}
      ></FormComposer>
      {toast && (
        <Toast
          error={toast.key === "error"}
          label={t(toast.key === "success" ? `ES_${businessService.split(".")[0].toLowerCase()}_${toast.action}_UPDATE_SUCCESS` : toast.action)}
          onClose={() => setToast(null)}
          style={{ maxWidth: "670px" }}
        />
      )}
    </React.Fragment>
  );
};
