import { StatusTable, Header, Card, CardHeader, Row, PDFSvg, CardSectionHeader, MultiLink, Loader } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pdfDocumentName, pdfDownloadLink, stringReplaceAll } from "../../../utils";
import ApplicationTimeline from "../../../components/ApplicationTimeline";
import { downloadAndPrintReciept } from "../../../utils";
const ApplicationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showOptions, setShowOptions] = useState(false);
  const [dowloadOptions, setDowloadOptions] = useState([]);
  const { id: appNumber } = useParams();
  const params = { applicationNumber: appNumber };
  const stateCode = Digit.ULBService.getStateId();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { data: LicenseData, isLoading } = Digit.Hooks.obps.useBPAREGSearch(stateCode, {}, params);
  let License = LicenseData?.Licenses?.[0];
  const { data: mdmsRes, isLoading: mdmsResIsLoading } = Digit.Hooks.obps.useMDMS(stateCode, "StakeholderRegistraition", "TradeTypetoRoleMapping");
  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: stateCode,
      businessService: "BPAREG",
      consumerCodes: id,
      isEmployee: false,
    },
    {}
  );

  useEffect(() => {
    if (License?.tradeLicenseDetail?.applicationDocuments?.length) {
      const fileStoresIds = License?.tradeLicenseDetail?.applicationDocuments?.map((document) => document?.fileStoreId);
      Digit.UploadServices.Filefetch(fileStoresIds, tenantId.split(".")[0]).then((res) => setDocuments(res?.data));
    }
  }, [License]);

  useEffect(() => {
    if (License) {
      if (reciept_data?.Payments?.length > 0) {
        setDowloadOptions([
          {
            label: t("TL_RECEIPT"),
            onClick: () =>
              downloadAndPrintReciept(
                reciept_data?.Payments?.[0]?.paymentDetails?.[0]?.businessService || "BPAREG",
                License?.applicationNumber,
                License?.tenantId
              ),
          },
        ]);
      }
      const fileStoresIds = License?.tradeLicenseDetail?.applicationDocuments?.map((document) => document?.fileStoreId);
    }
  }, [License, reciept_data]);

  if (License?.tradeLicenseDetail?.applicationDocuments?.length && mdmsRes?.StakeholderRegistraition?.TradeTypetoRoleMapping?.length > 0) {
    mdmsRes?.StakeholderRegistraition?.TradeTypetoRoleMapping?.map((doc) => {
      if (doc?.docTypes?.length > 0 && doc?.tradeType == License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType) {
        doc?.docTypes?.map((docType) => {
          License?.tradeLicenseDetail?.applicationDocuments?.forEach((document) => {
            if (docType?.code == document?.documentType && docType?.info) document.info = docType?.info;
          });
        });
      }
    });
  }

  if (isLoading) return <Loader />;

  return (
    <Fragment>
      <div className="cardHeaderWithOptions" style={isMobile ? {} : {maxWidth:"980px"}}>
        <Header styles={{ fontSize: "32px", marginLeft: isMobile ? "0px" : "10px" }}>{t("BPA_TASK_DETAILS_HEADER")}</Header>
        {reciept_data?.Payments?.length > 0 && (
          // <div style={{right: "3%", top: "20px", position: "absolute"}}>
          <MultiLink
            className="multilinkWrapper"
            onHeadClick={() => setShowOptions(!showOptions)}
            displayOptions={showOptions}
            options={dowloadOptions}
            style={{ top: "90px" }}
          />
        )}
      </div>
      <div>
        <Card>
          <StatusTable>
            <Row className="border-none" label={t(`BPA_APPLICATION_NUMBER_LABEL`)} text={License?.applicationNumber || "NA"} />
          </StatusTable>
        </Card>
        <Card>
          <CardHeader styles={{ fontSize: "24px" }}>{t(`BPA_LICENSE_DETAILS_LABEL`)}</CardHeader>
          <StatusTable>
            <Row
              className="border-none"
              label={t(`BPA_LICENSE_TYPE`)}
              text={t(`TRADELICENSE_TRADETYPE_${License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split(".")[0]}`)}
            />
            {License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType.includes("ARCHITECT") && (
              <Row
                className="border-none"
                label={t("BPA_COUNCIL_OF_ARCH_NO_LABEL")}
                text={License?.tradeLicenseDetail?.additionalDetail?.counsilForArchNo}
              />
            )}
          </StatusTable>
        </Card>
        <Card>
          <CardHeader styles={{ fontSize: "24px" }}>{t(`BPA_LICENSE_DET_CAPTION`)}</CardHeader>
          <StatusTable>
            <Row className="border-none" label={t(`BPA_APPLICANT_NAME_LABEL`)} text={t(License?.tradeLicenseDetail?.owners?.[0]?.name)} />
            <Row className="border-none" label={t(`BPA_APPLICANT_GENDER_LABEL`)} text={t(License?.tradeLicenseDetail?.owners?.[0]?.gender)} />
            <Row className="border-none" label={t(`BPA_OWNER_MOBILE_NO_LABEL`)} text={License?.tradeLicenseDetail?.owners?.[0]?.mobileNumber} />
            <Row
              className="border-none"
              label={t(`BPA_APPLICANT_EMAIL_LABEL`)}
              text={License?.tradeLicenseDetail?.owners?.[0]?.emailId || t("CS_NA")}
            />
            <Row className="border-none" label={t(`BPA_APPLICANT_PAN_NO`)} text={License?.tradeLicenseDetail?.owners?.[0]?.pan || t("CS_NA")} />
          </StatusTable>
        </Card>
        <Card>
          <CardHeader styles={{ fontSize: "24px" }}>{t(`BPA_LICENSEE_PERMANENT_LABEL`)}</CardHeader>
          <Row className="border-none" text={License?.tradeLicenseDetail?.owners?.[0]?.permanentAddress || t("CS_NA")} />
        </Card>
        <Card>
          <CardHeader styles={{ fontSize: "24px" }}>{t(`BPA_CORRESPONDANCE_ADDRESS_LABEL`)}</CardHeader>
          <Row className="border-none" text={License?.tradeLicenseDetail?.owners?.[0]?.correspondenceAddress || t("CS_NA")} />
        </Card>
        {License?.tradeLicenseDetail?.applicationDocuments?.length > 0 && (
          <Card>
            <CardHeader styles={{ fontSize: "24px" }}>{t("BPA_DOC_DETAILS_SUMMARY")}</CardHeader>
            {License?.tradeLicenseDetail?.applicationDocuments?.map((document, index) => {
              return (
                <Fragment>
                  <div>
                    <CardSectionHeader styles={{ fontSize: "18px" }}>
                      {t(`BPAREG_HEADER_${stringReplaceAll(document?.documentType?.toUpperCase(), ".", "_")}`)}
                    </CardSectionHeader>
                    {document?.info ? (
                      <div style={{ fontSize: "12px", color: "#505A5F", fontWeight: 400, lineHeight: "15px", margin: "10px 0px" }}>{`${t(
                        document?.info
                      )}`}</div>
                    ) : null}
                    <a target="_blank" href={documents[document.fileStoreId]?.split(",")[0]}>
                      <PDFSvg />
                    </a>
                    <p style={{ marginTop: "8px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#505A5F", fontWeight: "400" }}>
                      {t(`BPAREG_HEADER_${stringReplaceAll(document?.documentType?.toUpperCase(), ".", "_")}`)}
                    </p>
                    {/* <p style={{ marginTop: "8px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#505A5F", fontWeight: "400" }}>{decodeURIComponent( documents[document.fileStoreId]?.split(",")[0]?.split("?")[0]?.split("/")?.pop()?.slice(13))}</p> */}
                  </div>
                  {License?.tradeLicenseDetail?.applicationDocuments?.length != index + 1 ? (
                    <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
                  ) : null}
                </Fragment>
              );
            })}
          </Card>
        )}
        <Card>
          <ApplicationTimeline id={id} tenantId={License?.tenantId} />
        </Card>
      </div>
    </Fragment>
  );
};

export default ApplicationDetails;
