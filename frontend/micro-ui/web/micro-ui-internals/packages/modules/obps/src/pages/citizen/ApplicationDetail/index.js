import { StatusTable, Header, Card, CardHeader, Row, PDFSvg, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pdfDocumentName, pdfDownloadLink, stringReplaceAll } from "../../../utils";
import ApplicationTimeline from "../../../components/ApplicationTimeline";
const ApplicationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: LicenseData, isLoading } = Digit.Hooks.obps.useBPAREGSearch(tenantId, {});
  let License = LicenseData?.Licenses?.[0];


  useEffect(() => {
    if (License?.tradeLicenseDetail?.applicationDocuments?.length) {
      const fileStoresIds = License?.tradeLicenseDetail?.applicationDocuments.map(document => document?.fileStoreId);
      Digit.UploadServices.Filefetch(fileStoresIds, tenantId.split(".")[0])
        .then(res => setDocuments(res?.data))
    }
  }, [License]);


  return (
    <Fragment>
      <Header>{t("BPA_TASK_DETAILS_HEADER")}</Header>
      <div>
        <Card>
          <StatusTable>
            <Row className="border-none" label={t(`BPA_APPLICATION_NUMBER_LABEL`)} text={License?.applicationNumber || "NA"} />
          </StatusTable>
        </Card>
        <Card>
          <CardHeader>{t(`BPA_LICENSE_DET_CAPTION`)}</CardHeader>
          <StatusTable>
            <Row className="border-none" label={t(`BPA_LICENSE_TYPE`)} text={t(`TRADELICENSE_TRADETYPE_${License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split('.')[0]}`)} />
            {License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType.includes('ARCHITECT') && 
              <Row className="border-none" label={t("BPA_COUNCIL_OF_ARCH_NO_LABEL")} text={License?.tradeLicenseDetail?.additionalDetail?.counsilForArchNo}  />
            }
          </StatusTable>
        </Card>
        <Card>
          <CardHeader>{t(`BPA_LICENSE_DET_CAPTION`)}</CardHeader>
          <StatusTable>
            <Row className="border-none" label={t(`BPA_APPLICANT_NAME_LABEL`)} text={t(License?.tradeLicenseDetail?.owners?.[0]?.name)} />
            <Row className="border-none" label={t(`BPA_APPLICANT_GENDER_LABEL`)} text={t(License?.tradeLicenseDetail?.owners?.[0]?.gender)}/>
            <Row className="border-none" label={t(`BPA_OWNER_MOBILE_NO_LABEL`)} text={License?.tradeLicenseDetail?.owners?.[0]?.mobileNumber}/>
            <Row className="border-none" label={t(`BPA_APPLICANT_EMAIL_LABEL`)} text={License?.tradeLicenseDetail?.owners?.[0]?.emailId}/>
            <Row className="border-none" label={t(`BPA_APPLICANT_PAN_NO`)} text={License?.tradeLicenseDetail?.owners?.[0]?.pan || t("CS_NA")}/>
          </StatusTable>
        </Card>
        <Card>
          <CardHeader>{t(`BPA_LICENSEE_PERMANENT_LABEL`)}</CardHeader>
          <Row className="border-none" text={License?.tradeLicenseDetail?.owners?.[0]?.permanentAddress || t("CS_NA")} />
        </Card>
        <Card>
          <CardHeader>{t(`BPA_LICENSEE_CORRESPONDENCE_LABEL`)}</CardHeader>
          <Row className="border-none" text={License?.tradeLicenseDetail?.owners?.[0]?.correspondenceAddress || t("CS_NA")} />
        </Card>
        <Card>
          <CardHeader>{t("BPA_DOC_DETAILS_SUMMARY")}</CardHeader>
          {License?.tradeLicenseDetail?.applicationDocuments?.map((document, index) => {
            return (
            <Fragment>
              <div>
                <CardSectionHeader>{t(`${stringReplaceAll(document?.documentType?.toUpperCase(), ".", "_")}`)}</CardSectionHeader>
                <a target="_" href={documents[document.fileStoreId]?.split(",")[0]}>
                  <PDFSvg />
                </a>
              </div>
              <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
            </Fragment>
            )
          })}
        </Card>
        <Card>
          <ApplicationTimeline id={id} tenantId={License?.tenantId} />
        </Card>
      </div>
    </Fragment>
  )
}

export default ApplicationDetails;