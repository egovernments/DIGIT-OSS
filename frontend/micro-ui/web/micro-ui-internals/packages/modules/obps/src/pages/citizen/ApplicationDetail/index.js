import { StatusTable, Header, Card, CardHeader, Row, PDFSvg, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pdfDocumentName, pdfDownloadLink } from "../../../utils";
import ApplicationTimeline from "../../../components/ApplicationTimeline";

const ApplicationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [documents, setDocuments] = useState({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: License, isLoading } = Digit.Hooks.obps.useBPAREGSearch(tenantId, {}, { applicationNumber: id }, {
    select: (data) => data?.Licenses?.[0]
  });


  useEffect(() => {
    if (License?.tradeLicenseDetail?.applicationDocuments?.length) {
      const fileStoresIds = License?.tradeLicenseDetail?.applicationDocuments.map(document => document?.fileStoreId);
      Digit.UploadServices.Filefetch(fileStoresIds, tenantId.split(".")[0])
        .then(res => setDocuments(res?.data))
    }
  }, [License]);


  return (
    <Fragment>
      <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      <div>
        <Card>
          <CardHeader>{t(`BPA_LICENSE_DET_CAPTION`)}</CardHeader>
          <StatusTable>
            <Row className="border-none" label={t(`BPA_LICENSE_TYPE_LABEL`)} text={t(License?.licenseType)} />
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
                <CardSectionHeader>{t(`BPA_DOCUMENT_${document?.documentType}`)}</CardSectionHeader>
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