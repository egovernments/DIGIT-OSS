import {
  getStepperObject,
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getCommonParagraph,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";

import get from "lodash/get";
import set from "lodash/set";

import {
  commonTransform,
  objectToDropdown,
  getCurrentFinancialYear,
  getLicenseeTypeDropdownData,
  addressDestruct
} from "../utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { footer } from "./applyResource/footer";
import { tradeReviewDetails } from "./applyResource/tradeReviewDetails";
import { organizationDetails } from "./applyResource/organizationDetails";
import {
  permanentAddr,
  corrospondanceAddr
} from "./applyResource/tradeLocationDetails";
import { OwnerInfoCard } from "./applyResource/tradeOwnerDetails";
import { LicenseeCard } from "./applyResource/licenseeDetails";
import { documentList } from "./applyResource/documentList";
import { httpRequest } from "../../../../ui-utils";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";

export const stepsData = [
  {
    labelName: "Licensee Details",
    labelKey: "BPA_LICENSEE_DETAILS_HEADER_OWNER_INFO"
  },
  { labelName: "Applicant Details", labelKey: "BPA_COMMON_AP_DETAILS" },
  { labelName: "Document Upload", labelKey: "BPA_COMMON_DOCS" },
  { labelName: "Summary", labelKey: "BPA_COMMON_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const getOrganizationReqd = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-bpa",

  componentPath: "RadioGroupWithLabelContainer",
  gridDefination: {
    xs: 12,
    sm: 12,
    md: 6
  },
  jsonPath: "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",

  props: {
    ValueToHide: "INDIVIDUAL",
    componentPathToHide: [
      "components.div.children.formwizardSecondStep.children.organizationDetails",
      "components.div.children.formwizardForthStep.children.tradeReviewDetails.children.cardContent.children.reviewOrganizationDetails"
    ],
    label: {
      name: "On behalf of any organization?",
      key: "BPA_ORGANIZATION_REQD_LABEL"
    },
    buttons: [
      {
        labelName: "Yes",
        labelKey: "BPA_ORG_YES_LABEL",
        value: "INSTITUTIONAL"
      },
      {
        label: "No",
        labelKey: "BPA_ORG_NO_LABEL",
        value: "INDIVIDUAL"
      }
    ],
    jsonPath: "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
    required: true
  },
  required: true,
  type: "array"
};

export const header = getCommonContainer({
  header:
    getQueryArg(window.location.href, "action") !== "edit"
      ? getCommonHeader({
          labelName: `Register Technical Person/Builder`,
          dynamicArray: [getCurrentFinancialYear()],
          labelKey:
            process.env.REACT_APP_NAME === "Citizen"
              ? "BPA_COMMON_APPL_NEW_LICENSE"
              : "BPA_COMMON_APPL_NEW_LICENSE"
        })
      : {},
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const tradeDocumentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "BPA_DOCUMENT_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  paragraph: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "BPA_DOCUMENT_DETAILS_SUBTEXT"
  }),
  documentList
});

export const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "TradeLicense",
          masterDetails: [
            { name: "TradeType", filter: `[?(@.type == "BPA")]` },
            { name: "AccessoriesCategory" },
            { name: "ApplicationType" }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "OwnerType" },
            { name: "OwnerShipCategory" },
            { name: "DocumentType" },
            { name: "UOM" }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear" }]
        },
        {
          moduleName: "StakeholderRegistraition",
          masterDetails: [
            { name: "TradeTypetoRoleMapping" }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    set(
      payload,
      "MdmsRes.TradeLicense.MdmsTradeType",
      get(payload, "MdmsRes.TradeLicense.TradeType", [])
    );
    const tradeTypes = get(payload, "MdmsRes.TradeLicense.TradeType", []);

    const tradeTypeDdData = getLicenseeTypeDropdownData(tradeTypes);
    tradeTypeDdData &&
      set(
        payload,
        "MdmsRes.TradeLicense.TradeTypeTransformed",
        tradeTypeDdData
      );

    // payload = commonTransform(payload, "MdmsRes.TradeLicense.TradeType");
    payload = commonTransform(
      payload,
      "MdmsRes.common-masters.OwnerShipCategory"
    );
    set(
      payload,
      "MdmsRes.common-masters.OwnerShipCategoryTransformed",
      objectToDropdown(
        get(payload, "MdmsRes.common-masters.OwnerShipCategory", [])
      )
    );
    const localities = get(
      state.screenConfiguration,
      "preparedFinalObject.applyScreenMdmsData.tenant.localities",
      []
    );
    if (localities && localities.length > 0) {
      payload.MdmsRes.tenant.localities = localities;
    }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    let financialYearData = get(
      payload,
      "MdmsRes.egf-master.FinancialYear",
      []
    ).filter(item => item.module === "TL" && item.active === true);
    set(payload, "MdmsRes.egf-master.FinancialYear", financialYearData);
  } catch (e) {
  }
};

// export const getData = async (action, state, dispatch) => {
//   const queryValue = getQueryArg(window.location.href, "applicationNumber");
//   const applicationNo = queryValue;

//   await getMdmsData(action, state, dispatch);
//   // await getAllDataFromBillingSlab(getTenantId(), dispatch);

//   if (applicationNo) {
//     //Edit/Update Flow ----
//     const applicationType = get(
//       state.screenConfiguration.preparedFinalObject,
//       "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
//       null
//     );
//     getQueryArg(window.location.href, "action") !== "edit" &&
//       dispatch(
//         prepareFinalObject("Licenses", [
//           {
//             licenseType: "PERMANENT",
//             oldLicenseNumber: queryValue ? "" : applicationNo,
//             tradeLicenseDetail: {
//               additionalDetail: {
//                 applicationType: applicationType ? applicationType : "NEW"
//               }
//             }
//           }
//         ])
//       );
//     // dispatch(prepareFinalObject("LicensesTemp", []));

//     await updatePFOforSearchResults(action, state, dispatch, applicationNo);
//     addressDestruct(action, state, dispatch);
//     if (!queryValue) {
//       const oldApplicationNo = get(
//         state.screenConfiguration.preparedFinalObject,
//         "Licenses[0].applicationNumber",
//         null
//       );
//       dispatch(
//         prepareFinalObject("Licenses[0].oldLicenseNumber", oldApplicationNo)
//       );
//       if (oldApplicationNo !== null) {
//         dispatch(prepareFinalObject("Licenses[0].financialYear", ""));
//         dispatch(
//           prepareFinalObject(
//             "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
//             "APPLICATIONTYPE.RENEWAL"
//           )
//         );
//         dispatch(
//           handleField(
//             "apply",
//             "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.financialYear",
//             "props.value",
//             ""
//           )
//         );
//         dispatch(
//           handleField(
//             "apply",
//             "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.applicationType",
//             "props.value",
//             "APPLICATIONTYPE.RENEWAL"
//           )
//         );
//       }

//       dispatch(prepareFinalObject("Licenses[0].applicationNumber", ""));
//       dispatch(
//         handleField(
//           "apply",
//           "components.div.children.headerDiv.children.header.children.applicationNumber",
//           "visible",
//           false
//         )
//       );
//     }
//   }
// };

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    LicenseeCard
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    OwnerInfoCard,
    breakAfterSearch: getBreak(),
    // getOrganizationReqd,
    // organizationDetails,
    permanentAddr,
    corrospondanceAddr
  },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    tradeDocumentDetails
  },
  visible: false
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    tradeReviewDetails
  },
  visible: false
};
