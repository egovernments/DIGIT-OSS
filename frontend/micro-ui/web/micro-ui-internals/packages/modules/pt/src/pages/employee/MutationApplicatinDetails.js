import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable, MultiLink } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import getPTAcknowledgementData from "../../getPTAcknowledgementData";
import PropertyDocument from "../../pageComponents/PropertyDocument";
import PTWFApplicationTimeline from "../../pageComponents/PTWFApplicationTimeline";
import { getCityLocale, getPropertyTypeLocale, propertyCardBodyStyle,getMohallaLocale } from "../../utils";
import ApplicationDetailsActionBar from "../../../../templates/ApplicationDetails/components/ApplicationDetailsActionBar";
import ActionModal from "../../../../templates/ApplicationDetails/Modal";
import { newConfigMutate } from "../../config/Mutate/config";
import _ from "lodash";
import get from "lodash/get";
import { pdfDownloadLink } from "../../utils";

const MutationApplicationDetails = ({ propertyId, acknowledgementIds, workflowDetails, mutate}) => {
  const { t } = useTranslation();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const [businessService, setBusinessService] = useState("PT.MUTATION");
  const history = useHistory();
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch(
    { filters: { acknowledgementIds },tenantId },
    { filters: { acknowledgementIds },tenantId }
  );
  const [billAmount, setBillAmount] = useState(null);
  const [billStatus, setBillStatus] = useState(null);

  const properties = get(data, "Properties", []);
  // const propertyId = get(data, "Properties[0].propertyId", []);
  let property = (properties && properties.length > 0 && properties[0]) || {};
  const application = property;
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
      // select: (data) => data.Properties?.filter((e) => e.status === "ACTIVE")
    }
  );
  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: tenantId,
      businessService: "PT.MUTATION",
      consumerCodes: acknowledgementIds,
      isEmployee: true,
    },
    {enabled: acknowledgementIds?true:false}
  );

  const [appDetailsToShow, setAppDetailsToShow] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const { isLoading: isLoadingApplicationDetails, isError: isErrorApplicationDetails, data: applicationDetails, error: errorApplicationDetails } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, propertyId);

  useEffect(async ()=>{
    if(acknowledgementIds){
      const res = await Digit.PaymentService.searchBill(tenantId, {Service: businessService, consumerCode: acknowledgementIds});
      if(! res.Bill.length) {
        const res1 = await Digit.PTService.ptCalculateMutation({Property: applicationDetails?.applicationData}, tenantId);
        setBillAmount(res1?.[acknowledgementIds]?.totalAmount || t("CS_NA"))
        setBillStatus(t(`PT_MUT_BILL_ACTIVE`))
      } else {
        setBillAmount(res?.Bill[0]?.totalAmount || t("CS_NA"))
        setBillStatus(t(`PT_MUT_BILL_${res?.Bill[0]?.status?.toUpperCase()}`))
      }
    }
  },[tenantId, acknowledgementIds, businessService])

  useEffect(() => {
    showTransfererDetails();
  }, [auditResponse, applicationDetails, appDetailsToShow]);

  useEffect(() => {
    if (applicationDetails) {
      setAppDetailsToShow(_.cloneDeep(applicationDetails));
    }
  }, [applicationDetails]);

  const showTransfererDetails = () => {
    if (
      auditResponse &&
      Object.keys(appDetailsToShow).length &&
      applicationDetails?.applicationData?.status !== "ACTIVE" &&
      applicationDetails?.applicationData?.creationReason === "MUTATION" &&
      !appDetailsToShow?.applicationDetails.find((e) => e.title === "PT_MUTATION_TRANSFEROR_DETAILS")
    ) {
      let applicationDetails = appDetailsToShow.applicationDetails?.filter((e) => e.title === "PT_OWNERSHIP_INFO_SUB_HEADER");
      let compConfig = newConfigMutate.reduce((acc, el) => [...acc, ...el.body], []).find((e) => e.component === "TransfererDetails");
      applicationDetails.unshift({
        title: "PT_MUTATION_TRANSFEROR_DETAILS",
        belowComponent: () => <TransfererDetails userType="employee" formData={{ originalData: auditResponse[0] }} config={compConfig} />,
      });
      setAppDetailsToShow({ ...appDetailsToShow, applicationDetails });
    }
  };

  const submitAction = async (data, nocData = false, isOBPS = {}) => {
    setIsEnableLoader(true);
    if (typeof data?.customFunctionToExecute === "function") {
      data?.customFunctionToExecute({ ...data });
    }
    if (nocData !== false && nocMutation) {
      const nocPrmomises = nocData?.map(noc => {
        return nocMutation?.mutateAsync(noc)
      })
      try {
        setIsEnableLoader(true);
        const values = await Promise.all(nocPrmomises);
        values && values.map((ob) => {
          Digit.SessionStorage.del(ob?.Noc?.[0]?.nocType);
        })
      }
      catch (err) {
        setIsEnableLoader(false);
        let errorValue = err?.response?.data?.Errors?.[0]?.code ? t(err?.response?.data?.Errors?.[0]?.code) : err?.response?.data?.Errors?.[0]?.message || err;
        closeModal();
        setShowToast({ key: "error", error: {message: errorValue}});
        setTimeout(closeToast, 5000);
        return;
      }
    }
    if (mutate) {
      setIsEnableLoader(true);
      mutate(data, {
        onError: (error, variables) => {
          setIsEnableLoader(false);
          setShowToast({ key: "error", error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          setIsEnableLoader(false);
          if (isOBPS?.bpa) {
            data.selectedAction = selectedAction;
            history.replace(`/digit-ui/employee/obps/response`, { data: data });
          }
          if (isOBPS?.isStakeholder) {
            data.selectedAction = selectedAction;
            history.push(`/digit-ui/employee/obps/stakeholder-response`, { data: data });
          }
          if (isOBPS?.isNoc) {
            history.push(`/digit-ui/employee/noc/response`, { data: data });
          }
          setShowToast({ key: "success", action: selectedAction });
          setTimeout(closeToast, 5000);
          queryClient.clear();
          queryClient.refetchQueries("APPLICATION_SEARCH");
        },
      });
    }

    closeModal();
  };

  async function getRecieptSearch({tenantId,payments,...params}) {
    let response = { filestoreIds: [payments?.fileStoreId] };
      response = await Digit.PaymentService.generatePdf(tenantId, { Payments: [{...payments}] }, "consolidatedreceipt");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const handleDownload = async (document) => {
    const res = await Digit.UploadServices.Filefetch([document?.fileStoreId], tenantId);
    let documentLink = pdfDownloadLink(res.data, document?.fileStoreId);
    window.open(documentLink, "_blank");
  };

  function onActionSelect(action) {
    if (action) {
      if (action?.redirectionUrll) {
        window.location.assign(`${window.location.origin}/digit-ui/employee/payment/collect/${action?.redirectionUrll?.pathname}`);
      } else if (!action?.redirectionUrl) {
        setShowModal(true);
      } else {
        history.push({
          pathname: action.redirectionUrl?.pathname,
          state: { ...action.redirectionUrl?.state },
        });
      }
    } 

    setSelectedAction(action);
    setDisplayMenu(false);
  }

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
    const previousActiveProperty = propertiesAudit.filter(property => property.status == 'ACTIVE').sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];
    // Removed filter(property => property.status == 'ACTIVE') condition to match result in qa env
    // const previousActiveProperty = propertiesAudit.sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];
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

  if (isLoading || auditDataLoading || isEnableLoader) {
    return <Loader />;
  }

  let flrno,
    i = 0;
  flrno = units && units[0]?.floorNo;

 // const isPropertyTransfer = property?.creationReason && property.creationReason === "MUTATION" ? true : false;

  const handleDownloadPdf = async () => {
    const applications = application || {};
    const tenantInfo = tenants.find((tenant) => tenant.code === applications.tenantId);
    const acknowldgementDataAPI = await getPTAcknowledgementData({ ...applications }, tenantInfo, t);
    Digit.Utils.pdf.generate(acknowldgementDataAPI);
  };

  let documentDate = t("CS_NA");
  if(property?.additionalDetails?.documentDate) {
    const date = new Date(property?.additionalDetails?.documentDate);
    const month = Digit.Utils.date.monthNames[date.getMonth()];
    documentDate = `${date.getDate()} ${month} ${date.getFullYear()}`;
  }

  const printCertificate = async () => {
    let response = await Digit.PaymentService.generatePdf(tenantId, { Properties: [data?.Properties?.[0]] }, "ptmutationcertificate");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  };

  let dowloadOptions = [];

  dowloadOptions.push({
    label: t("MT_APPLICATION"),
    onClick: () => handleDownloadPdf()
  });
  if(reciept_data && reciept_data?.Payments.length>0 && recieptDataLoading == false)
  dowloadOptions.push({
    label: t("MT_FEE_RECIEPT"),
    onClick: () => getRecieptSearch({tenantId: reciept_data?.Payments[0]?.tenantId,payments: reciept_data?.Payments[0]})
  });
  if(data?.Properties?.[0]?.creationReason === "MUTATION" && data?.Properties?.[0]?.status === "ACTIVE")
  dowloadOptions.push({
    label: t("MT_CERTIFICATE"),
    onClick: () => printCertificate()
  });

  const getCardSubHeadrStyles = () => {
    return { fontSize: "24px", fontWeight: "700", lineHeight: "28px", margin: "20px 0px" }
  }

  return (
    <React.Fragment>
      <div className="cardHeaderWithOptions" style={{ marginRight: "auto" }}>
      <Header styles={{fontSize: "32px", marginLeft: "12px"}}>{t("PT_MUTATION_APPLICATION_DETAILS")}</Header>
      <div>
          <div>
          {dowloadOptions && dowloadOptions.length > 0 && <MultiLink
          onHeadClick={() => setShowOptions(!showOptions)}
          displayOptions={showOptions}
          options={dowloadOptions}
          className="multilinkWrapper"
          style={{top:"90px"}}
          />}
          </div>
        </div>
      </div>
        <Card>
           <StatusTable>
             <Row label={t("PT_APPLICATION_NUMBER_LABEL")} text={property?.acknowldgementNumber} textStyle={{ whiteSpace: "pre" }} />
             <Row label={t("PT_SEARCHPROPERTY_TABEL_PTUID")} text={property?.propertyId} textStyle={{ whiteSpace: "pre" }} />
             <Row label={t("PT_APPLICATION_CHANNEL_LABEL")} text={t(`ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${property?.channel}`)} />
             <Row label={t("PT_FEE_AMOUNT")} text={billAmount} textStyle={{ whiteSpace: "pre" }} />
             <Row label={t("PT_PAYMENT_STATUS")} text={billStatus} textStyle={{ whiteSpace: "pre" }} />
            
          </StatusTable>
                 <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
          <StatusTable>
              <Row label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={property?.address?.pincode || t("CS_NA")} />
              <Row label={t("PT_COMMON_CITY")} text={property?.address?.city || t("CS_NA")} />
              <Row label={t("PT_COMMON_LOCALITY_OR_MOHALLA")} text=/* {`${t(application?.address?.locality?.name)}` || t("CS_NA")} */{t(`${(property?.address?.locality?.area)}`) || t("CS_NA")} />
              <Row label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={property?.address?.street || t("CS_NA")} />
              <Row label={t("PT_DOOR_OR_HOUSE")} text={property?.address?.doorNo || t("CS_NA")} />
         
          </StatusTable>

              <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_MUTATION_TRANSFEROR_DETAILS")}</CardSubHeader>
              <div>
                {Array.isArray(transferorOwners) &&
                  transferorOwners.map((owner, index) => (
                    <div key={index}>
                      <CardSubHeader style={getCardSubHeadrStyles()}>
                        {transferorOwners.length != 1 && (
                          <span>
                            {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                          </span>
                        )}
                      </CardSubHeader>
                      <StatusTable>
                        <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={owner?.name || t("CS_NA")} />
                        <Row label={t("Guardian Name")} text={owner?.fatherOrHusbandName || t("CS_NA")} />   
                        <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                        <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={owner?.emailId || t("CS_NA")} />
                        <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={ owner?.ownerType.toLowerCase() || t("CS_NA")} />
                        <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                      </StatusTable>
                    </div>
                  ))}
              </div>

              <CardSubHeader style={getCardSubHeadrStyles()}>{t("PT_MUTATION_TRANSFEREE_DETAILS")}</CardSubHeader>
               {
                transferorInstitution.length ? (
                  <div>
                    {Array.isArray(transfereeOwners) &&
                      transfereeOwners.map((owner, index) => (
                        <div key={index}>
                          <CardSubHeader style={getCardSubHeadrStyles()}>
                            {transfereeOwners.length != 1 && (
                              <span>
                                {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                              </span>
                            )}
                          </CardSubHeader>
                          <StatusTable>
                            <Row label={t("PT_INSTITUTION_NAME")} text={transferorInstitution?.name || t("CS_NA")} />
                            <Row label={t("PT_TYPE_OF_INSTITUTION")} text={`${t(transferorInstitution?.type)}` || t("CS_NA")} />
                            <Row label={t("PT_NAME_AUTHORIZED_PERSON")} text={transferorInstitution?.nameOfAuthorizedPerson || t("CS_NA")} />
                            <Row label={t("PT_LANDLINE_NUMBER")} text={owner?.altContactNumber || t("CS_NA")} />
                            <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                            <Row label={t("PT_INSTITUTION_DESIGNATION")} text={transferorInstitution?.designation || t("CS_NA")} />
                            <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={owner?.emailId || t("CS_NA")} />
                            <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                          </StatusTable>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div>
                    {Array.isArray(transfereeOwners) &&
                      transfereeOwners.map((owner, index) => (
                        <div key={index}>
                          <CardSubHeader  style={getCardSubHeadrStyles()}>
                            {transfereeOwners.length != 1 && (
                              <span>
                                {t("PT_OWNER_SUB_HEADER")} - {index + 1}{" "}
                              </span>
                            )}
                          </CardSubHeader>
                          <StatusTable>
                            <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={owner?.name || t("CS_NA")} />
                            <Row label={t("PT_COMMON_GENDER_LABEL")} text={t(owner?.gender) || t("CS_NA")} />
                            <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={owner?.mobileNumber || t("CS_NA")} />
                            <Row label={t("PT_FORM3_GUARDIAN_NAME")} text={owner?.fatherOrHusbandName || t("CS_NA")} />
                            <Row label={t("PT_FORM3_RELATIONSHIP")} text={t(owner?.relationship) || t("CS_NA")} />
                            <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")}text={owner?.emailId || t("CS_NA")} />
                            <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={owner?.correspondenceAddress || t("CS_NA")} />
                            <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={(owner?.ownerType).toLowerCase() || t("CS_NA")} />
                            <Row
                              label={t("PT_FORM3_OWNERSHIP_TYPE")}
                              text={`${property?.ownershipCategoryTemp ? t(`PT_OWNERSHIP_${property?.ownershipCategoryTemp}`) : t("CS_NA")}`}
                            />
                          </StatusTable>
                        </div>
                    ))}
                  </div>
                       )
                   }
                   <CardSubHeader  style={getCardSubHeadrStyles()}>{t("PT_MUTATION_DETAILS")}</CardSubHeader>
                      <StatusTable>
                        <Row label={t("PT_MUTATION_PENDING_COURT")} text={property?.additionalDetails?.isMutationInCourt || t("CS_NA")} />
                        <Row label={t("PT_DETAILS_COURT_CASE")} text={property?.additionalDetails?.caseDetails || t("CS_NA")}  />
                        <Row label={t("PT_PROP_UNDER_GOV_AQUISITION")} text={property?.additionalDetails?.isPropertyUnderGovtPossession || t("CS_NA")}  />
                        <Row label={t("PT_DETAILS_GOV_AQUISITION")} text={t("CS_NA")}  />
                      </StatusTable>
                  
                   <CardSubHeader  style={getCardSubHeadrStyles()}>{t("PT_REGISTRATION_DETAILS")}</CardSubHeader>
                     <StatusTable>
                        <Row label={t("PT_REASON_PROP_TRANSFER")} text={`${t(property?.additionalDetails?.reasonForTransfer) }` || t("CS_NA")} />
                        <Row label={t("PT_PROP_MARKET_VALUE")} text={property?.additionalDetails?.marketValue || t("CS_NA")} />
                        <Row label={t("PT_REG_NUMBER")} text={property?.additionalDetails?.documentNumber || t("CS_NA")} />
                        <Row label={t("PT_DOC_ISSUE_DATE")} text={documentDate} />
                        <Row label={t("PT_REG_DOC_VALUE")} text={property?.additionalDetails?.documentValue || t("CS_NA")} />
                        <Row label={t("PT_REMARKS")} text={t("CS_NA")} />
                     </StatusTable>
          
          <CardSubHeader  style={getCardSubHeadrStyles()}>{t("PT_COMMON_DOCS")}</CardSubHeader>
          <div>
            {Array.isArray(docs) ? (
              docs.length > 0 && <PropertyDocument property={property}></PropertyDocument>
            ) : (
              <StatusTable>
                <Row text={t("PT_NO_DOCUMENTS_MSG")} />
              </StatusTable>
            )}
          </div>
          <PTWFApplicationTimeline application={application} id={acknowledgementIds} userType={'employee'} />
          {showModal ? (
            <ActionModal
              t={t}
              action={selectedAction}
              tenantId={tenantId}
              state={state}
              id={acknowledgementIds}
              applicationDetails={appDetailsToShow}
              applicationData={appDetailsToShow?.applicationData}
              closeModal={closeModal}
              submitAction={submitAction}
              actionData={workflowDetails?.data?.timeline}
              businessService={businessService}
              workflowDetails={workflowDetails}
              moduleCode="PT"
            />
          ) : null}
          <ApplicationDetailsActionBar
            workflowDetails={workflowDetails}
            displayMenu={displayMenu}
            onActionSelect={onActionSelect}
            setDisplayMenu={setDisplayMenu}
            businessService={businessService}
            forcedActionPrefix={"WF_EMPLOYEE_PT.CREATE"}
          />
        </Card>
    </React.Fragment>
  );
};

export default MutationApplicationDetails;