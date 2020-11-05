import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { createPropertyPayload } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyCreateUtils";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { hideSpinner } from "egov-ui-kit/redux/common/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getBusinessServiceNextAction } from "egov-ui-kit/utils/PTCommon/FormWizardUtils";
import { get, set, isEqual } from "lodash";
import store from "ui-redux/store";
import commonConfig from "config/common.js";
import cloneDeep from "lodash/cloneDeep";

const extractFromString = (str, index) => {
  if (!str) {
    return "";
  }

  let arrayOfValues = str.split(".");
  if (arrayOfValues && arrayOfValues.length == 0) {
    return arrayOfValues[0];
  }
  if (index > arrayOfValues.length) {
    return null;
  }
  if (index <= arrayOfValues.length) {
    return arrayOfValues[index];
  }
  return null;
};

const getUsageCategory = (usageCategory) => {
  let categoryArray = usageCategory.split(".");
  let tempObj = {};
  tempObj["usageCategoryMajor"] = categoryArray && categoryArray.length > 0 && categoryArray[0];
  tempObj["usageCategoryMinor"] = categoryArray && categoryArray.length > 1 && categoryArray[1];
  tempObj["usageCategorySubMinor"] = categoryArray && categoryArray.length > 2 && categoryArray[2];
  tempObj["usageCategoryDetail"] = categoryArray && categoryArray.length > 3 && categoryArray[3];
  return tempObj;
}

export const convertToOldPTObject = (newObject) => {
  let Properties = [
    {
      propertyId: "",
      tenantId: "",
      acknowldgementNumber: "",
      oldPropertyId: null,
      status: "",
      address: {},
      auditDetails: {},
      creationReason: null,
      occupancyDate: 0,
      propertyDetails: [
        {
          institution: null,
          tenantId: "",
          citizenInfo: {},
          source: null,
          status: "",
          usage: null,
          noOfFloors: 0,
          landArea: 0,
          buildUpArea: null,
          units: null,
          documents: null,
          additionalDetails: {
            inflammable: false,
            heightAbove36Feet: false,
          },
          financialYear: "",
          propertyType: "",
          propertySubType: null,
          assessmentNumber: "",
          assessmentDate: 0,
          usageCategoryMajor: "",
          usageCategoryMinor: "",
          ownershipCategory: "",
          subOwnershipCategory: "",
          adhocExemption: null,
          adhocPenalty: null,
          adhocExemptionReason: null,
          adhocPenaltyReason: null,
          owners: [
            {
              persisterRefId: null,
              id: null,
              uuid: "",
              userName: "",
              password: null,
              salutation: null,
              name: "",
              gender: "",
              mobileNumber: "",
              emailId: null,
              altContactNumber: null,
              pan: null,
              aadhaarNumber: null,
              permanentAddress: null,
              permanentCity: null,
              permanentPinCode: null,
              correspondenceCity: null,
              correspondencePinCode: null,
              correspondenceAddress: null,
              active: true,
              dob: null,
              pwdExpiryDate: 0,
              locale: null,
              type: "",
              signature: null,
              accountLocked: false,
              roles: [],
              fatherOrHusbandName: "",
              bloodGroup: null,
              identificationMark: null,
              photo: null,
              createdBy: "",
              createdDate: 0,
              lastModifiedBy: "",
              lastModifiedDate: 0,
              otpReference: null,
              tenantId: "",
              isPrimaryOwner: null,
              ownerShipPercentage: null,
              ownerType: "",
              institutionId: null,
              documents: [],
              relationship: "",
              additionalDetails: null,
            },
          ],
          auditDetails: {},
          calculation: null,
          channel: null,
        },
      ],
      additionalDetails: null,
    },
  ];
  let newProperty = newObject.Properties[0];
  let property = {};
  let propertyDetails = {};
  property.propertyId = newProperty.propertyId;
  property.tenantId = newProperty.tenantId;
  property.acknowldgementNumber = newProperty.acknowldgementNumber;
  property.oldPropertyId = newProperty.oldPropertyId;
  property.status = newProperty.status;
  property.address = newProperty.address;
  property.auditDetails = newProperty.auditDetails;
  property.creationReason = newProperty.creationReason;
  property.occupancyDate = newProperty.units && newProperty.units.length && newProperty.units[0].occupancyDate;
  property.additionalDetails = newProperty.additionalDetails;
  propertyDetails.institution = newProperty.institution;
  propertyDetails.tenantId = newProperty.tenantId;
  propertyDetails.citizenInfo = newProperty.owners[0];
  propertyDetails.source = newProperty.source;
  propertyDetails.status = newProperty.status;
  propertyDetails.usage = null;
  propertyDetails.noOfFloors = newProperty.noOfFloors;
  propertyDetails.landArea = newProperty.landArea;
  propertyDetails.buildUpArea = newProperty.superBuiltUpArea;
  propertyDetails.units = newProperty.units && newProperty.units.map(unit => {
    unit.floorNo = unit.floorNo || unit.floorNo === 0 ? unit.floorNo.toString() : unit.floorNo
    return { ...unit, ...getUsageCategory(unit.usageCategory) }
  });
  propertyDetails.documents = newProperty.documents;
  propertyDetails.additionalDetails = newProperty.additionalDetails;
  propertyDetails.financialYear = null;
  propertyDetails.propertyType = extractFromString(newProperty.propertyType, 0);
  propertyDetails.propertySubType = extractFromString(newProperty.propertyType, 1);
  propertyDetails.assessmentNumber = 0;
  propertyDetails.assessmentDate = null;
  propertyDetails.usageCategoryMajor = extractFromString(newProperty.usageCategory, 0);
  propertyDetails.usageCategoryMinor = extractFromString(newProperty.usageCategory, 1);
  propertyDetails.ownershipCategory = extractFromString(newProperty.ownershipCategory, 0);
  propertyDetails.subOwnershipCategory = extractFromString(newProperty.ownershipCategory, 1);
  propertyDetails.adhocExemption = null;
  propertyDetails.adhocPenalty = null;
  propertyDetails.adhocExemptionReason = null;
  propertyDetails.adhocPenaltyReason = null;
  propertyDetails.owners = newProperty.owners;
  propertyDetails.owners = propertyDetails.owners.filter((owner) => owner.status == 'ACTIVE')
  propertyDetails.auditDetails = newProperty.auditDetails;
  propertyDetails.calculation = null;
  propertyDetails.channel = newProperty.channel;
  propertyDetails.units = propertyDetails.units && propertyDetails.units.map(unit => {
    // unit.usageCategory;
    // propertyDetails.propertyType = extractFromString(newProperty.propertyType, 0);
    // propertyDetails.propertySubType = extractFromString(newProperty.propertyType, 1);
    // unit.usageCategoryMajor = extractFromString(unit.usageCategory, 0)
    // unit.usageCategoryMinor = extractFromString(unit.usageCategory, 1)
    // unit.usageCategorySubMinor = extractFromString(unit.usageCategory, 2)
    // unit.usageCategoryDetail = extractFromString(unit.usageCategory, 3)
    // unit.constructionDetail = {
    //   builtUpArea: unit.unitArea,
    // };
    unit.unitArea = unit.constructionDetail.builtUpArea;
    return { ...unit }
  })
  property["propertyDetails"] = [propertyDetails];
  Properties[0] = { ...newProperty, ...property };
  return Properties;
};

