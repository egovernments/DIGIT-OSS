import { Banner, Card, CardText, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";

export const SuccessfulPayment = (props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { eg_pg_txnid: egId, workflow: workflw } = Digit.Hooks.useQueryParams();
  const [printing, setPrinting] = useState(false);
  const [allowFetchBill, setallowFetchBill] = useState(false);
  const { businessService: business_service, consumerCode, tenantId } = useParams();

  const { isLoading, data, isError } = Digit.Hooks.usePaymentUpdate({ egId }, business_service, {
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { label } = Digit.Hooks.useApplicationsForBusinessServiceSearch({ businessService: business_service }, { enabled: false });

  // const { data: demand } = Digit.Hooks.useDemandSearch(
  //   { consumerCode, businessService: business_service },
  //   { enabled: !isLoading, retry: false, staleTime: Infinity, refetchOnWindowFocus: false }
  // );

  // const { data: billData, isLoading: isBillDataLoading } = Digit.Hooks.useFetchPayment(
  //   { tenantId, consumerCode, businessService: business_service },
  //   { enabled: allowFetchBill, retry: false, staleTime: Infinity, refetchOnWindowFocus: false }
  // );

  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId,
      businessService: business_service,
      receiptNumbers: data?.payments?.Payments?.[0]?.paymentDetails[0].receiptNumber,
    },
    {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      select: (dat) => {
        return dat.Payments[0];
      },
      enabled: allowFetchBill,
    }
  );

  const { data: generatePdfKey } = Digit.Hooks.useCommonMDMS(tenantId, "common-masters", "ReceiptKey", {
    select: (data) =>
      data["common-masters"]?.uiCommonPay?.filter(({ code }) => business_service?.includes(code))[0]?.receiptKey || "consolidatedreceipt",
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const payments = data?.payments;

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    if (data && data.txnStatus && data.txnStatus !== "FAILURE") {
      setallowFetchBill(true);
    }
  }, [data]);

  if (isLoading || recieptDataLoading) {
    return <Loader />;
  }

  const applicationNo = data?.applicationNo;

  const isMobile = window.Digit.Utils.browser.isMobile();

  if (isError || !payments || !payments.Payments || payments.Payments.length === 0 || data.txnStatus === "FAILURE") {
    return (
      <Card>
        <Banner
          message={t("CITIZEN_FAILURE_COMMON_PAYMENT_MESSAGE")}
          info={t("CS_PAYMENT_TRANSANCTION_ID")}
          applicationNumber={egId}
          successful={false}
        />
        <CardText>{t("CS_PAYMENT_FAILURE_MESSAGE")}</CardText>
        {business_service !== "PT" ? (
          <Link to={`/digit-ui/citizen`}>
            <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
          </Link>
        ) : (
          <React.Fragment>
            <Link to={(applicationNo && `/digit-ui/citizen/payment/my-bills/${business_service}/${applicationNo}`) || "/digit-ui/citizen"}>
              <SubmitBar label={t("CS_PAYMENT_TRY_AGAIN")} />
            </Link>
            <div className="link" style={isMobile ? { marginTop: "8px", width: "100%", textAlign: "center" } : { marginTop: "8px" }}>
              <Link to={`/digit-ui/citizen`}>{t("CORE_COMMON_GO_TO_HOME")}</Link>
            </div>
          </React.Fragment>
        )}
      </Card>
    );
  }

  const paymentData = data?.payments?.Payments[0];
  const amount = reciept_data?.paymentDetails?.[0]?.totalAmountPaid;
  const transactionDate = paymentData.transactionDate;
  const printCertificate = async () => {
    //const tenantId = Digit.ULBService.getCurrentTenantId();
    const state = tenantId;
    const applicationDetails = await Digit.TLService.search({ applicationNumber: consumerCode, tenantId });
    const generatePdfKeyForTL = "tlcertificate"

    if (applicationDetails) {
      let response = await Digit.PaymentService.generatePdf(state, { Licenses: applicationDetails?.Licenses }, generatePdfKeyForTL);
      const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
      window.open(fileStore[response.filestoreIds[0]], "_blank");
    }
  }

  const printReciept = async () => {
    if (printing) return;
    setPrinting(true);
    const tenantId = paymentData?.tenantId;
    const state = tenantId?.split(".")[0];
    let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };
    if (!paymentData?.fileStoreId) {
      response = await Digit.PaymentService.generatePdf(state, { Payments: [payments.Payments[0]] }, generatePdfKey);
    }
    const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
    if (fileStore && fileStore[response.filestoreIds[0]]) {
      window.open(fileStore[response.filestoreIds[0]], "_blank");
    }
    setPrinting(false);
  };

  const getBillingPeriod = (billDetails) => {
    const { taxPeriodFrom, taxPeriodTo, fromPeriod, toPeriod } = billDetails || {};
    if (taxPeriodFrom && taxPeriodTo) {
      let from = new Date(taxPeriodFrom).getFullYear().toString();
      let to = new Date(taxPeriodTo).getFullYear().toString();
      return "FY " + from + "-" + to;
    } else if (fromPeriod && toPeriod) {
      if (workflw === "mcollect") {
        from =
          new Date(fromPeriod).getDate().toString() +
          " " +
          Digit.Utils.date.monthNames[new Date(fromPeriod).getMonth() + 1].toString() +
          " " +
          new Date(fromPeriod).getFullYear().toString();
        to =
          new Date(toPeriod).getDate() +
          " " +
          Digit.Utils.date.monthNames[new Date(toPeriod).getMonth() + 1] +
          " " +
          new Date(toPeriod).getFullYear();
        return from + " - " + to;
      }
      let from = new Date(fromPeriod).getFullYear().toString();
      let to = new Date(toPeriod).getFullYear().toString();
      return "FY " + from + "-" + to;

    } else return "N/A";
  };

  let bannerText;
  if (workflw) {
    bannerText = `CITIZEN_SUCCESS_UC_PAYMENT_MESSAGE`;
  } else {
    bannerText = `CITIZEN_SUCCESS_${paymentData?.paymentDetails[0].businessService.replace(/\./g, "_")}_PAYMENT_MESSAGE`;
  }

  // https://dev.digit.org/collection-services/payments/FSM.TRIP_CHARGES/_search?tenantId=pb.amritsar&consumerCodes=107-FSM-2021-02-18-063433

  // if (billDataLoading) return <Loader />;

  const rowContainerStyle = {
    padding: "4px 0px",
    justifyContent: "space-between",
  };

  const ommitRupeeSymbol = ["PT"].includes(business_service);

  return (
    <Card>
      <Banner
        svg={
          <svg className="payment-svg" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 0C8.96 0 0 8.96 0 20C0 31.04 8.96 40 20 40C31.04 40 40 31.04 40 20C40 8.96 31.04 0 20 0ZM16 30L6 20L8.82 17.18L16 24.34L31.18 9.16L34 12L16 30Z"
              fill="white"
            />
          </svg>
        }
        message={t("CS_COMMON_PAYMENT_COMPLETE")}
        info={t("CS_COMMON_RECIEPT_NO")}
        applicationNumber={paymentData?.paymentDetails[0].receiptNumber}
        successful={true}
      />
      <CardText>{t(`${bannerText}_DETAIL`)}</CardText>
      {business_service == "TL" ? (
        <div className="primary-label-btn d-grid" onClick={printCertificate}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#f47738">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" />
          </svg>
          {t("CS_COMMON_PRINT_CERTIFICATE")}
        </div>
      ) : null}
      <StatusTable>
        <Row rowContainerStyle={rowContainerStyle} last label={t(label)} text={applicationNo} />
        {/** TODO : move this key and value into the hook based on business Service */}
        {(business_service === "PT" || workflw) && (
          <Row
            rowContainerStyle={rowContainerStyle}
            last
            label={t("CS_PAYMENT_BILLING_PERIOD")}
            text={getBillingPeriod(reciept_data?.paymentDetails[0]?.bill?.billDetails[0])}
          />
        )}

        {(business_service === "PT" || workflw) && (
          <Row
            rowContainerStyle={rowContainerStyle}
            last
            label={t("CS_PAYMENT_AMOUNT_PENDING")}
            text={reciept_data?.paymentDetails?.[0]?.totalDue - reciept_data?.paymentDetails?.[0]?.totalAmountPaid}
          />
        )}

        <Row rowContainerStyle={rowContainerStyle} last label={t("CS_PAYMENT_TRANSANCTION_ID")} text={egId} />
        <Row
          rowContainerStyle={rowContainerStyle}
          last
          label={t(ommitRupeeSymbol ? "CS_PAYMENT_AMOUNT_PAID_WITHOUT_SYMBOL" : "CS_PAYMENT_AMOUNT_PAID")}
          text={"₹ " + reciept_data?.paymentDetails?.[0]?.totalAmountPaid}
        />
        {(business_service !== "PT" || workflw) && (
          <Row
            rowContainerStyle={rowContainerStyle}
            last
            label={t("CS_PAYMENT_TRANSANCTION_DATE")}
            text={transactionDate && new Date(transactionDate).toLocaleDateString("in")}
          />
        )}
      </StatusTable>
      <SubmitBar onSubmit={printReciept} label={t("COMMON_DOWNLOAD_RECEIPT")} />
      <div className="link" style={isMobile ? { marginTop: "8px", width: "100%", textAlign: "center" } : { marginTop: "8px" }}>
        <Link to={`/digit-ui/citizen`}>{t("CORE_COMMON_GO_TO_HOME")}</Link>
      </div>
    </Card>
  );
};

export const FailedPayment = (props) => {
  const { addParams, clearParams } = props;
  const { t } = useTranslation();
  const { consumerCode } = useParams();

  const getMessage = () => "Failure !";
  return (
    <Card>
      <Banner message={getMessage()} complaintNumber={consumerCode} successful={false} />
      <CardText>{t("ES_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>
    </Card>
  );
};
