import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import getPTAcknowledgementData from "../../getPTAcknowledgementData";
import PropertyDocument from "../../pageComponents/PropertyDocument";
import PTWFApplicationTimeline from "../../pageComponents/PTWFApplicationTimeline";
import { getCityLocale, getPropertyTypeLocale, propertyCardBodyStyle,getMohallaLocale } from "../../utils";

import get from "lodash/get";

const PTApplicationDetails = () => {
  const { t } = useTranslation();
  const { acknowledgementIds } = useParams();
  const [acknowldgementData, setAcknowldgementData] = useState([]);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch(
    { filters: { acknowledgementIds } },
    { filters: { acknowledgementIds } }
  );

  const properties = get(data, "Properties", []);
  const propertyId = get(data, "Properties[0].propertyId", []);
  let property = (properties && properties.length > 0 && properties[0]) || {};
  const application = propertyId;
  sessionStorage.setItem("pt-property", JSON.stringify(application));

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
      assignes: null
    };
    property.workflow = workflow;

  }

  if (property && property.owners && property.owners.length > 0) {
    let ownersTemp = [];
    let owners = [];
    property.owners.map(owner => {
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
  property.ownershipCategoryTemp = property.ownershipCategory;
  property.ownershipCategoryInit = 'NA';
  // Set Institution/Applicant info card visibility
  if (
    get(
      application,
      "Properties[0].ownershipCategory",
      ""
    ).startsWith("INSTITUTION")
  ) {
    property.institutionTemp = property.institution;
  }

  if (auditResponse && Array.isArray(get(auditResponse, "Properties", [])) && get(auditResponse, "Properties", []).length > 0) {
    const propertiesAudit = get(auditResponse, "Properties", []);
    
    const propertyIndex=property.status ==  'ACTIVE' ? 1:0;
    // const previousActiveProperty = propertiesAudit.filter(property => property.status == 'ACTIVE').sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];
    // Removed filter(property => property.status == 'ACTIVE') condition to match result in qa env
    const previousActiveProperty = propertiesAudit.sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];
    property.ownershipCategoryInit = previousActiveProperty.ownershipCategory;
    property.ownersInit = previousActiveProperty.owners.filter(owner => owner.status == "ACTIVE");

    if (property.ownershipCategoryInit.startsWith("INSTITUTION")) {
      property.institutionInit = previousActiveProperty.institution;
    }
  }

  let transfereeOwners = get(
    property,
    "ownersTemp", []
  );
  let transferorOwners = get(
    property,
    "ownersInit", []
  );

  let transfereeInstitution = get(
    property,
    "institutionTemp", []
  );
  let transferorInstitution = get(
    property,
    "institutionInit", []
  );

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
    setAcknowldgementData(acknowldgementDataAPI);
  }
  // useEffect(() => {
    getAcknowledgementData();
  // }, [])

  const handleDownloadPdf = () => {
    Digit.Utils.pdf.generate(acknowldgementData);
  };

  return (
    <React.Fragment>
      <Header>{t("PT_MUTATION_APPLICATION_DETAILS")}</Header>
      <div>
        <div>
          <LinkButton label={t("CS_COMMON_DOWNLOAD")} className="check-page-link-button pt-application-download-btn" onClick={handleDownloadPdf} />
        </div>
        <Card>
          <StatusTable>
            <Row label={t("PT_APPLICATION_NUMBER_LABEL")} text={property?.acknowldgementNumber} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_SEARCHPROPERTY_TABEL_PTUID")} text={property?.propertyId} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_APPLICATION_CHANNEL_LABEL")} text={t(`ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${property?.channel}`)} />
            {
              isPropertyTransfer &&
              <React.Fragment>
                  <Row label={t("Fee Amount")} text={application?.name} textStyle={{ whiteSpace: "pre" }} />
                  <Row label={t("Payment Status")} text={application?.status} textStyle={{ whiteSpace: "pre" }} />
                </React.Fragment>
            }
          </StatusTable>
          <CardSubHeader>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
          <StatusTable>
            <Row label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={`${t(property?.address?.pincode)}` || t("CS_NA")} />
            <Row label={t("PT_COMMON_CITY")} text={`${t(property?.address?.city)}` || t("CS_NA")} />
            <Row label={t("PT_COMMON_LOCALITY_OR_MOHALLA")} text=/* {`${t(application?.address?.locality?.name)}` || t("CS_NA")} */{t(`${(property?.address?.locality?.area)}`) || t("CS_NA")} />
            <Row label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={`${t(property?.address?.street)}` || t("CS_NA")} />
            {isPropertyTransfer ? (
              <React.Fragment>
                      <Row label={t("Door / House Number")} text={`${t(property?.address?.doorNo)}` || t("CS_NA")} />
               </React.Fragment>
                                     ) : (
                    <>
                      <Row label={t("PT_PROPERTY_ADDRESS_COLONY_NAME")} text={`${t(property?.address?.buildingName)}` || t("CS_NA")} />
                     </>
                          )}
          </StatusTable>

          

          { isPropertyTransfer ? (
            <React.Fragment>
              <CardSubHeader>{t("Transferor Details")}</CardSubHeader>
              <StatusTable>
                <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={`${t(transferorOwners[0]?.name)}` || t("CS_NA")} />
                <Row label={t("Guardian Name")} text={`${t(transferorOwners[0]?.fatherOrHusbandName)}` || t("CS_NA")} />   
                <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(transferorOwners[0]?.mobileNumber)}`} />
                <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={`${t(transferorOwners[0]?.emailId)}`} />
                <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={`${t( transferorOwners[0]?.ownerType).toLowerCase()}`} />
                <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(transferorOwners[0]?.correspondenceAddress)}` || t("CS_NA")} />
              </StatusTable>

              <CardSubHeader>{t("Transferee Details")}</CardSubHeader>
              {
                transferorInstitution ? (
                  <StatusTable>
                    <p> Add institution related data here</p>
                  </StatusTable>
                ) : (
                  <StatusTable>
                    <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={`${t(transfereeOwners[0]?.name)}` || t("CS_NA")} />
                    <Row label={t("PT_FORM3_GUARDIAN_NAME")} text={`${t(transfereeOwners[0]?.fatherOrHusbandName)}` || t("CS_NA")} />
                    <Row label={t("PT_COMMON_GENDER_LABEL")} text={`${t(transfereeOwners[0]?.gender)}` || t("CS_NA")} />
                    <Row
                      label={t("PT_FORM3_OWNERSHIP_TYPE")}
                      text={`${application?.ownershipCategory ? t(`PT_OWNERSHIP_${transfereeOwners[0]?.ownershipCategory}`) : t("CS_NA")}`}
                    />
                    <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(transfereeOwners[0]?.mobileNumber)}`} />
                    <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")}text={`${t(transfereeOwners[0]?.emailId)}`} />
                    <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={`${t(transfereeOwners[0]?.ownerType).toLowerCase()}`} />
                    <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(transfereeOwners[0].correspondenceAddress)}` || t("CS_NA")} />
                  </StatusTable>
                )
              }
         <CardSubHeader>{t("Mutation Details")}</CardSubHeader>
         <div>
          
        <StatusTable>
          <Row label={t("Is Mutation pending in court?")} text={`${t()}`} />
          <Row label={t("Details of Court Case")} text={`${t()}` }  />
          <Row label={t("Is property or part of property inder state / central Government Aquisition?")} text={`${t()}`} />
          <Row label={t("Details of Government Aquisition")} text={`${t()}`}  />                
        </StatusTable>
             
             
         </div>

         <CardSubHeader>{t("Registration Details")}</CardSubHeader>
         <div>
          
         <StatusTable>
                 <Row label={t("Reason for property transfer")} text={`${t()}`} />
                 <Row label={t("Property Market Value")} text={`${t()}` }  />
                 <Row label={t("Registration Document Number")} text={`${t()}`} />
                 <Row label={t("Document Issue date")} text={`${t()}`}  />
                 <Row label={t("Registration Document Value")} text={`${t()}`} />
                 <Row label={t("Remarks")} text={`${t()}`} />

                
               </StatusTable>
             
             
         </div>


            </React.Fragment>
           ) : ( 
           <React.Fragment>
              <CardSubHeader>{t("PT_PROPERTY_ASSESSMENT_DETAILS_HEADER")}</CardSubHeader>
              <StatusTable>
                <Row
                  label={t("PT_ASSESMENT_INFO_USAGE_TYPE")}
                  text={
                    `${t(
                      (property?.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPSUBUSGTYPE_") +
                      (property?.usageCategory?.split(".")[1] ? property?.usageCategory?.split(".")[1] : property?.usageCategory)
                    )}` || t("CS_NA")
                  }
                />
                <Row label={t("PT_COMMON_PROPERTY_TYPE")} text={`${t(getPropertyTypeLocale(property?.propertyType))}` || t("CS_NA")} />
                <Row label={t("PT_ASSESMENT1_PLOT_SIZE")} text={(property?.landArea && `${t(`${property?.landArea} sq.ft`)}`) || t("CS_NA")} />
                <Row label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")} text={`${t(property?.noOfFloors)}` || t("CS_NA")} />
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
                          {t("ES_APPLICATION_DETAILS_UNIT")} {i}
                        </CardSubHeader>
                        {(flrno = unit?.floorNo) > -3 && (
                          <StatusTable>
                            <Row
                              label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")}
                              text={
                                `${t(
                                  (property?.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPSUBUSGTYPE_") +
                                  (property?.usageCategory?.split(".")[1] ? property?.usageCategory?.split(".")[1] : property?.usageCategory) +
                                  (property?.usageCategory !== "RESIDENTIAL" ? "_" + unit?.usageCategory.split(".").pop() : "")
                                )}` || t("CS_NA")
                              }
                            />
                            <Row label={t("PT_OCCUPANY_TYPE_LABEL")} text={`${t("PROPERTYTAX_OCCUPANCYTYPE_" + unit?.occupancyType)}` || t("CS_NA")} />
                            <Row label={t("PT_BUILTUP_AREA_LABEL")} text={`${`${unit?.constructionDetail?.builtUpArea} sq.ft` || t("CS_NA")}`} />
                            {unit.occupancyType == "RENTED" && (
                              <Row label={t("PT_FORM2_TOTAL_ANNUAL_RENT")} text={`${(unit?.arv && `₹${unit?.arv}`) || t("CS_NA")}`} />
                            )}
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
                        <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={`${t(owner?.name)}` || t("CS_NA")} />
                        <Row label={t("PT_FORM3_GUARDIAN_NAME")} text={`${t(owner?.fatherOrHusbandName)}` || t("CS_NA")} />
                        <Row label={t("PT_COMMON_GENDER_LABEL")} text={`${t(owner?.gender)}` || t("CS_NA")} />
                        <Row
                          label={t("PT_FORM3_OWNERSHIP_TYPE")}
                          text={`${property?.ownershipCategory ? t(`PT_OWNERSHIP_${property?.ownershipCategory}`) : t("CS_NA")}`}
                        />
                        <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(owner?.mobileNumber)}`} />
                        <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={`${t(t("CS_NA"))}`} />
                        <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={`${t(owner?.ownerType).toLowerCase()}`} />
                        <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(owner?.correspondenceAddress)}` || t("CS_NA")} />
                      </StatusTable>
                    </div>
                  ))}
              </div>
            </React.Fragment>
           )
          }
          
          <CardSubHeader>{t("PT_COMMON_DOCS")}</CardSubHeader>
          <div>
            {Array.isArray(docs) ? (
              docs.length > 0 && <PropertyDocument property={property}></PropertyDocument>
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
