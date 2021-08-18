import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import getPTAcknowledgementData from "../../getPTAcknowledgementData";
import PropertyDocument from "../../pageComponents/PropertyDocument";
import PTWFApplicationTimeline from "../../pageComponents/PTWFApplicationTimeline";
import { getCityLocale, getPropertyTypeLocale, propertyCardBodyStyle } from "../../utils";

const PTApplicationDetails = () => {
  const { t } = useTranslation();
  const { acknowledgementIds } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const coreData = Digit.Hooks.useCoreData();
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch(
    { filters: { acknowledgementIds } },
    { filters: { acknowledgementIds } }
  );

  const application = data?.Properties[0];
  sessionStorage.setItem("pt-property",JSON.stringify(application))
  let units = [];
  units = application?.units;
  units &&
    units.sort((x, y) => {
      let a = x.floorNo,
        b = y.floorNo;
      if (x.floorNo < 0) {
        a = x.floorNo * -20;
      }
      if (y.floorNo < 0) {
        b = y.floorNo * -20;
      }
      if (a > b) {
        return 1;
      } else {
        return -1;
      }
    });
  let owners = [];
  owners = application?.owners;
  let docs = [];
  docs = application?.documents;
  if (isLoading) {
    return <Loader />;
  }
  
  let flrno,
    i = 0;
  flrno = units && units[0]?.floorNo;
  const handleDownloadPdf = async () => {
    const applications = application || {};
    const tenantInfo = coreData.tenants.find((tenant) => tenant.code === applications.tenantId);
    const pdfData = await getPTAcknowledgementData({ ...applications }, tenantInfo, t);
    Digit.Utils.pdf.generate(pdfData);
  };

  return (
    <React.Fragment>
      <Header>{t("PT_MUTATION_APPLICATION_DETAILS")}</Header>
      <div style={{ ...propertyCardBodyStyle, maxHeight: "calc(100vh - 12em)" }}>
        <div>
          <LinkButton label={t("CS_COMMON_DOWNLOAD")} className="check-page-link-button pt-application-download-btn" onClick={handleDownloadPdf} />
        </div>
        <Card>
          <StatusTable>
            <Row label={t("PT_APPLICATION_NUMBER_LABEL")} text={application?.acknowldgementNumber} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_SEARCHPROPERTY_TABEL_PTUID")} text={application?.propertyId} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_APPLICATION_CHANNEL_LABEL")} text="online" />
          </StatusTable>
          <CardSubHeader>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
          <StatusTable>
            <Row label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={`${t(application?.address?.pincode)}` || "NA"} />
            <Row label={t("PT_COMMON_CITY")} text={`${t(getCityLocale(application?.tenantId))}` || "NA"} />
            <Row label={t("PT_COMMON_LOCALITY_OR_MOHALLA")} text={`${t(application?.address?.locality?.name)}` || "NA"} />
            <Row label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={`${t(application?.address?.street)}` || "NA"} />
            <Row label={t("PT_PROPERTY_ADDRESS_COLONY_NAME")} text={`${t(application?.address?.buildingName)}` || "NA"} />
          </StatusTable>
          <CardSubHeader>{t("PT_PROPERTY_ASSESSMENT_DETAILS_HEADER")}</CardSubHeader>
          <StatusTable>
            <Row
              label={t("PT_ASSESMENT_INFO_USAGE_TYPE")}
              text={
                `${t(
                  (application.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPSUBUSGTYPE_") +
                    (application?.usageCategory?.split(".")[1] ? application?.usageCategory?.split(".")[1] : application.usageCategory)
                )}` || "NA"
              }
            />
            <Row label={t("PT_COMMON_PROPERTY_TYPE")} text={`${t(getPropertyTypeLocale(application?.propertyType))}` || "NA"} />
            <Row label={t("PT_ASSESMENT1_PLOT_SIZE")} text={(application?.landArea && `${t(`${application?.landArea} sq.ft`)}`) || "NA"} />
            <Row label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")} text={`${t(application?.noOfFloors)}` || "NA"} />
          </StatusTable>
          <div>
            {Array.isArray(units) &&
              units.length > 0 &&
              units.map((unit, index) => (
                <div key={index}>
                  {(flrno !== unit?.floorNo ? (i = 1) : (i = i + 1)) && i === 1 && (
                    <CardSubHeader>{t(`PROPERTYTAX_FLOOR_${unit?.floorNo}`)}</CardSubHeader>
                  )}
                  <div style={{ border: "groove" }}>
                    <CardSubHeader>
                      {t("Unit")} {i}
                    </CardSubHeader>
                    {(flrno = unit?.floorNo) > -3 && (
                      <StatusTable>
                        <Row
                          label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")}
                          text={
                            `${t(
                              (application.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPSUBUSGTYPE_") +
                                (application?.usageCategory?.split(".")[1] ? application?.usageCategory?.split(".")[1] : application.usageCategory) +
                                (application.usageCategory !== "RESIDENTIAL" ? "_" + unit?.usageCategory.split(".").pop() : "")
                            )}` || "NA"
                          }
                        />
                        <Row label={t("PT_OCCUPANY_TYPE_LABEL")} text={`${t("PROPERTYTAX_OCCUPANCYTYPE_" + unit?.occupancyType)}` || "NA"} />
                        <Row label={t("PT_BUILTUP_AREA_LABEL")} text={`${`${unit?.constructionDetail?.builtUpArea} sq.ft` || "NA"}`} />
                        {unit.occupancyType=="RENTED"&& <Row label={t("PT_FORM2_TOTAL_ANNUAL_RENT")} text={`${unit?.arv&&`₹${unit?.arv}` || "NA"}`} />}
                      </StatusTable>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <CardSubHeader>{t("PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER")}</CardSubHeader>
          <div>
            {Array.isArray(owners) &&
              owners.map((owner, index) => (
                <div key={index}>
                  <CardSubHeader>
                    {owners.length != 1 && (
                      <span>
                        {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                      </span>
                    )}
                  </CardSubHeader>
                  <StatusTable>
                    <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={`${t(owner?.name)}` || "NA"} />
                    <Row label={t("PT_FORM3_GUARDIAN_NAME")} text={`${t(owner?.fatherOrHusbandName)}` || "NA"} />
                    <Row label={t("PT_COMMON_GENDER_LABEL")} text={`${t(owner?.gender)}` || "NA"} />
                    <Row
                      label={t("PT_FORM3_OWNERSHIP_TYPE")}
                      text={`${application?.ownershipCategory ? t(`PT_OWNERSHIP_${application?.ownershipCategory}`) : "NA"}`}
                    />
                    <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(owner?.mobileNumber)}`} />
                    <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={`${t("NA")}`} />
                    <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={`${t(owner?.ownerType).toLowerCase()}`} />
                    <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(owner?.correspondenceAddress)}` || "NA"} />
                  </StatusTable>
                </div>
              ))}
          </div>
          <CardSubHeader>{t("PT_COMMON_DOCS")}</CardSubHeader>
          <div>
            {Array.isArray(docs) ? (
              docs.length > 0 && <PropertyDocument property={application}></PropertyDocument>
            ) : (
              <StatusTable>
                <Row text="PT_NO_DOCUMENTS_MSG" />
              </StatusTable>
            )}
          </div>
          <PTWFApplicationTimeline application={application} id={acknowledgementIds} />
        </Card>
      </div>
    </React.Fragment>
  );
};

export default PTApplicationDetails;
