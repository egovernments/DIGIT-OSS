import {
  Card,
  CardHeader,
  CardSubHeader,
  CardText,
  CheckBox,
  LinkButton,
  Row,
  StatusTable,
  SubmitBar,
  Header,
  EditIcon,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  checkForNA,
  getFixedFilename, isPropertyIndependent, isPropertyselfoccupied,
  ispropertyunoccupied, isPropertyVacant,
} from "../../../utils";
import Timeline from "../../../components/TLTimeline";
import PropertyDocument from "../../../pageComponents/PropertyDocument";

const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();
  function routeTo() {
    history.push(jumpTo);
  }

  return <LinkButton label={t("CS_COMMON_CHANGE")} className="check-page-link-button" onClick={routeTo} />;
};

const CheckPage = ({ onSubmit, value = {} }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [billAmount, setBillAmount] = useState(null);
  const [billStatus, setBillStatus] = useState(null);

  const {
    ownershipCategory,
    Constructiondetails,
    IsAnyPartOfThisFloorUnOccupied,
    propertyArea,
    selfOccupied,
    Owners,
    owners,
    isEditProperty,
    isUpdateProperty,
    searchResult,
    additionalDetails,
  } = value;
  
  const { property } = searchResult;
  const { 
    address,
    propertyType,
    units = [{}],
    landarea,
    landArea,
    UnOccupiedArea
   } = property;

   useEffect(async ()=>{
      const res = await Digit.PaymentService.searchBill(tenantId, {Service: "PT.MUTATION", consumerCode: property?.acknowldgementNumber});
      if(! res.Bill.length) {
        const res1 = await Digit.PTService.ptCalculateMutation({Property: { ...property, additionalDetails: { ...property?.additionalDetails, ...additionalDetails, documentDate: new Date(additionalDetails?.documentDate).getTime() } }}, tenantId);
        setBillAmount(res1?.[property?.acknowldgementNumber]?.totalAmount || t("CS_NA"))
        setBillStatus(t(`PT_MUT_BILL_ACTIVE`))
      } else {
        setBillAmount(res?.Bill[0]?.totalAmount || t("CS_NA"))
        setBillStatus(t(`PT_MUT_BILL_${res?.Bill[0]?.status?.toUpperCase()}`))
      }
  },[])

  const typeOfApplication = !isEditProperty && !isUpdateProperty ? `new-application` : `edit-application`;
  let flatplotsize;
  if (isPropertyselfoccupied(selfOccupied?.i18nKey)) {
    flatplotsize = parseInt(landarea?.floorarea);
    if (ispropertyunoccupied(IsAnyPartOfThisFloorUnOccupied?.i18nKey)) {
      flatplotsize = flatplotsize + parseInt(UnOccupiedArea?.UnOccupiedArea);
    }
  } else {
    flatplotsize = parseInt(landarea?.floorarea) + parseInt(Constructiondetails?.RentArea);
    if (!ispropertyunoccupied(IsAnyPartOfThisFloorUnOccupied?.i18nKey)) {
      flatplotsize = flatplotsize + parseInt(UnOccupiedArea?.UnOccupiedArea);
    }
  }
  if (isPropertyIndependent(propertyType)) {
    flatplotsize = parseInt(propertyArea?.builtUpArea) + parseInt(propertyArea?.plotSize);
  }

  const getCardSubHeadrStyles = () => {
    return { fontSize: "24px", fontWeight: "700", lineHeight: "28px", margin: "20px 0px 16px 0px" }
  }

  let documentDate = t("CS_NA");
  if (additionalDetails?.documentDate) {
    const date = new Date(additionalDetails?.documentDate);
    const month = Digit.Utils.date.monthNames[date.getMonth()];
    documentDate = `${date.getDate()} ${month} ${date.getFullYear()}`;
  }
  
  const routeTo = (jumpTo) => location.href=jumpTo;

  const [agree, setAgree] = useState(false);
  const setdeclarationhandler = () => {
    setAgree(!agree);
  };
  
  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline currentStep={4}/> : null}
    <Header styles={{fontSize:"32px", marginLeft: "8px"}}>{t("WS_COMMON_SUMMARY")}</Header>
    <Card style={{paddingRight:"16px"}}>
    <StatusTable>
        <Row className="border-none" label={t("PT_APPLICATION_NUMBER_LABEL")} text={property?.acknowldgementNumber} textStyle={{ whiteSpace: "pre" }} />
        <Row className="border-none" label={t("PT_SEARCHPROPERTY_TABEL_PTUID")} text={property?.propertyId} textStyle={{ whiteSpace: "pre" }} />
        <Row className="border-none" label={t("PT_APPLICATION_CHANNEL_LABEL")} text={t(`ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${property?.channel}`)} />
        <Row className="border-none" label={t("PT_FEE_AMOUNT")} text={billAmount} textStyle={{ whiteSpace: "pre" }} />
        <Row className="border-none" label={t("PT_PAYMENT_STATUS")} text={billStatus} textStyle={{ whiteSpace: "pre" }} />
    </StatusTable>

    <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
    <StatusTable>
        <Row className="border-none" label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={property?.address?.pincode || t("CS_NA")} />
        <Row className="border-none" label={t("PT_COMMON_CITY")} text={property?.address?.city || t("CS_NA")} />
        <Row className="border-none" label={t("PT_COMMON_LOCALITY_OR_MOHALLA")} text=/* {`${t(application?.address?.locality?.name)}` || t("CS_NA")} */{t(`${(property?.address?.locality?.area)}`) || t("CS_NA")} />
        <Row className="border-none" label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={property?.address?.street || t("CS_NA")} />
        <Row className="border-none" label={t("PT_DOOR_OR_HOUSE")} text={property?.address?.doorNo || t("CS_NA")} />
    </StatusTable>

    <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_MUTATION_TRANSFEROR_DETAILS")}</CardSubHeader>
      <div>
        {Array.isArray(property?.owners) &&
          property?.owners.map((owner, index) => (
            <div key={index} style={{margin:"none"}}>
                {property?.owners.length != 1 && (
                  <span>
                    {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                  </span>
                )}
              <StatusTable>
                <Row className="border-none" label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={owner?.name || t("CS_NA")} />
                <Row className="border-none" label={t("PT_FORM3_GUARDIAN_NAME")} text={owner?.fatherOrHusbandName || t("CS_NA")} />   
                <Row className="border-none" label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={owner?.emailId || t("CS_NA")} />
                <Row className="border-none" label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={ owner?.ownerType.toLowerCase() || t("CS_NA")} />
                <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
              </StatusTable>
            </div>
          ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}> 
        <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_MUTATION_TRANSFEREE_DETAILS")}</CardSubHeader>
        <LinkButton
          label={<EditIcon/>}
          onClick={() => routeTo(`/digit-ui/citizen/pt/property/property-mutation/owner-ship-details@0`)}
        />
      </div>
      {
        ownershipCategory?.code?.includes("INSTITUTIONAL") ? (
          <div>
            {Array.isArray(owners) &&
              owners.map((transferorInstitution, index) => (
                <div key={index}>
                    {owners.length != 1 && (
                      <span>
                        {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                      </span>
                    )}
                  <StatusTable>
                    <Row className="border-none" label={t("PT_INSTITUTION_NAME")} text={transferorInstitution?.inistitutionName || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_TYPE_OF_INSTITUTION")} text={`${t(transferorInstitution?.inistitutetype?.value)}` || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_NAME_AUTHORIZED_PERSON")} text={transferorInstitution?.name || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_LANDLINE_NUMBER")} text={transferorInstitution?.altContactNumber || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_FORM3_MOBILE_NUMBER")} text={transferorInstitution?.mobileNumber || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_INSTITUTION_DESIGNATION")} text={transferorInstitution?.designation || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={transferorInstitution?.emailId || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={transferorInstitution?.correspondenceAddress || t("CS_NA")} />
                  </StatusTable>
                </div>
              ))}
          </div>
        ) : (
          <div>
            {Array.isArray(Owners) &&
              Owners.map((owner, index) => (
                <div key={index}>
                    {Owners.length != 1 && (
                      <span>
                        {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                      </span>
                    )}
                  <StatusTable>
                    <Row className="border-none" label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={owner?.name || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_COMMON_GENDER_LABEL")} text={t(owner?.gender?.i18nKey) || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_FORM3_GUARDIAN_NAME")} text={owner?.fatherOrHusbandName || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_FORM3_RELATIONSHIP")} text={t(owner?.relationship?.i18nKey) || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")}text={owner?.emailId || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                    <Row className="border-none" label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={t(owner?.ownerType?.i18nKey) || t("CS_NA")} />
                    <Row
                      className="border-none"
                      label={t("PT_FORM3_OWNERSHIP_TYPE")}
                      text={`${property?.ownershipCategoryTemp ? t(`PT_OWNERSHIP_${property?.ownershipCategoryTemp}`) : t("CS_NA")}`}
                    />
                  </StatusTable>
                </div>
            ))}
          </div>
        )
      }
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_MUTATION_DETAILS")}</CardSubHeader>
        <LinkButton
          label={<EditIcon/>}
          onClick={() => routeTo(`/digit-ui/citizen/pt/property/property-mutation/is-mutatation-pending`)}
        />
      </div>
      <div>
        <StatusTable>
          <Row
            className="border-none"
            label={t("PT_MUTATION_PENDING_COURT")}
            text={t(additionalDetails?.isMutationInCourt?.code) || t("CS_NA")}
          />
          <Row className="border-none" label={t("PT_DETAILS_COURT_CASE")} text={additionalDetails?.caseDetails || t("CS_NA")} />
          <Row
            className="border-none"
            label={t("PT_PROP_UNDER_GOV_AQUISITION")}
            text={t(additionalDetails?.isPropertyUnderGovtPossession?.code) || t("CS_NA")}
          />
          <Row className="border-none" label={t("PT_DETAILS_GOV_AQUISITION")} text={additionalDetails?.govtAcquisitionDetails || t("CS_NA")} />
        </StatusTable>
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_REGISTRATION_DETAILS")}</CardSubHeader>
        <LinkButton
          label={<EditIcon/>}
          onClick={() => routeTo(`/digit-ui/citizen/pt/property/property-mutation/reason`)}
        />
      </div>
      <StatusTable>
        <Row
          className="border-none"
          label={t("PT_REASON_PROP_TRANSFER")}
          text={`${t(additionalDetails?.reasonForTransfer?.i18nKey)}` || t("CS_NA")}
        />
        <Row className="border-none" label={t("PT_PROP_MARKET_VALUE")} text={additionalDetails?.marketValue || t("CS_NA")} />
        <Row className="border-none" label={t("PT_REG_NUMBER")} text={additionalDetails?.documentNumber || t("CS_NA")} />
        <Row className="border-none" label={t("PT_DOC_ISSUE_DATE")} text={documentDate} />
        <Row className="border-none" label={t("PT_REG_DOC_VALUE")} text={additionalDetails?.documentValue || t("CS_NA")} />
        <Row className="border-none" label={t("PT_REMARKS")} text={additionalDetails?.remarks || t("CS_NA")} />
      </StatusTable>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_COMMON_DOCS")}</CardSubHeader>
        <LinkButton
          label={<EditIcon/>}
          onClick={() => routeTo(`/digit-ui/citizen/pt/property/property-mutation/transfer-reason-doc`)}
        />
      </div>
      <div style={{marginTop:"0 important"}}>
        {Array.isArray(property?.documents) ? (
          property?.documents.length > 0 && <PropertyDocument property={property}></PropertyDocument>
        ) : ( 
          <StatusTable>
            <Row className="border-none" text={t("PT_NO_DOCUMENTS_MSG")} />
          </StatusTable>
        )}
      </div>
      <CheckBox
        label={t("PT_MUTATION_FINAL_DECLARATION_MESSAGE")}
        onChange={setdeclarationhandler}
        styles={{ height: "auto", margin: '2rem 0' }}
      />
      <SubmitBar label={t("PT_COMMON_BUTTON_SUBMIT")} onSubmit={onSubmit} disabled={!agree} />
    </Card>
   </React.Fragment>
  );
};

export default CheckPage;