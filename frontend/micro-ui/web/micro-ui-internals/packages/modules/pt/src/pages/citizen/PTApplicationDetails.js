import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable, MultiLink, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import getPTAcknowledgementData from "../../getPTAcknowledgementData";
import PropertyDocument from "../../pageComponents/PropertyDocument";
import PTWFApplicationTimeline from "../../pageComponents/PTWFApplicationTimeline";
import { getCityLocale, getPropertyTypeLocale, propertyCardBodyStyle, getMohallaLocale, pdfDownloadLink } from "../../utils";

import get from "lodash/get";
import { size } from "lodash";

const PTApplicationDetails = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { acknowledgementIds, tenantId } = useParams();
  const [acknowldgementData, setAcknowldgementData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  // const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch(
    { filters: { acknowledgementIds } },
    { filters: { acknowledgementIds } }
  );
  const [billAmount, setBillAmount] = useState(null);
  const [billStatus, setBillStatus] = useState(null);

  const properties = get(data, "Properties", []);
  const propertyId = get(data, "Properties[0].propertyId", []);
  let property = (properties && properties.length > 0 && properties[0]) || {};
  const application = property;
  sessionStorage.setItem("pt-property", JSON.stringify(application));

  useEffect(async () => {
    if (acknowledgementIds && tenantId && property) {
      const res = await Digit.PaymentService.searchBill(tenantId, { Service: "PT.MUTATION", consumerCode: acknowledgementIds });
      if (!res.Bill.length) {
        const res1 = await Digit.PTService.ptCalculateMutation({ Property: property }, tenantId);
        setBillAmount(res1?.[acknowledgementIds]?.totalAmount || t("CS_NA"));
        setBillStatus(t(`PT_MUT_BILL_ACTIVE`));
      } else {
        setBillAmount(res?.Bill[0]?.totalAmount || t("CS_NA"));
        setBillStatus(t(`PT_MUT_BILL_${res?.Bill[0]?.status?.toUpperCase()}`));
      }
    }
  }, [tenantId, acknowledgementIds, property]);

  const { isLoading: auditDataLoading, isError: isAuditError, data: auditResponse } = Digit.Hooks.pt.usePropertySearch(
    {
      tenantId,
      filters: { propertyIds: propertyId, audit: true },
    },
    {
      enabled: true,
      // select: (d) =>
      //   d.Properties.filter((e) => e.status === "ACTIVE")?.sort((a, b) => b.auditDetails.lastModifiedTime - a.auditDetails.lastModifiedTime),
    }
  );

  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: tenantId,
      businessService: "PT.MUTATION",
      consumerCodes: acknowledgementIds,
      isEmployee: false,
    },
    { enabled: acknowledgementIds ? true : false }
  );

  if (!property.workflow) {
    let workflow = {
      id: null,
      tenantId: tenantId,
      businessService: "PT.MUTATION",
      businessId: application?.acknowldgementNumber,
      action: "",
      moduleName: "PT",
      state: null,
      comment: null,
      documents: null,
      assignes: null,
    };
    property.workflow = workflow;
  }

  if (property && property.owners && property.owners.length > 0) {
    let ownersTemp = [];
    let owners = [];
    property.owners.map((owner) => {
      owner.documentUid = owner.documents ? owner.documents[0].documentUid : "NA";
      owner.documentType = owner.documents ? owner.documents[0].documentType : "NA";
      if (owner.status == "ACTIVE") {
        ownersTemp.push(owner);
      } else {
        owners.push(owner);
      }
    });
    property.ownersInit = owners;
    property.ownersTemp = ownersTemp;
  }
  property.ownershipCategoryTemp = property?.ownershipCategory;
  property.ownershipCategoryInit = "NA";
  // Set Institution/Applicant info card visibility
  if (get(application, "Properties[0].ownershipCategory", "")?.startsWith("INSTITUTION")) {
    property.institutionTemp = property.institution;
  }

  if (auditResponse && Array.isArray(get(auditResponse, "Properties", [])) && get(auditResponse, "Properties", []).length > 0) {
    const propertiesAudit = get(auditResponse, "Properties", []);
    const propertyIndex = property.status == "ACTIVE" ? 1 : 0;
    // const previousActiveProperty = propertiesAudit.filter(property => property.status == 'ACTIVE').sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];
    // Removed filter(property => property.status == 'ACTIVE') condition to match result in qa env
    const previousActiveProperty = propertiesAudit
      .filter((property) => property.status == "ACTIVE")
      .sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];
    property.ownershipCategoryInit = previousActiveProperty?.ownershipCategory;
    property.ownersInit = previousActiveProperty?.owners?.filter((owner) => owner.status == "ACTIVE");

    const curWFProperty = propertiesAudit.sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[0];
    property.ownersTemp = curWFProperty.owners.filter((owner) => owner.status == "ACTIVE");

    if (property?.ownershipCategoryInit?.startsWith("INSTITUTION")) {
      property.institutionInit = previousActiveProperty.institution;
    }
  }

  let transfereeOwners = get(property, "ownersTemp", []);
  let transferorOwners = get(property, "ownersInit", []);

  let transfereeInstitution = get(property, "institutionTemp", []);
  let isInstitution = property?.ownershipCategoryInit?.startsWith("INSTITUTION");
  let transferorInstitution = get(property, "institutionInit", []);

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

  if (isLoading || auditDataLoading) {
    return <Loader />;
  }

  let flrno,
    i = 0;
  flrno = units && units[0]?.floorNo;

  const isPropertyTransfer = property?.creationReason && property.creationReason === "MUTATION" ? true : false;

  const getAcknowledgementData = async () => {
    const applications = application || {};
    const tenantInfo = tenants.find((tenant) => tenant.code === applications.tenantId);
    const acknowldgementDataAPI = await getPTAcknowledgementData({ ...applications }, tenantInfo, t);
    Digit.Utils.pdf.generate(acknowldgementDataAPI);
    //setAcknowldgementData(acknowldgementDataAPI);
  };

  let documentDate = t("CS_NA");
  if (property?.additionalDetails?.documentDate) {
    const date = new Date(property?.additionalDetails?.documentDate);
    const month = Digit.Utils.date.monthNames[date.getMonth()];
    documentDate = `${date.getDate()} ${month} ${date.getFullYear()}`;
  }

  async function getRecieptSearch({ tenantId, payments, ...params }) {
    let response = { filestoreIds: [payments?.fileStoreId] };
    response = await Digit.PaymentService.generatePdf(tenantId, { Payments: [{ ...payments }] }, "consolidatedreceipt");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  const handleDownload = async (document, tenantid) => {
    let tenantId = tenantid ? tenantid : tenantId;
    const res = await Digit.UploadServices.Filefetch([document?.fileStoreId], tenantId);
    let documentLink = pdfDownloadLink(res.data, document?.fileStoreId);
    window.open(documentLink, "_blank");
  };

  const printCertificate = async () => {
    let response = await Digit.PaymentService.generatePdf(tenantId, { Properties: [data?.Properties?.[0]] }, "ptmutationcertificate");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  };

  let dowloadOptions = [];

  dowloadOptions.push({
    label: data?.Properties?.[0]?.creationReason === "MUTATION" ? t("MT_APPLICATION") : t("PT_APPLICATION_ACKNOWLEDGMENT"),
    onClick: () => getAcknowledgementData(),
  });
  if (reciept_data && reciept_data?.Payments.length > 0 && recieptDataLoading == false)
    dowloadOptions.push({
      label: t("MT_FEE_RECIEPT"),
      onClick: () => getRecieptSearch({ tenantId: reciept_data?.Payments[0]?.tenantId, payments: reciept_data?.Payments[0] }),
    });
  if (data?.Properties?.[0]?.creationReason === "MUTATION" && data?.Properties?.[0]?.status === "ACTIVE")
    dowloadOptions.push({
      label: t("MT_CERTIFICATE"),
      onClick: () => printCertificate(),
    });

  return (
    <React.Fragment>
      <div>
        <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" }}>
          <Header styles={{ fontSize: "32px" }}>{t("PT_MUTATION_APPLICATION_DETAILS")}</Header>
          {dowloadOptions && dowloadOptions.length > 0 && (
            <MultiLink
              className="multilinkWrapper"
              onHeadClick={() => setShowOptions(!showOptions)}
              displayOptions={showOptions}
              options={dowloadOptions}
            />
          )}
        </div>
        <Card>
          <StatusTable>
            <Row
              className="border-none"
              label={t("PT_APPLICATION_NUMBER_LABEL")}
              text={property?.acknowldgementNumber} /* textStyle={{ whiteSpace: "pre" }} */
            />
            <Row
              className="border-none"
              label={t("PT_SEARCHPROPERTY_TABEL_PTUID")}
              text={property?.propertyId} /* textStyle={{ whiteSpace: "pre" }} */
            />
            <Row
              className="border-none"
              label={t("PT_APPLICATION_CHANNEL_LABEL")}
              text={t(`ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${property?.channel}`)}
            />

            {isPropertyTransfer && (
              <React.Fragment>
                <Row className="border-none" label={t("PT_FEE_AMOUNT")} text={billAmount || t("CS_NA")} textStyle={{ whiteSpace: "pre" }} />
                <Row className="border-none" label={t("PT_PAYMENT_STATUS")} text={billStatus} textStyle={{ whiteSpace: "pre" }} />
              </React.Fragment>
            )}
          </StatusTable>
          <CardSubHeader style={{ fontSize: "24px" }}>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none" label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={property?.address?.pincode || t("CS_NA")} />
            <Row className="border-none" label={t("PT_COMMON_CITY")} text={property?.address?.city || t("CS_NA")} />
            <Row
              className="border-none"
              label={t("PT_COMMON_LOCALITY_OR_MOHALLA")}
              text=/* {`${t(application?.address?.locality?.name)}` || t("CS_NA")} */ {t(`${property?.address?.locality?.area}`) || t("CS_NA")}
            />
            <Row className="border-none" label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={property?.address?.street || t("CS_NA")} />
            {isPropertyTransfer ? (
              <Row className="border-none" label={t("PT_DOOR_OR_HOUSE")} text={property?.address?.doorNo || t("CS_NA")} />
            ) : (
              <Row className="border-none" label={t("PT_PROPERTY_ADDRESS_COLONY_NAME")} text={property?.address?.buildingName || t("CS_NA")} />
            )}
          </StatusTable>

          {isPropertyTransfer ? (
            <React.Fragment>
              <CardSubHeader style={{ fontSize: "24px" }}>{t("PT_MUTATION_TRANSFEROR_DETAILS")}</CardSubHeader>
              <div>
                {Array.isArray(transferorOwners) &&
                  transferorOwners.map((owner, index) => (
                    <div key={index}>
                      <CardSubHeader>
                        {transferorOwners.length != 1 && (
                          <span>
                            {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                          </span>
                        )}
                      </CardSubHeader>
                      <StatusTable>
                        <Row className="border-none" label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={owner?.name || t("CS_NA")} />
                        <Row className="border-none" label={t("PT_FORM3_GUARDIAN_NAME")} text={owner?.fatherOrHusbandName || t("CS_NA")} />
                        <Row className="border-none" label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                        <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={owner?.emailId || t("CS_NA")} />
                        <Row
                          className="border-none"
                          label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")}
                          text={owner?.ownerType.toLowerCase() || t("CS_NA")}
                        />
                        <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                      </StatusTable>
                    </div>
                  ))}
              </div>

              <CardSubHeader style={{ fontSize: "24px" }}>{t("PT_MUTATION_TRANSFEREE_DETAILS")}</CardSubHeader>
              {isInstitution ? (
                <div>
                  {Array.isArray(transfereeOwners) &&
                    transfereeOwners.map((owner, index) => (
                      <div key={index}>
                        <CardSubHeader>
                          {transfereeOwners.length != 1 && (
                            <span>
                              {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                            </span>
                          )}
                        </CardSubHeader>
                        <StatusTable>
                          <Row className="border-none" label={t("PT_INSTITUTION_NAME")} text={transferorInstitution?.name || t("CS_NA")} />
                          <Row className="border-none" label={t("PT_TYPE_OF_INSTITUTION")} text={`${t(transferorInstitution?.type)}` || t("CS_NA")} />
                          <Row
                            className="border-none"
                            label={t("PT_NAME_AUTHORIZED_PERSON")}
                            text={transferorInstitution?.nameOfAuthorizedPerson || t("CS_NA")}
                          />
                          <Row className="border-none" label={t("PT_LANDLINE_NUMBER")} text={owner?.altContactNumber || t("CS_NA")} />
                          <Row className="border-none" label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                          <Row
                            className="border-none"
                            label={t("PT_INSTITUTION_DESIGNATION")}
                            text={transferorInstitution?.designation || t("CS_NA")}
                          />
                          <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={owner?.emailId || t("CS_NA")} />
                          <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                        </StatusTable>
                      </div>
                    ))}
                </div>
              ) : (
                <div>
                  {Array.isArray(transfereeOwners) &&
                    transfereeOwners.map((owner, index) => (
                      <div key={index}>
                        <CardSubHeader>
                          {transfereeOwners.length != 1 && (
                            <span>
                              {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                            </span>
                          )}
                        </CardSubHeader>
                        <StatusTable>
                          <Row className="border-none" label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={owner?.name || t("CS_NA")} />
                          <Row className="border-none" label={t("PT_FORM3_GUARDIAN_NAME")} text={owner?.fatherOrHusbandName || t("CS_NA")} />
                          <Row className="border-none" label={t("PT_COMMON_GENDER_LABEL")} text={owner?.gender || t("CS_NA")} />
                          <Row
                            className="border-none"
                            label={t("PT_FORM3_OWNERSHIP_TYPE")}
                            text={`${application?.ownershipCategory ? t(`PT_OWNERSHIP_${application?.ownershipCategory}`) : t("CS_NA")}`}
                          />
                          <Row className="border-none" label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                          <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={owner?.emailId || t("CS_NA")} />
                          <Row
                            className="border-none"
                            label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")}
                            text={(owner?.ownerType).toLowerCase() || t("CS_NA")}
                          />
                          <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                        </StatusTable>
                      </div>
                    ))}
                </div>
              )}
              <CardSubHeader style={{ fontSize: "24px" }}>{t("PT_MUTATION_DETAILS")}</CardSubHeader>
              <StatusTable>
                <Row
                  className="border-none"
                  label={t("PT_MUTATION_PENDING_COURT")}
                  text={property?.additionalDetails?.isMutationInCourt || t("CS_NA")}
                />
                <Row className="border-none" label={t("PT_DETAILS_COURT_CASE")} text={property?.additionalDetails?.caseDetails || t("CS_NA")} />
                <Row
                  className="border-none"
                  label={t("PT_PROP_UNDER_GOV_AQUISITION")}
                  text={property?.additionalDetails?.isPropertyUnderGovtPossession || t("CS_NA")}
                />
                <Row className="border-none" label={t("PT_DETAILS_GOV_AQUISITION")} text={t("CS_NA")} />
              </StatusTable>

              <CardSubHeader style={{ fontSize: "24px" }}>{t("PT_REGISTRATION_DETAILS")}</CardSubHeader>
              <StatusTable>
                <Row
                  className="border-none"
                  label={t("PT_REASON_PROP_TRANSFER")}
                  text={`${t(property?.additionalDetails?.reasonForTransfer)}` || t("CS_NA")}
                />
                <Row className="border-none" label={t("PT_PROP_MARKET_VALUE")} text={property?.additionalDetails?.marketValue || t("CS_NA")} />
                <Row className="border-none" label={t("PT_REG_NUMBER")} text={property?.additionalDetails?.documentNumber || t("CS_NA")} />
                <Row className="border-none" label={t("PT_DOC_ISSUE_DATE")} text={documentDate} />
                <Row className="border-none" label={t("PT_REG_DOC_VALUE")} text={property?.additionalDetails?.documentValue || t("CS_NA")} />
                <Row className="border-none" label={t("PT_REMARKS")} text={t("CS_NA")} />
              </StatusTable>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <CardSubHeader style={{ fontSize: "24px" }}> {t("PT_PROPERTY_ASSESSMENT_DETAILS_HEADER")}</CardSubHeader>
              <StatusTable>
                <Row
                  className="border-none"
                  label={t("PT_ASSESMENT_INFO_USAGE_TYPE")}
                  text={
                    `${t(
                      (property?.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPSUBUSGTYPE_") +
                        (property?.usageCategory?.split(".")[1] ? property?.usageCategory?.split(".")[1] : property?.usageCategory)
                    )}` || t("CS_NA")
                  }
                />
                <Row
                  className="border-none"
                  label={t("PT_COMMON_PROPERTY_TYPE")}
                  text={`${t(getPropertyTypeLocale(property?.propertyType))}` || t("CS_NA")}
                />
                <Row
                  className="border-none"
                  label={t("PT_ASSESMENT1_PLOT_SIZE")}
                  text={(property?.landArea && `${t(`${property?.landArea} sq.ft`)}`) || t("CS_NA")}
                />
                <Row className="border-none" label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")} text={`${t(property?.noOfFloors)}` || t("CS_NA")} />
              </StatusTable>
              <div>
                {Array.isArray(units) &&
                  units.length > 0 &&
                  units.map((unit, index) => (
                    <div key={index}>
                      {(flrno !== unit?.floorNo ? (i = 1) : (i = i + 1)) && i === 1 && (
                        <CardSubHeader>{t(`PROPERTYTAX_FLOOR_${unit?.floorNo}`)}</CardSubHeader>
                      )}
                      <div style={{ border: "groove", padding: "7px", marginBottom: "10px" }}>
                        <CardSubHeader>
                          {t("ES_APPLICATION_DETAILS_UNIT")} {i}
                        </CardSubHeader>
                        {(flrno = unit?.floorNo) > -3 && (
                          <StatusTable>
                            <Row
                              className="border-none"
                              label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")}
                              text={
                                `${t(
                                  (property?.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPSUBUSGTYPE_") +
                                    (property?.usageCategory?.split(".")[1] ? property?.usageCategory?.split(".")[1] : property?.usageCategory) +
                                    (property?.usageCategory !== "RESIDENTIAL" ? "_" + unit?.usageCategory.split(".").pop() : "")
                                )}` || t("CS_NA")
                              }
                            />
                            <Row
                              className="border-none"
                              label={t("PT_OCCUPANY_TYPE_LABEL")}
                              text={`${t("PROPERTYTAX_OCCUPANCYTYPE_" + unit?.occupancyType)}` || t("CS_NA")}
                            />
                            <Row
                              className="border-none"
                              label={t("PT_BUILTUP_AREA_LABEL")}
                              text={`${`${unit?.constructionDetail?.builtUpArea} sq.ft` || t("CS_NA")}`}
                            />
                            {unit.occupancyType == "RENTED" && (
                              <Row
                                className="border-none"
                                label={t("PT_FORM2_TOTAL_ANNUAL_RENT")}
                                text={`${(unit?.arv && `₹${unit?.arv}`) || t("CS_NA")}`}
                              />
                            )}
                          </StatusTable>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              <CardSubHeader style={{ fontSize: "24px" }}>{t("PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER")}</CardSubHeader>
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
                        <Row className="border-none" label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={owner?.name || t("CS_NA")} />
                        <Row className="border-none" label={t("PT_FORM3_GUARDIAN_NAME")} text={owner?.fatherOrHusbandName || t("CS_NA")} />
                        <Row className="border-none" label={t("PT_COMMON_GENDER_LABEL")} text={owner?.gender || t("CS_NA")} />
                        <Row
                          className="border-none"
                          label={t("PT_FORM3_OWNERSHIP_TYPE")}
                          text={`${property?.ownershipCategory ? t(`PT_OWNERSHIP_${property?.ownershipCategory}`) : t("CS_NA")}`}
                        />
                        <Row className="border-none" label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber} />
                        <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={`${owner?.emailId || t("CS_NA")}`} />
                        <Row className="border-none" label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={(owner?.ownerType).toLowerCase()} />
                        <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                      </StatusTable>
                    </div>
                  ))}
              </div>
            </React.Fragment>
          )}

          <CardSubHeader style={{ fontSize: "24px" }}>{t("PT_COMMON_DOCS")}</CardSubHeader>
          <div>
            {Array.isArray(docs) ? (
              docs.length > 0 && <PropertyDocument property={property}></PropertyDocument>
            ) : (
              <StatusTable>
                <Row className="border-none" text={t("PT_NO_DOCUMENTS_MSG")} />
              </StatusTable>
            )}
          </div>
          <PTWFApplicationTimeline application={application} id={acknowledgementIds} userType={"citizen"} />
        </Card>
      </div>
    </React.Fragment>
  );
};

export default PTApplicationDetails;
