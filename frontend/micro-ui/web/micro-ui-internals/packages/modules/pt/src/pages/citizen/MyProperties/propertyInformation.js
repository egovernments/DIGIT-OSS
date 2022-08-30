import {
  Card,
  CardSubHeader,
  EditIcon,
  Header,
  LinkButton,
  Loader,
  PopUp,
  Row,
  StatusTable,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import PropertyDocument from "../../../pageComponents/PropertyDocument";
import { getCityLocale, getPropertyTypeLocale, stringReplaceAll } from "../../../utils";

const setBillData = async (tenantId, propertyIds, updatefetchBillData, updateCanFetchBillData) => {
  const assessmentData = await Digit.PTService.assessmentSearch({ tenantId, filters: { propertyIds } });
  let billData = {};
  if (assessmentData?.Assessments?.length > 0) {
    billData = await Digit.PaymentService.fetchBill(tenantId, {
      businessService: "PT",
      consumerCode: propertyIds,
    });
  }
  updatefetchBillData(billData);
  updateCanFetchBillData({
    loading: false,
    loaded: true,
    canLoad: true,
  });
};

const getBillAmount = (fetchBillData = null) => {
  if (fetchBillData == null) return "CS_NA";
  return fetchBillData ? (fetchBillData?.Bill && fetchBillData.Bill[0] ? fetchBillData.Bill[0]?.totalAmount : "0") : "0";
};

const PropertyInformation = () => {
  const { t } = useTranslation();
  const { propertyIds } = useParams();

  var isMobile = window.Digit.Utils.browser.isMobile();
  const [enableAudit, setEnableAudit] = useState(false);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: UpdateNumberConfig } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(),"PropertyTax",["UpdateNumber"],{
    select: (data) => {
      return data?.PropertyTax?.UpdateNumber?.[0];
    },
    retry:false,
    enable:false
  });

  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({ filters: { propertyIds } }, { filters: { propertyIds } });

  const { isLoading: auditDataLoading, isError: isAuditError, data: auditData } = Digit.Hooks.pt.usePropertySearch(
    {
      tenantId,
      filters: { propertyIds, audit: true },
    },
    {
      enabled: enableAudit,
      select: (d) =>
        d.Properties.filter((e) => e.status === "ACTIVE")?.sort((a, b) => b.auditDetails.lastModifiedTime - a.auditDetails.lastModifiedTime),
    }
  );

  const [popup, showPopup] = useState(false);
  const [billData, updateCanFetchBillData] = useState({
    loading: false,
    loaded: false,
    canLoad: false,
  });

  const [fetchBillData, updatefetchBillData] = useState({});

  const [property, setProperty] = useState(() => data?.Properties[0] || " ");
  const mutation = Digit.Hooks.pt.usePropertyAPI(property?.tenantId, false);

  let specialCategoryDoc = [];
  property?.documents?.filter(ob => ob.documentType.includes("SPECIALCATEGORYPROOF")).map((doc) => {
      specialCategoryDoc.push(doc);
  })
  
  useEffect(() => {
    if (data) {
      setProperty(data?.Properties[0]);
      if (data?.Properties[0]?.status !== "ACTIVE") setEnableAudit(true);
    }
  }, [data]);

  useEffect(() => {
    if (auditData?.[0]) {
      const property = auditData?.[0] || {};
      property.owners = property?.owners?.filter((owner) => owner.status == "ACTIVE");
      setProperty(property);
    }
  }, [enableAudit, auditData]);

  sessionStorage.setItem("pt-property", JSON.stringify(property));
  let docs = [];
  docs = property?.documents;
  let units = [];
  let owners = [];
  owners = property?.owners;
  units = property?.units;
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

  if (isLoading) {
    return <Loader />;
  }

  if (property?.status == "ACTIVE" && !billData.loading && !billData.loaded && !billData.canLoad) {
    updateCanFetchBillData({
      loading: false,
      loaded: false,
      canLoad: true,
    });
  }
  if (billData?.canLoad && !billData.loading && !billData.loaded) {
    updateCanFetchBillData({
      loading: true,
      loaded: false,
      canLoad: true,
    });
    setBillData(property?.tenantId || tenantId, propertyIds, updatefetchBillData, updateCanFetchBillData);
  }

  let flrno,
    i = 0;
  flrno = units && units[0]?.floorNo;
  const ActionButton = ({ jumpTo, style }) => {
    const { t } = useTranslation();
    const history = useHistory();
    function routeTo() {
      history.push(jumpTo);
    }
    return <LinkButton style={style} label={t("PT_OWNER_HISTORY")} className="check-page-link-button" onClick={routeTo} />;
  };
  const UpdatePropertyNumberComponent = Digit?.ComponentRegistryService?.getComponent("UpdateNumber");
  return (
    <React.Fragment>
      <Header>{t("PT_PROPERTY_INFORMATION")}</Header>
      <div>
        <Card>
          <StatusTable>
            <Row className="border-none" label={t("PT_PROPERTY_PTUID")} text={`${property.propertyId || t("CS_NA")}`} /* textStyle={{ whiteSpace: "pre" }} */ />
            <Row className="border-none" label={t("CS_COMMON_TOTAL_AMOUNT_DUE")} text={`₹${t(getBillAmount(fetchBillData))}`} />
          </StatusTable>
          <CardSubHeader>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none" label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={`${property.address?.pincode || t("CS_NA")}`} />
            <Row className="border-none" label={t("PT_COMMON_CITY")} text={`${t(getCityLocale(property?.tenantId)) || t("CS_NA")}`} />
            <Row className="border-none" label={t("PT_COMMON_LOCALITY_OR_MOHALLA")} text={`${t(property?.address?.locality?.name)}` || t("CS_NA")} />
            <Row className="border-none" label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={`${property.address?.street || t("CS_NA")}`} />
            <Row className="border-none" label={t("PT_PROPERTY_ADDR_DOOR_HOUSE_NO")} text={`${property.address?.doorNo || t("CS_NA")}`} />
          </StatusTable>
          <CardSubHeader>{t("PT_PROPERTY_ASSESSMENT_DETAILS_HEADER")}</CardSubHeader>
          <StatusTable>
            {/* <Row 
              className="border-none" 
              label={t("PT_ASSESMENT_INFO_USAGE_TYPE")}
              text={
                `${t(
                  (property.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPSUBUSGTYPE_") +
                    (property?.usageCategory?.split(".")[1] ? property?.usageCategory?.split(".")[1] : property.usageCategory)
                )}` || t("CS_NA")
              }
            /> */}
            <Row className="border-none" label={t("PT_COMMON_PROPERTY_TYPE")} text={`${t(getPropertyTypeLocale(property?.propertyType))}` || t("CS_NA")} />
            <Row className="border-none" label={t("PT_ASSESMENT1_PLOT_SIZE")} text={`${property.landArea} sq.ft` || t("CS_NA")} />
            <Row className="border-none" label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")} text={`${property.noOfFloors || t("CS_NA")}`} />
          </StatusTable>
          <div>
            {Array.isArray(units) &&
              units.length > 0 &&
              units.map((unit, index) => (
                <div key={index}>
                  {(flrno !== unit?.floorNo ? (i = 1) : (i = i + 1)) && i === 1 && (
                    <CardSubHeader>{t(`PROPERTYTAX_FLOOR_${unit?.floorNo}`)}</CardSubHeader>
                  )}
                  <div style={{ border: "groove", marginBottom:"10px" }}>
                    <CardSubHeader>
                      {t("ES_APPLICATION_DETAILS_UNIT")} {i}
                    </CardSubHeader>
                    {(flrno = unit?.floorNo) > -5 && (
                      <StatusTable>
                        <Row 
                          className="border-none" 
                          label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")}
                          text={
                            `${t(
                              (property.usageCategory !== "RESIDENTIAL" ? "COMMON_PROPUSGTYPE_NONRESIDENTIAL_" : "COMMON_PROPUSGTYPE_") +
                                (property?.usageCategory?.split(".")[1] ? property?.usageCategory?.split(".")[1] : property.usageCategory) 
                                /* (property.usageCategory !== "RESIDENTIAL" ? "_" + unit?.usageCategory.split(".").pop() : "") */
                            )}` || t("CS_NA")
                          }
                        />
                        <Row className="border-none" label={t("PT_OCCUPANY_TYPE_LABEL")} text={`${t("PROPERTYTAX_OCCUPANCYTYPE_" + unit?.occupancyType)}` || t("CS_NA")} />
                        <Row className="border-none" label={t("PT_BUILTUP_AREA_LABEL")} text={`${`${unit?.constructionDetail?.builtUpArea} sq.ft` || t("CS_NA")}`} />
                        {unit.occupancyType == "RENTED" && (
                          <Row className="border-none" label={t("PT_FORM2_TOTAL_ANNUAL_RENT")} text={`${(unit?.arv && `₹${unit?.arv}`) || t("CS_NA")}`} />
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
                  {property?.institution && property?.institution?.name && <Row className="border-none" label={t("PT_INSTITUTION_NAME")} text={`${property?.institution?.name || t("CS_NA")}`} />}
                  {property?.institution && property?.institution?.type && <Row className="border-none" label={t("PT_INSTITUTION_TYPE")} text={`${t(`COMMON_MASTERS_OWNERSHIPCATEGORY_${property?.institution?.type}`) || t("CS_NA")}`} />}
                    <Row 
                      className="border-none" 
                      label={t("PT_COMMON_APPLICANT_NAME_LABEL")}
                      textStyle={isMobile?{marginLeft:"29%",marginRight:"5%",wordBreak:"break-word"}:{marginLeft:"21%"}}
                      text={`${owner?.name || t("CS_NA")}`}
                      actionButtonStyle={{marginRight:"-10px"}}
                      actionButton={
                        <ActionButton style={{marginRight:"-10px"}} jumpTo={`/digit-ui/citizen/pt/property/owner-history/${property.tenantId}/${property.propertyId}`} />
                      }
                    />
                    <Row className="border-none"  label={t("PT_COMMON_GENDER_LABEL")} text={`${owner?.gender ? owner?.gender.toLowerCase() : t("CS_NA")}`} />
                    {property?.institution && <Row className="border-none" label={t("PT_LANDLINE_NUMBER_FLOATING_LABEL")} text={`${owner?.altContactNumber || t("CS_NA")}`} />}
                    <Row 
                    className="border-none" 
                    label={t("PT_FORM3_MOBILE_NUMBER")}
                    text={`${t(owner?.mobileNumber)}` || t("CS_NA")}
                    textStyle={isMobile?{marginLeft:"16%"}:{marginLeft:"13%"}}
                    actionButton={
                    property?.status === "ACTIVE"&&owner?.mobileNumber&&Digit.UserService.getUser()?.info?.mobileNumber&&owner.mobileNumber===Digit.UserService.getUser()?.info?.mobileNumber&&<div onClick={() => showPopup({ name: owner?.name, mobileNumber: owner?.mobileNumber, ownerIndex: index })}>
                    <EditIcon />
                    </div>
                    }
                    />         
                    {property?.institution && property?.institution?.designation && <Row className="border-none"  label={t("Designation")} text={`${property?.institution?.designation || t("CS_NA")}`} />}
                    <Row className="border-none" label={t("PT_FORM3_GUARDIAN_NAME")} text={`${owner?.fatherOrHusbandName || t("CS_NA")}`} />
                    <Row 
                      className="border-none" 
                      label={t("PT_FORM3_OWNERSHIP_TYPE")}
                      text={`${property?.ownershipCategory ? t(`PT_OWNERSHIP_${property?.ownershipCategory}`) : t("CS_NA")}`}
                    />
                    <Row className="border-none"  label={t("PT_FORM3_RELATIONSHIP")} text={`${owner?.relationship || t("CS_NA")}`} />
                    {specialCategoryDoc && specialCategoryDoc.length>0 && <Row className="border-none" label={t("PT_SPL_CAT_DOC_TYPE")} text={`${t(stringReplaceAll(specialCategoryDoc[index]?.documentType,".","_"))}` || t("NA")} />}
                    {specialCategoryDoc && specialCategoryDoc.length>0 && <Row className="border-none" label={t("PT_SPL_CAT_DOC_ID")} text={`${t(specialCategoryDoc[index]?.id)}` || t("CS_NA")} />}
                    <Row className="border-none" label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={owner?.emailId ? owner?.emailId:`${(t("CS_NA"))}`} />
                    <Row className="border-none" label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(owner?.correspondenceAddress)}` || t("CS_NA")} />
                    {specialCategoryDoc?.length == 0 && <Row className="border-none"  label={t("PT_SPL_CAT")} text={t("CS_NONE")} /> }
                  </StatusTable>
                </div>
              ))}
          </div>
          <CardSubHeader>{t("PT_COMMON_DOCS")}</CardSubHeader>
          <div>
            {Array.isArray(docs) ? (
              docs.length > 0 && <PropertyDocument property={property}></PropertyDocument>
            ) : (
              <StatusTable>
                <Row className="border-none" text={t("PT_NO_DOCUMENTS_MSG")} />
              </StatusTable>
            )}
          </div>
          <div>
            {property?.status === "ACTIVE" && !enableAudit && (
              <div style={{ marginTop: "1em", bottom: "0px", width: "100%", marginBottom: "1.2em" }}>
                <Link to={{ pathname: `/digit-ui/citizen/pt/property/edit-application/action=UPDATE/${property.propertyId}` }}>
                  <SubmitBar label={t("PT_UPDATE_PROPERTY_BUTTON")} />
                </Link>
              </div>
            )}
          </div>
          {popup && (
            <PopUp className="updatenumber-warper-citizen">
              <UpdatePropertyNumberComponent
                showPopup={showPopup}
                name={popup?.name}
                UpdateNumberConfig={UpdateNumberConfig}
                mobileNumber={popup?.mobileNumber}
                t={t}
                onValidation={(data, showToast) => {
                  let newProp = { ...property };
                  newProp.owners[popup?.ownerIndex].mobileNumber = data.mobileNumber;
                  newProp.creationReason = "UPDATE";
                  newProp.workflow = null;
                  mutation.mutate(
                    {
                      Property: newProp,
                    },
                    {
                      onError: () => {},
                      onSuccess: async (successRes) => {
                        showToast();
                        setTimeout(() => {
                          window.location.reload();
                        }, 3000);
                      },
                    }
                  );
                }}
              ></UpdatePropertyNumberComponent>
            </PopUp>
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default PropertyInformation;
