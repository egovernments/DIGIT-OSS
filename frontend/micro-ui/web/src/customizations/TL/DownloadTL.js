import { Menu, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const DownloadTL = ({ t, data }) => {
  const [isDisplayDownloadMenu, setIsDisplayDownloadMenu] = useState(false);
  const { tenantId, applicationNumber } = data;
  const { data: paymentsHistory } = window.Digit.Hooks.tl.useTLPaymentHistory(
    tenantId,
    applicationNumber
  );
  const {
    isLoading,
    isError,
    error,
    data: application,
    error: errorApplication,
  } = window.Digit.Hooks.tl.useTLApplicationDetails({
    tenantId: tenantId,
    applicationNumber: applicationNumber,
  });

  const onDownloadActionSelect = (action) => {
    switch (action) {
      case t("TL_CERTIFICATE"):
        downloadTLcertificate()
        break;
      case t("CS_COMMON_PAYMENT_RECEIPT"):
        downloadPaymentReceipt()
        break;
      case t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"):
        handleDownloadPdf();
        break;
      default :
      console.log("abc")
    }
    console.log("ayuhs", paymentsHistory);
  };
  const downloadPaymentReceipt = async () => {
    const receiptFile = {
      filestoreIds: [paymentsHistory.Payments[0]?.fileStoreId],
    };
    if (!receiptFile?.fileStoreIds?.[0]) {
      const newResponse = await window.Digit.PaymentService.generatePdf(
        tenantId,
        { Payments: [paymentsHistory.Payments[0]] },
        "tl-receipt"
      );
      const fileStore = await window.Digit.PaymentService.printReciept(
        tenantId,
        {
          fileStoreIds: newResponse.filestoreIds[0],
        }
      );
      window.open(fileStore[newResponse.filestoreIds[0]], "_blank");
      setIsDisplayDownloadMenu(false);
    } else {
      const fileStore = await window.Digit.PaymentService.printReciept(
        tenantId,
        {
          fileStoreIds: receiptFile.filestoreIds[0],
        }
      );
      window.open(fileStore[receiptFile.filestoreIds[0]], "_blank");
      setIsDisplayDownloadMenu(false);
    }
  };

  const downloadTLcertificate = async () => {
    const TLcertificatefile = await window.Digit.PaymentService.generatePdf(
      tenantId,
      { Licenses: application },
      "tlcertificate"
    );
    const receiptFile = await window.Digit.PaymentService.printReciept(
      tenantId,
      {
        fileStoreIds: TLcertificatefile.filestoreIds[0],
      }
    );
    window.open(receiptFile[TLcertificatefile.filestoreIds[0]], "_blank");
    setIsDisplayDownloadMenu(false);
  };

  const handleDownloadPdf = async () => {
    // const tenantInfo = tenants.find(
    //   (tenant) => tenant.code === application[0]?.tenantId
    // );
    // let res = application[0];
    // const data = getPDFData({ ...res }, tenantInfo, t);
    // data.then((ress) => window.Digit.Utils.pdf.generate(ress));
    setIsDisplayDownloadMenu(false);
  };

  const dowloadOptions =
    paymentsHistory?.Payments?.length > 0
      ? [t("TL_CERTIFICATE"), t("CS_COMMON_PAYMENT_RECEIPT")]
      : [t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT")];

  return (
    <div className="download_tl">
      <SubmitBar
        label={t("TL_DOWNLOAD")}
        onSubmit={() => setIsDisplayDownloadMenu(!isDisplayDownloadMenu)}
      />
      {isDisplayDownloadMenu ? (
        <div
          style={{
            boxShadow:
              "0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)",
            height: "auto",
            backgroundColor: "#fff",
            textAlign: "left",
            marginBottom: "4px",
            width: "240px",
            padding: "0px 10px",
            lineHeight: "30px",
            cursor: "pointer",
            position: "absolute",
            color: "black",
            fontSize: "18px",
          }}
        >
          <Menu
            localeKeyPrefix="UC"
            options={dowloadOptions}
            t={t}
            onSelect={onDownloadActionSelect}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DownloadTL;