export const getPropertyLink = (propertyId, tenantId, purpose, financialYear, assessmentNumber, isCompletePayment) => {
  if (financialYear == -1) {
    return `/property-tax/assessment-form?assessmentId=${assessmentNumber}&purpose=${purpose}&propertyId=${
      propertyId}&tenantId=${tenantId}`;
  }
  if (isCompletePayment) {
    return `/property-tax/assessment-form?FY=${financialYear}&assessmentId=${assessmentNumber}&purpose=${purpose}&propertyId=${
      propertyId}&tenantId=${tenantId}&isCompletePayment=true`;
  }
  return `/property-tax/assessment-form?FY=${financialYear}&assessmentId=${assessmentNumber}&purpose=${purpose}&propertyId=${
    propertyId}&tenantId=${tenantId}`;
}

export const PROPERTY_FORM_PURPOSE = {
  REASSESS: 'reassess',
  ASSESS: 'assess',
  CREATE: 'create',
  UPDATE: 'update',
  DEFAULT: 'create'
}

export const formWizardConstants = {
  [PROPERTY_FORM_PURPOSE.ASSESS]: {
    header: 'PT_ASSESS_PROPERTY',
    parentButton: 'PT_ASSESS',
    isSubHeader: true,
    isFinancialYear: true,
    buttonLabel: 'PT_ASSESS_PROPERTY_BUTTON',
    isEditButton: false,
    canEditOwner: false,
    isEstimateDetails: true
  },
  [PROPERTY_FORM_PURPOSE.REASSESS]: {
    header: 'PT_REASSESS_PROPERTY',
    parentButton: 'PT_REASSESS',
    isSubHeader: true,
    isFinancialYear: true,
    buttonLabel: 'PT_REASSESS_PROPERTY_BUTTON',
    isEditButton: false,
    canEditOwner: false,
    isEstimateDetails: true
  },
  [PROPERTY_FORM_PURPOSE.UPDATE]: {
    header: 'PT_UPDATE_PROPERTY',
    parentButton: 'EDIT_PROPERTY',
    isSubHeader: true,
    isFinancialYear: false,
    buttonLabel: 'PT_UPDATE_PROPERTY_BUTTON',
    isEditButton: true,
    canEditOwner: false,
    isEstimateDetails: false
  },
  [PROPERTY_FORM_PURPOSE.CREATE]: {
    header: 'PT_CREATE_PROPERTY',
    parentButton: 'PT_CREATE',
    isSubHeader: false,
    isFinancialYear: false,
    buttonLabel: 'PT_CREATE_PROPERTY_BUTTON',
    isEditButton: true,
    canEditOwner: true,
    isEstimateDetails: false
  }
}

