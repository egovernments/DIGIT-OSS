import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Card, CardSectionHeader, Loader, StatusTable, Row, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";

const ApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [documents, setDocuments] = useState({});
  const { data: License, isLoading } = Digit.Hooks.obps.useBPAREGSearch(tenantId, {}, { applicationNumber: id, tenantId }, {
    select: (data) => data?.Licenses?.[0]
  });

  useEffect(() => {
    if (License?.tradeLicenseDetail?.applicationDocuments?.length) {
      const fileStoresIds = License?.tradeLicenseDetail?.applicationDocuments.map(document => document?.fileStoreId);
      Digit.UploadServices.Filefetch(fileStoresIds, tenantId.split(".")[0])
        .then(res => setDocuments(res?.data))
    }
  }, [License]);

  const handleSubmit = () => {};

  if (isLoading) {
    return <Loader />
  }

  return (
    <Fragment>
      <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      <Card>
        <CardSectionHeader>{t(`BPA_LICENSE_DET_CAPTION`)}</CardSectionHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_LICENSE_TYPE_LABEL`)} text={t(License?.licenseType)} />
        </StatusTable>
        <CardSectionHeader>{t(`BPA_LICENSE_DET_CAPTION`)}</CardSectionHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_APPLICANT_NAME_LABEL`)} text={t(License?.tradeLicenseDetail?.owners?.[0]?.name)} />
          <Row className="border-none" label={t(`BPA_APPLICANT_GENDER_LABEL`)} text={t(License?.tradeLicenseDetail?.owners?.[0]?.gender)} />
          <Row className="border-none" label={t(`BPA_OWNER_MOBILE_NO_LABEL`)} text={License?.tradeLicenseDetail?.owners?.[0]?.mobileNumber} />
          <Row className="border-none" label={t(`BPA_APPLICANT_EMAIL_LABEL`)} text={License?.tradeLicenseDetail?.owners?.[0]?.emailId} />
          <Row className="border-none" label={t(`BPA_APPLICANT_PAN_NO`)} text={License?.tradeLicenseDetail?.owners?.[0]?.pan || t("CS_NA")} />
        </StatusTable>
        <CardSectionHeader>{t(`BPA_LICENSEE_PERMANENT_LABEL`)}</CardSectionHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_LICENSEE_PERMANENT_LABEL`)} text={License?.tradeLicenseDetail?.owners?.[0]?.permanentAddress || t("CS_NA")} />
        </StatusTable>
        <CardSectionHeader>{t(`BPA_LICENSEE_CORRESPONDENCE_LABEL`)}</CardSectionHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_LICENSEE_CORRESPONDENCE_LABEL`)} text={License?.tradeLicenseDetail?.owners?.[0]?.correspondenceAddress || t("CS_NA")} />
        </StatusTable>
        <CardSectionHeader>{t("BPA_DOC_DETAILS_SUMMARY")}</CardSectionHeader>
        {License?.tradeLicenseDetail?.applicationDocuments?.map((document, index) => (
            <Fragment>
              <div>
                <CardSectionHeader>{t(`BPA_DOCUMENT_${document?.documentType}`)}</CardSectionHeader>
                <a target="_" href={documents[document.fileStoreId]?.split(",")[0]}>
                  <PDFSvg />
                </a>
              </div>
              <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
            </Fragment>
          ))}
      </Card>
      <ActionBar>
        <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => handleSubmit()} />
      </ActionBar>
    </Fragment>
  );
}

export default ApplicationDetail;