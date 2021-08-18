import React, { useEffect, useState } from "react";
import { RadioButtons, FormComposer, Dropdown, CardSectionHeader, Loader, Toast } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useCardPaymentDetails } from "./card";
import { useChequeDetails, ChequeDetailsComponent } from "./cheque";
import isEqual from "lodash/isEqual";
// import BillDetails, { BillDetailsFormConfig } from "./Bill-details/billDetails";

export const CollectPayment = (props) => {
  // const { formData, addParams } = props;
  props.setLink("Collect Payment");
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { path: currentPath } = useRouteMatch();
  const { consumerCode, businessService } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: paymentdetails, isLoading } = Digit.Hooks.useFetchPayment({ tenantId: tenantId, consumerCode, businessService });
  const bill = paymentdetails?.Bill ? paymentdetails?.Bill[0] : {};

  const { cardConfig } = useCardPaymentDetails(props, t);
  const { chequeConfig, date } = useChequeDetails(props, t);
  const additionalCharges = getAdditionalCharge() || [];

  const [formState, setFormState] = useState({});
  const [toast, setToast] = useState(null);

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

  const getPaymentModes = () => defaultPaymentModes;
  const paidByMenu = [{ name: t("COMMON_OWNER") }, { name: t("COMMON_OTHER") }];
  const [selectedPaymentMode, setPaymentMode] = useState(formState?.selectedPaymentMode || getPaymentModes()[0]);

  const onSubmit = async (data) => {
    console.log(data);
    bill.totalAmount = Math.round(bill.totalAmount);
    data.paidBy = data.paidBy.name;
    // console.log(data, bill.totalAmount);
    const recieptRequest = {
      Payment: {
        ...data,
        mobileNumber: data.payerMobile,
        paymentDetails: [
          {
            businessService,
            billId: bill.id,
            totalDue: bill.totalAmount,
            totalAmountPaid: bill.totalAmount,
          },
        ],
        tenantId: bill.tenantId,
        totalDue: bill.totalAmount,
        totalAmountPaid: bill.totalAmount,
      },
    };

    recieptRequest.Payment.paymentMode = data?.paymentMode?.code;
    if (data.chequeDetails) {
      recieptRequest.Payment = { ...recieptRequest.Payment, ...data.chequeDetails };
      delete recieptRequest.Payment.chequeDetails;
      if (data.chequeDetails.errorObj) {
        const errors = data.chequeDetails.errorObj;
        const messages = Object.keys(errors)
          .map((e) => t(errors[e]))
          .join();
        if (messages) {
          setToast({ key: "error", action: `${messages} ES_ERROR_REQUIRED` });
          setTimeout(() => setToast(null), 5000);
          return;
        }
      }

      recieptRequest.Payment.instrumentDate = new Date(recieptRequest?.Payment?.instrumentDate).getTime();
      recieptRequest.Payment.transactionNumber = "12345678";
    }

    if (data.transactionNumber) {
      if (data.transactionNumber !== data.reTransanctionNumber) {
        setToast({ key: "error", action: t("ERR_TRASACTION_NUMBERS_DONT_MATCH") });
        setTimeout(() => setToast(null), 5000);
        return;
      }
    }

    try {
      const resposne = await Digit.PaymentService.createReciept(tenantId, recieptRequest);
      queryClient.invalidateQueries();
      history.push(`${props.basePath}/success/${businessService}/${resposne?.Payments[0]?.paymentDetails[0]?.receiptNumber.replace(/\//g, "%2F")}`);
    } catch (error) {
      setToast({ key: "error", action: error?.response?.data?.Errors?.map((e) => e.message) })?.join(" , ");
      setTimeout(() => setToast(null), 5000);
      return;
    }
  };

  function getAdditionalCharge() {
    const billAccountDetails = bill?.billDetails
      ?.map((billDetail) => {
        return billDetail.billAccountDetails;
      })
      ?.flat();

    return billAccountDetails?.map((billAccountDetail) => {
      return {
        label: t(billAccountDetail.taxHeadCode),
        populators: <div style={{ marginBottom: 0, textAlign: "right" }}>₹ {billAccountDetail.amount}</div>,
      };
    });
  }

  useEffect(() => {
    document?.getElementById("paymentInfo")?.scrollIntoView({ behavior: "smooth" });
    document?.querySelector("#paymentInfo + .label-field-pair input")?.focus();
  }, [selectedPaymentMode]);

  const config = [
    {
      head: t("COMMON_PAYMENT_HEAD"),
      body: [
        ...additionalCharges,
        {
          label: t("PAY_TOTAL_AMOUNT"),
          populators: <CardSectionHeader style={{ marginBottom: 0, textAlign: "right" }}> {`₹ ${bill.totalAmount}`} </CardSectionHeader>,
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
                  if (isEqual(d, paidByMenu[0])) {
                    props.setValue("payerName", bill?.payerName);
                    props.setValue("payerMobile", bill?.mobileNumber);
                  } else {
                    props.setValue("payerName", "");
                    props.setValue("payerMobile", "");
                  }
                  props.onChange(d);
                }}
              />
            ),
            defaultValue: formState?.paidBy || paidByMenu[0],
          },
        },
        {
          label: t("PAYMENT_PAYER_NAME_LABEL"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "payerName",
            validation: {
              required: true,
              pattern: /^[A-Za-z]/,
            },
            error: "a valid name required",
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
            error: "a valid mobile no. required",
            className: "payment-form-text-input-correction",
            defaultValue: bill?.mobileNumber || formState?.payerMobile || "",
          },
        },
      ],
    },
    {
      head: t("PAYMENT_MODE_HEAD"),
      body: [
        {
          withoutLabel: true,
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
    payerName: bill?.payerName || formState?.payerName || "",
    payerMobile: bill?.mobileNumber || formState?.payerMobile || "",
  });

  const getFormConfig = () => config.concat(formConfigMap[formState?.paymentMode?.code] || []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <FormComposer
        cardStyle={{ paddingBottom: "100px" }}
        heading={t("PAYMENT_COLLECT")}
        label={t("PAYMENT_COLLECT_LABEL")}
        config={getFormConfig()}
        onSubmit={onSubmit}
        formState={formState}
        defaultValues={getDefaultValues()}
        onFormValueChange={(setValue, formValue) => {
          if (!isEqual(formValue.paymentMode, selectedPaymentMode)) {
            setFormState(formValue);
            setPaymentMode(formState.paymentMode);
          }
        }}
      ></FormComposer>
      {/* <ChequeDetailsComponent chequeDetails={{}} /> */}
      {toast && (
        <Toast
          error={toast.key === "error" ? true : false}
          label={t(toast.key === "success" ? `ES_${businessService.split(".")[0].toLowerCase()}_${toast.action}_UPDATE_SUCCESS` : toast.action)}
          onClose={() => setToast(null)}
        />
      )}
    </React.Fragment>
  );
};