const getAssessmentDetails = async () => {
  try {
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const assessmentId = getQueryArg(
      window.location.href,
      "assessmentId"
    );

    let searchPropertyResponse = await httpRequest(
      `property-services/assessment/_search?assessmentNumbers=${assessmentId}&tenantId=${tenantId}`,
      "_search",
      [],
      {

      }, [], {}, true
    );
    return searchPropertyResponse;
  } catch (e) {
    console.log(e.message);
  }
}

const assessProperty = async (action, props) => {
  const purpose = getPurpose()
  let propertyMethodAction = purpose == PROPERTY_FORM_PURPOSE.REASSESS ? "_update" : '_create';
  const propertyId = getQueryArg(
    window.location.href,
    "propertyId"
  );
  const assessmentId = getQueryArg(
    window.location.href,
    "assessmentId"
  );
  const financialYear = getQueryArg(window.location.href, "FY");
  const tenant = getQueryArg(window.location.href, "tenantId");
  let assessment = {
    "tenantId": tenant,
    "propertyId": propertyId,
    "financialYear": financialYear,
    "assessmentDate": new Date().getTime() - 60000,
    "source": "MUNICIPAL_RECORDS",
    "channel": "CFC_COUNTER",
  }
  const adhocExemptionPenalty = get(props, 'adhocExemptionPenalty', {});


  assessment.additionalDetails = {}
  if (Object.keys(adhocExemptionPenalty).length > 1) {
    assessment.additionalDetails.adhocPenalty = Number(adhocExemptionPenalty.adhocPenalty);
    assessment.additionalDetails.adhocPenaltyReason = adhocExemptionPenalty.adhocPenaltyReason == 'Others' ? adhocExemptionPenalty.adhocOtherPenaltyReason : adhocExemptionPenalty.adhocPenaltyReason;
    assessment.additionalDetails.adhocExemption = Number(adhocExemptionPenalty.adhocExemption);
    assessment.additionalDetails.adhocExemptionReason = adhocExemptionPenalty.adhocExemptionReason == 'Others' ? adhocExemptionPenalty.adhocOtherExemptionReason : adhocExemptionPenalty.adhocExemptionReason;
  }



  if (purpose == PROPERTY_FORM_PURPOSE.REASSESS) {
    let assessments = await getAssessmentDetails();
    if (assessments.Assessments.length > 0) {
      let assessmentResponse = assessments.Assessments[0];
      assessment = assessmentResponse;
      assessment.assessmentDate = new Date().getTime() - 60000;
    }
  }
  try {
    let assessPropertyResponse = await httpRequest(
      `property-services/assessment/${propertyMethodAction}`,
      `${propertyMethodAction}`,
      [],
      {
        Assessment: assessment
      }
    );

    const assessmentNumber = get(assessPropertyResponse, "Assessments[0].assessmentNumber", '');

    routeToAcknowledgement(purpose, 'success', assessment.propertyId, assessment.tenantId, assessmentNumber, assessment.financialYear);


  } catch (e) {
    store.dispatch(
      hideSpinner());

    routeToAcknowledgement(purpose, 'failure', assessment.propertyId, assessment.tenantId, null, assessment.financialYear);

  }
}


const createProperty = async (Properties, action, props) => {
  const { documentsUploadRedux, newProperties, propertiesEdited } = props;
  let propertyPayload = createPropertyPayload(Properties, documentsUploadRedux, newProperties);
  

  const propertyMethodAction = action;
  let  ownershipCategory = get(propertyPayload, "ownershipCategory",'');
  
  let  usageCategory = get(propertyPayload, "usageCategory",'');

  let  isLegacy = get(propertyPayload, "source",'');





  if(ownershipCategory==="INDIVIDUAL.INDIVIDUAL.SINGLEOWNER")
  {
    set(propertyPayload, "ownershipCategory",'INDIVIDUAL.SINGLEOWNER');
  }

  if(ownershipCategory==="INDIVIDUAL.INDIVIDUAL.MULTIPLEOWNERS")
  {
    set(propertyPayload, "ownershipCategory",'INDIVIDUAL.MULTIPLEOWNERS');
  }

  if(usageCategory==="RESIDENTIAL.RESIDENTIAL")
  {
    set(propertyPayload, "usageCategory",'RESIDENTIAL');
    for(let i=0; propertyPayload.units && i<propertyPayload.units.length; i++)
    {
    propertyPayload.units[i].usageCategory = 'RESIDENTIAL';
    }

  }
  if(usageCategory==="NONRESIDENTIAL.NONRESIDENTIAL")
  {
    set(propertyPayload, "usageCategory",'NONRESIDENTIAL');
  }


  if(isLegacy !== "LEGACY_RECORD")
  {
  if (action === "_update") {
    const workflow = {
      "businessService": "PT.CREATE",
      "action": getBusinessServiceNextAction('PT.CREATE', null) || "OPEN",
      "moduleName": "PT"
    }
    if (propertyPayload.workflow) {
      propertyPayload.workflow = { ...propertyPayload.workflow, ...workflow }
    } else {
      propertyPayload.workflow = workflow
    }
  }
}
  try {
    propertyPayload.creationReason = action == '_create' ? 'CREATE' : 'UPDATE';
    const propertyResponse = await httpRequest(
      `property-services/property/${propertyMethodAction}`,
      `${propertyMethodAction}`,
      [],
      {
        Property: propertyPayload
      },
      [],
      {},
      true
    );
    if (propertyResponse && propertyResponse.Properties && propertyResponse.Properties.length) {
      if (propertyResponse.Properties[0].propertyId) {
        const propertyId = get(propertyResponse, "Properties[0].propertyId", '');
        const tenantId = get(propertyResponse, "Properties[0].tenantId", '');
        const acknowldgementNumber = get(propertyResponse, "Properties[0].acknowldgementNumber", '');
        // Navigate to success page
        if (action == '_create') {
          routeToAcknowledgement(PROPERTY_FORM_PURPOSE.CREATE, 'success', propertyId, tenantId, acknowldgementNumber);
        } else {
          routeToAcknowledgement(PROPERTY_FORM_PURPOSE.UPDATE, 'success', propertyId, tenantId, acknowldgementNumber);
        }

      }
    }
  } catch (e) {
    store.dispatch(hideSpinner());
    if (action == '_create') {
      routeToAcknowledgement(PROPERTY_FORM_PURPOSE.CREATE, 'failure');
    } else {
      routeToAcknowledgement(PROPERTY_FORM_PURPOSE.UPDATE, 'failure');
    }

  }
}


const routeToAcknowledgement = (purpose, status, propertyId, tenantId, secondNumber, FY) => {

  let routeLink = `/property-tax/pt-acknowledgment?purpose=${purpose}&status=${status}`;
  routeLink = propertyId ? `${routeLink}&propertyId=${propertyId}` : `${routeLink}`;
  routeLink = tenantId ? `${routeLink}&tenantId=${tenantId}` : `${routeLink}`;
  routeLink = secondNumber ? `${routeLink}&secondNumber=${secondNumber}` : `${routeLink}`;
  routeLink = FY ? `${routeLink}&FY=${FY}` : `${routeLink}`;

  store.dispatch(
    setRoute(
      routeLink
    )
  );
}


export const routeToCommonPay = (propertyId, tenantId,businessService='PT') => {

  let routeLink = `/egov-common/pay?consumerCode=${propertyId}&tenantId=${tenantId}&businessService=${businessService}`;
  store.dispatch(
    setRoute(
      routeLink
    )
  );
}






export const propertySubmitAction = (Properties, action, props) => {


  const purpose = getPurpose()

  switch (purpose) {
    case PROPERTY_FORM_PURPOSE.REASSESS:
      assessProperty("_update", props);
      break;
    case PROPERTY_FORM_PURPOSE.ASSESS:
      assessProperty("_create", props);
      break;
    case PROPERTY_FORM_PURPOSE.UPDATE:
      createProperty(Properties, '_update', props);
      break;
    case PROPERTY_FORM_PURPOSE.CREATE:
      createProperty(Properties, '_create', props);
      break;
    default:
      createProperty(Properties, '_create', props);
  }

};


export const getPurpose = () => {
  const purpose = getQueryArg(window.location.href, "purpose") || PROPERTY_FORM_PURPOSE.DEFAULT;
  return purpose;
}


export const getPropertyInfoScreenUrl = (propertyId, tenantId) => {
  const url = process.env.REACT_APP_NAME === "Citizen" ?
    `/property-tax/my-properties/property/${propertyId}/${tenantId}` : `/property-tax/property/${propertyId}/${tenantId}`;
  return url;
}

export const getCommonTenant = () => {
  return commonConfig.tenantId;
}



