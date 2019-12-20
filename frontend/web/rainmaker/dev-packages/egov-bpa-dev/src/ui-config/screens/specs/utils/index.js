import {
  getLabel,
  getTextField,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import filter from "lodash/filter";
import { httpRequest, edcrHttpRequest } from "../../../../ui-utils/api";
import {
  prepareFinalObject,
  initScreen
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import {
  getTenantId,
  getUserInfo,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import {
  getQueryArg,
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  getCommonCard,
  getCommonValue,
  getCommonCaption,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { sampleGetBill } from "../../../../ui-utils/sampleResponses";
import { mdmsMockJson } from '../egov-bpa/mdmsMock';
import { scrutinyDetailsMockJson, scrutinyDetailsMockJson1 } from './scrutinyDetailsMockJson';
import { cityModuleMockJson } from '../egov-bpa/cityResJson';


export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const getAsteric = () => {
  return {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "Asteric"
  };
};

export const getTooltip = (children, toolTipProps) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    children: {
      label: children,
      toolTip: {
        componentPath: "Tooltip",
        props: { ...toolTipProps },
        children: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "info"
          }
        }
      }
    }
  };
};

export const getCheckbox = (content, jsonPath, props = {}) => {
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-tradelicence",
    componentPath: "CheckboxContainer",
    props: {
      content,
      jsonPath,
      ...props
    }
  };
};

export const getUploadFile = {
  uiFramework: "custom-molecules",
  componentPath: "DocumentList",
  props: {
    documents: [
      {
        name: "Upload Document"
      }
    ]
  }
};

export const getUploadFilesMultiple = jsonPath => {
  return {
    uiFramework: "custom-molecules",
    componentPath: "UploadMultipleFiles",
    props: {
      maxFiles: 4,
      jsonPath: jsonPath,
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      buttonLabel: "UPLOAD FILES",
      maxFileSize: 5000,
      moduleName: "TL"
    }
  };
};

export const getRadioButton = (buttons, jsonPath, defaultValue) => {
  return {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    props: {
      buttons,
      jsonPath,
      defaultValue
    }
  };
};
/*
export const getRadioGroupWithLabel = (
  label,
  labelKey,
  buttons,
  jsonPath,
  defaultValue
) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      alignItems: "center"
    },

    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        children: {
          div: getLabel({
            labelName: label,
            labelKey,

            style: {
              fontSize: "14px"
            }
          }),
          asteric: getAsteric()
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 8
        },
        children: {
          div: getRadioButtonGroup(buttons, jsonPath, defaultValue)
        }
      }
    }
  };
};
*/
export const getApplicationNoContainer = number => {
  return {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "ApplicationNoContainer",
    props: {
      number
    }
  };
};

export const getContainerWithElement = ({
  children,
  props = {},
  gridDefination = {}
}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    children,
    gridDefination,
    props: {
      ...props
    }
  };
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item
      };

      return result;
    }, {})
  );
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const getApprovalTextField = queryValue => {
  if (queryValue === "reject") {
    return getTextField({
      label: {
        labelName: "Comments",
        labelKey: "TL_APPROVAL_CHECKLIST_COMMENTS_LABEL"
      },
      placeholder: {
        labelName: "Enter Rejection Comments",
        labelKey: "TL_REJECTION_CHECKLIST_COMMENTS_PLACEHOLDER"
      },
      required: false,
      pattern: "",
      jsonPath:
        "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.comments",
      props: {
        style: {
          paddingBottom: 5
        }
      }
    });
  } else if (queryValue === "cancel") {
    return getTextField({
      label: {
        labelName: "Comments",
        labelKey: "TL_APPROVAL_CHECKLIST_COMMENTS_LABEL"
      },
      placeholder: {
        labelName: "Enter Cancellation Comments",
        labelKey: "TL_CANCEL_CHECKLIST_COMMENTS_PLACEHOLDER"
      },
      required: false,
      pattern: "",
      jsonPath:
        "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.comments",
      props: {
        style: {
          paddingBottom: 5
        }
      }
    });
  } else {
    return getTextField({
      label: {
        labelName: "Comments",
        labelKey: "TL_APPROVAL_CHECKLIST_COMMENTS_LABEL"
      },
      placeholder: {
        labelName: "Enter Approval Comments",
        labelKey: "TL_APPROVAL_CHECKLIST_COMMENTS_PLACEHOLDER_APPR"
      },
      required: false,
      pattern: "",
      jsonPath:
        "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.comments",
      props: {
        style: {
          paddingBottom: 5
        }
      }
    });
  }
};

export const getCheckBoxJsonpath = queryValue => {
  if (queryValue === "reject") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.check";
  } else if (queryValue === "cancel") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.check";
  } else {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.check";
  }
};

export const getSafetyNormsJson = queryValue => {
  if (queryValue === "reject") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.checklist.safetyNorms";
  } else if (queryValue === "cancel") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.checklist.safetyNorms";
  } else {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.checklist.safetyNorms";
  }
};

export const getHygeneLevelJson = queryValue => {
  if (queryValue === "reject") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.checklist.hygieneLevels";
  } else if (queryValue === "cancel") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.checklist.hygieneLevels";
  } else {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.checklist.hygieneLevels";
  }
};

export const getLocalityHarmedJson = queryValue => {
  if (queryValue === "reject") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.checklist.localityHarmed";
  } else if (queryValue === "cancel") {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.checklist.localityHarmed";
  } else {
    return "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.checklist.localityHarmed";
  }
};

export const getSubHeaderLabel = queryValue => {
  if (queryValue === "reject") {
    return getCommonSubHeader({
      labelName: "Rejection CheckList",
      labelKey: "TL_REJECTION_CHECKLIST_REJ_CHECKLIST"
    });
  } else if (queryValue === "cancel") {
    return {};
  } else {
    return getCommonSubHeader({
      labelName: "Approve Checklist",
      labelKey: "TL_APPROVAL_CHECKLIST_BUTTON_APPRV_CHECKLIST"
    });
  }
};

export const getFooterButtons = queryValue => {
  if (queryValue === "reject") {
    return getLabel({
      labelName: "REJECT APPLICATION",
      labelKey: "TL_REJECTION_CHECKLIST_BUTTON_REJ_APPL"
    });
  } else if (queryValue === "cancel") {
    return getLabel({
      labelName: "CANCEL TRADE LICENSE",
      labelKey: "TL_COMMON_BUTTON_CANCEL_LICENSE"
    });
  } else {
    return getLabel({
      labelName: "APPROVE APPLICATION",
      labelKey: "TL_APPROVAL_CHECKLIST_BUTTON_APPRV_APPL"
    });
  }
};

export const onClickNextButton = (
  applicationNumber,
  secondNumber,
  queryValue,
  tenantId
) => {
  switch (queryValue) {
    case "reject":
      return `/tradelicence/acknowledgement?purpose=application&status=rejected&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
    case "cancel":
      return `/tradelicence/acknowledgement?purpose=application&status=cancelled&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
    default:
      return `/tradelicence/acknowledgement?purpose=approve&status=success&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
  }
};

export const onClickPreviousButton = (
  queryValue,
  applicationNumber,
  tenantId
) => {
  switch (queryValue) {
    case "reject":
      return `/tradelicence/search-preview?role=approver&status=pending_approval&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    case "cancel":
      return `/tradelicence/search-preview?role=approver&status=approved&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    default:
      return `/tradelicence/search-preview?role=approver&status=pending_approval&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  }
};
export const getFeesEstimateCard = props => {
  const { sourceJsonPath, ...rest } = props;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-tradelicence",
    componentPath: "EstimateCardContainer",
    props: {
      sourceJsonPath,
      ...rest
    }
  };
};

const style = {
  textfieldIcon: {
    position: "relative",
    top: "25px",
    left: "-249%"
  },
  headerIcon: {
    position: "relative",
    bottom: "2px"
  }
};

export const getIconStyle = key => {
  return style[key];
};

// export const showHideAdhocPopup = (state, dispatch) => {
//   let toggle = get(
//     state.screenConfiguration.screenConfig["pay"],
//     "components.adhocDialog.props.open",
//     false
//   );
//   dispatch(handleField("pay", "components.adhocDialog", "props.open", !toggle));
// };

export const getButtonVisibility = (status, button) => {
  if (status === "APPLIED" && button === "PROCEED TO PAYMENT") return true;
  if (status === "pending_approval" && button === "APPROVE") return true;
  if (status === "pending_approval" && button === "REJECT") return true;
  if (status === "approved" && button === "CANCEL TRADE LICENSE") return true;
  return false;
};

export const commonTransform = (object, path) => {
  let data = get(object, path);
  let transformedData = {};
  data.map(a => {
    const splitList = a.code.split(".");
    let ipath = "";
    for (let i = 0; i < splitList.length; i += 1) {
      if (i != splitList.length - 1) {
        if (
          !(
            splitList[i] in
            (ipath === "" ? transformedData : get(transformedData, ipath))
          )
        ) {
          set(
            transformedData,
            ipath === "" ? splitList[i] : ipath + "." + splitList[i],
            i < splitList.length - 2 ? {} : []
          );
        }
      } else {
        get(transformedData, ipath).push(a);
      }
      ipath = splitList.slice(0, i + 1).join(".");
    }
  });
  set(object, path, transformedData);
  return object;
};

export const objectToDropdown = object => {
  let dropDown = [];
  for (var variable in object) {
    if (object.hasOwnProperty(variable)) {
      dropDown.push({ code: variable });
    }
  }
  return dropDown;
};

// Search API call
export const getSearchResults = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/bpa-services/v1/BPAREG/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/tl-calculator/v1/BPAREG/_getbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getReceipt = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/collection-services/payments/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const convertEpochToDate = dateEpoch => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    // const parts = dateTimeString.match(
    //   /(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    // );
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};

export const getReceiptData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "collection-services/payments/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getAutoSelector = textScheama => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-tradelicence",
    componentPath: "AutoSelector",
    gridDefination: {
      xs: 6,
      sm: 3
    },
    props: {
      data: []
    }
  };
};

export const getMapLocator = textSchema => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-tradelicence",
    componentPath: "MapLocator",
    props: {}
  };
};

export const showHideMapPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.mapsDialog.props.open",
    false
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.mapsDialog",
      "props.open",
      !toggle
    )
  );
};

export const getHeaderSideText = (status, licenseNo = null) => {
  switch (status) {
    case "PENDINGDOCVERIFICATION":
      return {
        word1: "Status: ",
        word2: "WF_ARCHITECT_PENDINGDOCVERIFICATION"
      };

    case "PAID":
    case "PENDINGAPPROVAL":
      return { word1: "Status: ", word2: "WF_ARCHITECT_PENDINGAPPROVAL" };
    case "PENDINGPAYMENT":
      return { word1: "Status: ", word2: "WF_ARCHITECT_PENDINGPAYMENT" };
    case "FIELDINSPECTION":
      return { word1: "Status: ", word2: "WF_ARCHITECT_FIELDINSPECTION" };
    case "APPLIED":
      return { word1: "Status: ", word2: "TL_APPLIED" };
    case "REJECTED":
      return { word1: "Status: ", word2: "TL_REJECTED" };
    case "CANCELLED":
      return { word1: `License No: `, word2: `${licenseNo}` };
    case "APPROVED":
      return { word1: `License No: `, word2: `${licenseNo}` };
    default:
      return { word1: "", word2: "" };
  }
};

export const getMdmsData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "egov-mdms-service/v1/_get",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getDetailsFromProperty = async (state, dispatch) => {
  try {
    const propertyId = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].propertyId",
      ""
    );
    const cityId = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.address.tenantId",
      ""
    );
    const tenantId = ifUserRoleExists("CITIZEN") ? cityId : getTenantId();
    if (!tenantId) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please select city to search by property id !!",
            labelKey: "ERR_SELECT_CITY_TO_SEARCH_PROPERTY_ID"
          },
          "warning"
        )
      );
      return;
    }
    if (propertyId) {
      let payload = await httpRequest(
        "post",
        `/pt-services-v2/property/_search?tenantId=${tenantId}&ids=${propertyId}`,
        "_search",
        [],
        {}
      );
      if (
        payload &&
        payload.Properties &&
        payload.Properties.hasOwnProperty("length")
      ) {
        if (payload.Properties.length === 0) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Property is not found with this Property Id",
                labelKey: "ERR_PROPERTY_NOT_FOUND_WITH_PROPERTY_ID"
              },
              "info"
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocPropertyID",
              "props.value",
              ""
            )
          );
        } else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
              "props.value",
              {
                value: payload.Properties[0].address.locality.code,
                label: payload.Properties[0].address.locality.name
              }
            )
          );
          dispatch(
            prepareFinalObject(
              "Licenses[0].tradeLicenseDetail.address",
              payload.Properties[0].address
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.children.cityDropdown",
              "props.value",
              payload.Properties[0].address.tenantId
            )
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const getDetailsForOwner = async (state, dispatch, fieldInfo) => {
  try {
    const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
    const ownerNo = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].tradeLicenseDetail.owners[${cardIndex}].mobileNumber`,
      ""
    );
    const owners = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].tradeLicenseDetail.owners`,
      []
    );
    //owners from search call before modification.
    const oldOwnersArr = get(
      state.screenConfiguration.preparedFinalObject,
      "LicensesTemp[0].tradeLicenseDetail.owners",
      []
    );
    //Same no search on Same index
    if (ownerNo === owners[cardIndex].userName) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Owner already added !",
            labelKey: "ERR_OWNER_ALREADY_ADDED"
          },
          "error"
        )
      );
      return;
    }

    //Same no search in whole array
    const matchingOwnerIndex = owners.findIndex(
      item => item.userName === ownerNo
    );
    if (matchingOwnerIndex > -1) {
      if (
        !isUndefined(owners[matchingOwnerIndex].userActive) &&
        owners[matchingOwnerIndex].userActive === false
      ) {
        //rearrange
        dispatch(
          prepareFinalObject(
            `Licenses[0].tradeLicenseDetail.owners[${matchingOwnerIndex}].userActive`,
            true
          )
        );
        dispatch(
          prepareFinalObject(
            `Licenses[0].tradeLicenseDetail.owners[${cardIndex}].userActive`,
            false
          )
        );
        //Delete if current card was not part of oldOwners array - no need to save.
        if (
          oldOwnersArr.findIndex(
            item => owners[cardIndex].userName === item.userName
          ) == -1
        ) {
          owners.splice(cardIndex, 1);
          dispatch(
            prepareFinalObject(`Licenses[0].tradeLicenseDetail.owners`, owners)
          );
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Owner already added !",
              labelKey: "ERR_OWNER_ALREADY_ADDED_1"
            },
            "error"
          )
        );
      }
      return;
    } else {
      //New number search only
      let payload = await httpRequest(
        "post",
        `/user/_search?tenantId=${commonConfig.tenantId}`,
        "_search",
        [],
        {
          tenantId: commonConfig.tenantId,
          userName: `${ownerNo}`
        }
      );
      if (payload && payload.user && payload.user.hasOwnProperty("length")) {
        if (payload.user.length === 0) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "This mobile number is not registered !",
                labelKey: "ERR_MOBILE_NUMBER_NOT_REGISTERED"
              },
              "info"
            )
          );
        } else {
          const userInfo =
            payload.user &&
            payload.user[0] &&
            JSON.parse(JSON.stringify(payload.user[0]));
          if (userInfo && userInfo.createdDate) {
            userInfo.createdDate = convertDateTimeToEpoch(userInfo.createdDate);
            userInfo.lastModifiedDate = convertDateTimeToEpoch(
              userInfo.lastModifiedDate
            );
            userInfo.pwdExpiryDate = convertDateTimeToEpoch(
              userInfo.pwdExpiryDate
            );
          }
          let currOwnersArr = get(
            state.screenConfiguration.preparedFinalObject,
            "Licenses[0].tradeLicenseDetail.owners",
            []
          );

          currOwnersArr[cardIndex] = userInfo;
          if (oldOwnersArr.length > 0) {
            currOwnersArr.push({
              ...oldOwnersArr[cardIndex],
              userActive: false
            });
          }
          dispatch(
            prepareFinalObject(
              `Licenses[0].tradeLicenseDetail.owners`,
              currOwnersArr
            )
          );
        }
      }
    }
  } catch (e) {
    dispatch(toggleSnackbar(true, e.message, "info"));
  }
};

// Get user data from uuid API call
export const getUserDataFromUuid = async bodyObject => {
  try {
    const response = await httpRequest(
      "post",
      "/user/_search",
      "",
      [],
      bodyObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const getStatementForDocType = docType => {
  switch (docType) {
    case "OWNERIDPROOF":
      return "BPA_UPLOAD_STATEMENT1";
    case "OWNERSHIPPROOF":
      return "BPA_UPLOAD_STATEMENT2";
    case "EXPERIENCEPROOF":
      return "BPA_UPLOAD_STATEMENT3";
    default:
      return "";
  }
};

export const prepareDocumentTypeObj = documents => {
  let documentsArr =
    documents.length > 0
      ? documents.reduce((documentsArr, item, ind) => {
        documentsArr.push({
          name: item,
          required: true,
          jsonPath: `Licenses[0].tradeLicenseDetail.applicationDocuments[${ind}]`,
          statement: getStatementForDocType(item)
        });
        return documentsArr;
      }, [])
      : [];
  return documentsArr;
};

//Common functions for Estimate card

const getTaxValue = item => {
  return item
    ? item.amount
      ? item.amount
      : item.debitAmount
        ? -Math.abs(item.debitAmount)
        : item.crAmountToBePaid
          ? item.crAmountToBePaid
          : 0
    : 0;
};

const getToolTipInfo = (taxHead, LicenseData) => {
  switch (taxHead) {
    case "TL_ADHOC_PENALTY":
      return get(LicenseData, "tradeLicenseDetail.adhocPenaltyReason");
    case "TL_ADHOC_REBATE":
      return get(LicenseData, "tradeLicenseDetail.adhocExemptionReason");
    default:
      return "";
  }
};

const getEstimateData = (Bill, getFromReceipt, LicenseData) => {
  if (Bill) {
    const { billAccountDetails } = Bill.billDetails[0];
    const transformedData = billAccountDetails.reduce((result, item) => {
      if (getFromReceipt) {
        item.taxHeadCode &&
          result.push({
            name: {
              labelName: item.taxHeadCode.split("-")[0],
              labelKey: item.taxHeadCode.split("-")[0]
            },
            value: Bill.billDetails[0].amount,
            info: getToolTipInfo(
              item.taxHeadCode.split("-")[0],
              LicenseData
            ) && {
                value: getToolTipInfo(
                  item.taxHeadCode.split("-")[0],
                  LicenseData
                ),
                key: getToolTipInfo(item.taxHeadCode.split("-")[0], LicenseData)
              }
          });
      } else {
        item.taxHeadCode &&
          result.push({
            name: {
              labelName: item.taxHeadCode,
              labelKey: item.taxHeadCode
            },
            value: getTaxValue(item),
            info: getToolTipInfo(item.taxHeadCode, LicenseData) && {
              value: getToolTipInfo(item.taxHeadCode, LicenseData),
              key: getToolTipInfo(item.taxHeadCode, LicenseData)
            }
          });
      }
      return result;
    }, []);
    return [
      ...transformedData.filter(item => item.name.labelKey === "TL_TAX"),
      ...transformedData.filter(item => item.name.labelKey !== "TL_TAX")
    ];
  }
};

const getBillingSlabData = async (
  dispatch,
  billingSlabIds,
  tenantId,
  accessories
) => {
  const { accesssoryBillingSlabIds, tradeTypeBillingSlabIds } =
    billingSlabIds || {};
  if (accesssoryBillingSlabIds || tradeTypeBillingSlabIds) {
    const accessoryUnit =
      accesssoryBillingSlabIds &&
      accesssoryBillingSlabIds.reduce((result, item) => {
        result.push(item.split("|")[0]);
        return result;
      }, []);

    const tradeUnit =
      tradeTypeBillingSlabIds &&
      tradeTypeBillingSlabIds.reduce((result, item) => {
        result.push(item.split("|")[0]);
        return result;
      }, []);

    let billingData = tradeUnit && [...tradeUnit];
    accessoryUnit && (billingData = [...billingData, ...accessoryUnit]);
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "ids", value: billingData && billingData.join(",") }
    ];
    try {
      const response = await httpRequest(
        "post",
        "/tl-calculator/billingslab/_search",
        "",
        queryObject
      );

      let tradeTotal = 0;
      let accessoriesTotal = 0;
      const finalData =
        response &&
        response.billingSlab.reduce(
          (result, item) => {
            if (item.tradeType) {
              tradeTotal = tradeTotal + item.rate;
              result.tradeUnitData.push({
                rate: item.rate,
                category: item.tradeType,
                type: "trade"
              });
            } else {
              const count = accessories.find(
                accessory =>
                  item.accessoryCategory === accessory.accessoryCategory
              ).count;
              accessoriesTotal = accessoriesTotal + item.rate * count;
              result.accessoryData.push({
                rate: item.rate,
                total: item.rate * count,
                category: item.accessoryCategory,
                type: "accessories"
              });
            }
            return result;
          },
          { tradeUnitData: [], accessoryData: [] }
        );
      const { accessoryData, tradeUnitData } = finalData;
      dispatch(
        prepareFinalObject(
          "LicensesTemp[0].billingSlabData.tradeUnitData",
          tradeUnitData
        )
      );
      dispatch(
        prepareFinalObject(
          "LicensesTemp[0].billingSlabData.tradeTotal",
          tradeTotal
        )
      );
      dispatch(
        prepareFinalObject(
          "LicensesTemp[0].billingSlabData.accessoriesUnitData",
          accessoryData
        )
      );
      dispatch(
        prepareFinalObject(
          "LicensesTemp[0].billingSlabData.accessoriesTotal",
          accessoriesTotal
        )
      );
    } catch (e) {
      // dispatch(
      //   toggleSnackbar(
      //     open,
      //     {
      //       lableName: "Billing Slab error!",
      //       labelKey: "ERR_BILLING_SLAB_ERROR"
      //     },
      //     "error"
      //   )
      // );
    }
  }
};

const isApplicationPaid = currentStatus => {
  let isPAID = false;

  if (!isEmpty(JSON.parse(localStorageGet("businessServiceData")))) {
    const buisnessSeviceStates = JSON.parse(
      localStorageGet("businessServiceData")
    )[0].states;
    for (var i = 0; i < buisnessSeviceStates.length; i++) {
      if (buisnessSeviceStates[i].state === currentStatus) {
        break;
      }
      if (
        buisnessSeviceStates[i].actions &&
        buisnessSeviceStates[i].actions.filter(item => item.action === "PAY")
          .length > 0
      ) {
        isPAID = true;
        break;
      }
    }
  } else {
    isPAID = false;
  }

  return isPAID;
};

export const createEstimateData = async (
  LicenseData,
  jsonPath,
  dispatch,
  href = {},
  isgetBill = false
) => {
  const applicationNo =
    get(LicenseData, "applicationNumber") ||
    getQueryArg(href, "applicationNumber");
  const tenantId =
    get(LicenseData, "tenantId") || getQueryArg(href, "tenantId");
  const businessService = "BPAREG"; //Hardcoding Alert
  const queryObjForGetBill = [
    { key: "tenantId", value: tenantId },
    {
      key: "consumerCode",
      value: applicationNo
    },
    {
      key: "businessService",
      value: businessService
    }
  ];
  const queryObjForGetReceipt = [
    { key: "tenantId", value: tenantId },
    {
      key: "consumerCodes",
      value: applicationNo
    }
  ];
  const currentStatus = LicenseData.status;
  const isPAID = isApplicationPaid(currentStatus);
  // const payload = getFromReceipt
  //   ? await getReceipt(queryObj.filter(item => item.key !== "businessService"))
  //   : await getBill(queryObj);
  // const estimateData = payload
  //   ? getFromReceipt
  //     ? getEstimateData(payload.Receipt[0].Bill, getFromReceipt, LicenseData)
  //     : payload.billResponse &&
  //       getEstimateData(payload.billResponse.Bill, false, LicenseData)
  //   : [];
  let payload = {};
  let estimateData = {};
  if (isgetBill) {
    payload = await getBill(queryObjForGetBill);
    estimateData =
      payload &&
      getEstimateData(payload.billResponse.Bill[0], false, LicenseData);
  } else {
    payload = isPAID
      ? await getReceipt(queryObjForGetReceipt)
      : await getBill(queryObjForGetBill);
    estimateData = payload
      ? isPAID
        ? payload &&
        payload.Payments &&
        payload.Payments.length > 0 &&
        getEstimateData(
          payload.Payments[0].paymentDetails[0].bill,
          isPAID,
          LicenseData
        )
        : payload &&
        getEstimateData(payload.billResponse.Bill[0], false, LicenseData)
      : [];
  }
  estimateData = estimateData || [];
  dispatch(prepareFinalObject(jsonPath, estimateData));
  const accessories = get(LicenseData, "tradeLicenseDetail.accessories", []);
  payload &&
    payload.billingSlabIds &&
    getBillingSlabData(dispatch, payload.billingSlabIds, tenantId, accessories);

  /** Waiting for estimate to load while downloading confirmation form */
  var event = new CustomEvent("estimateLoaded", { detail: true });
  window.parent.document.dispatchEvent(event);
  /** END */

  return payload;
};

export const getCurrentFinancialYear = () => {
  var today = new Date();
  var curMonth = today.getMonth();
  var fiscalYr = "";
  if (curMonth >= 3) {
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
  }
  return fiscalYr;
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {
  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath,
    {}
  );
  let isFormValid = true;
  for (var variable in fields) {
    if (fields.hasOwnProperty(variable)) {
      if (
        fields[variable] &&
        fields[variable].props &&
        (fields[variable].props.disabled === undefined ||
          !fields[variable].props.disabled) &&
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            )
          },
          dispatch,
          true
        )
      ) {
        isFormValid = false;
      }
    }
  }
  return isFormValid;
};

export const epochToYmdDate = et => {
  if (!et) return null;
  if (typeof et === "string") return et;
  var date = new Date(Math.round(Number(et)));
  var formattedDate =
    date.getUTCFullYear() +
    "-" +
    (date.getUTCMonth() + 1) +
    "-" +
    date.getUTCDate();
  return formattedDate;
};

export const getTodaysDateInYMD = () => {
  let date = new Date();
  //date = date.valueOf();
  let month = date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  // date = epochToYmdDate(date);
  return date;
};

export const getNextMonthDateInYMD = () => {
  //For getting date of same day but of next month
  let date = getTodaysDateInYMD();
  date =
    date.substring(0, 5) +
    (parseInt(date.substring(5, 7)) + 1) +
    date.substring(7, 10);
  return date;
};

export const getFinancialYearDates = (format, et) => {
  /** Return the starting date and ending date (1st April to 31st March)
   *  of the financial year of the given date in ET. If no ET given then
   *  return the dates for the current financial year */
  var date = !et ? new Date() : new Date(et);
  var curMonth = date.getMonth();
  var financialDates = { startDate: "NA", endDate: "NA" };
  if (curMonth > 3) {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${date.getFullYear().toString()}`;
        financialDates.endDate = `31/03/${(date.getFullYear() + 1).toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${date.getFullYear().toString()}-04-01`;
        financialDates.endDate = `${(date.getFullYear() + 1).toString()}-03-31`;
        break;
    }
  } else {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${(
          date.getFullYear() - 1
        ).toString()}`;
        financialDates.endDate = `31/03/${date.getFullYear().toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${(
          date.getFullYear() - 1
        ).toString()}-04-01`;
        financialDates.endDate = `${date.getFullYear().toString()}-03-31`;
        break;
    }
  }
  return financialDates;
};

export const getBaseURL = () => {
  if (process.env.REACT_APP_NAME !== "Citizen") {
    return "/tradelicence";
  } else {
    return "/tradelicense-citizen";
  }
};

export const fetchBill = async (action, state, dispatch) => {
  //For Adhoc
  // Search License
  let queryObject = [
    { key: "tenantId", value: getQueryArg(window.location.href, "tenantId") },
    {
      key: "applicationNumber",
      value: getQueryArg(window.location.href, "applicationNumber")
    }
  ];
  const LicensesPayload = await getSearchResults(queryObject);
  //get bill and populate estimate card
  const payload =
    LicensesPayload &&
    LicensesPayload.Licenses &&
    (await createEstimateData(
      LicensesPayload.Licenses[0],
      "LicensesTemp[0].estimateCardData",
      dispatch,
      window.location.href
    ));
  //set in redux to be used for adhoc
  LicensesPayload &&
    LicensesPayload.Licenses &&
    dispatch(prepareFinalObject("Licenses[0]", LicensesPayload.Licenses[0]));

  //initiate receipt object
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject("ReceiptTemp[0].Bill[0]", payload.billResponse.Bill[0])
    );

  //set amount paid as total amount from bill - destination changed in CS v1.1
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid",
        payload.billResponse.Bill[0].billDetails[0].totalAmount
      )
    );

  //Collection Type Added in CS v1.1
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].billDetails[0].collectionType",
        "COUNTER"
      )
    );

  //set total amount in instrument
  payload &&
    payload.billResponse &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].instrument.amount",
        payload.billResponse.Bill[0].billDetails[0].totalAmount
      )
    );

  //Initially select instrument type as Cash
  dispatch(
    prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash")
  );

  //set tenantId
  dispatch(
    prepareFinalObject(
      "ReceiptTemp[0].tenantId",
      getQueryArg(window.location.href, "tenantId")
    )
  );

  //set tenantId in instrument
  dispatch(
    prepareFinalObject(
      "ReceiptTemp[0].instrument.tenantId",
      getQueryArg(window.location.href, "tenantId")
    )
  );
};

export const setMultiOwnerForSV = (action, isIndividual) => {
  if (isIndividual) {
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwner.visible",
      true
    );
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwnerInstitutional.visible",
      false
    );
  } else {
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwner.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwnerInstitutional.visible",
      true
    );
  }
};

export const setMultiOwnerForApply = (state, isIndividual) => {
  if (isIndividual) {
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwner.visible",
      true
    );
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwnerInstitutional.visible",
      false
    );
  } else {
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwner.visible",
      false
    );
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.multiOwnerInstitutional.visible",
      true
    );
  }
};

export const setValidToFromVisibilityForSV = (action, value) => {
  if (value === "PERMANENT") {
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewToDate.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewFromDate.visible",
      false
    );
  } else {
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewToDate.visible",
      true
    );
    set(
      action,
      "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewFromDate.visible",
      true
    );
  }
};

export const setValidToFromVisibilityForApply = (state, value) => {
  if (value === "PERMANENT") {
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewToDate.visible",
      false
    );
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewFromDate.visible",
      false
    );
  } else {
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewToDate.visible",
      true
    );
    set(
      state,
      "screenConfiguration.screenConfig.apply.components.div.children.formwizardFourthStep.children.tradeReviewDetails.children.cardContent.children.reviewTradeDetails.children.cardContent.children.viewOne.children.reviewFromDate.visible",
      true
    );
  }
};

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const getTransformedStatus = status => {
  switch (status) {
    case "PAID":
      return "pending_approval";
    case "APPLIED":
      return "pending_payment";
    case "REJECTED":
      return "rejected";
    case "CANCELLED":
      return "cancelled";
    case "APPROVED":
      return "approved";
    default:
      return "";
  }
};

export const updateDropDowns = async (
  payload,
  action,
  state,
  dispatch,
  queryValue
) => {
  const tradeSubTypes = get(
    payload,
    "Licenses[0].tradeLicenseDetail.tradeUnits",
    []
  );

  if (tradeSubTypes.length > 0) {
    try {
      tradeSubTypes.forEach((tradeSubType, i) => {
        const licenseeTradeType = tradeSubType.tradeType;
        const licenseeType = licenseeTradeType.split(".")[0];
        const licenseeSubType = licenseeTradeType.split(".")[1];

        licenseeType &&
          dispatch(
            prepareFinalObject(
              `LicensesTemp[0].tradeLicenseDetail.tradeUnits[${i}].tradeType`,
              licenseeType
            )
          );

        if (licenseeType == "ARCHITECT")
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.counsilForArchNo",
              "visible",
              true
            )
          );
        else
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.counsilForArchNo",
              "visible",
              false
            )
          );

        setLicenseeSubTypeDropdownData(licenseeType, state, dispatch);
        dispatch(
          prepareFinalObject(
            `Licenses[0].tradeLicenseDetail.tradeUnits[${i}].tradeType`,
            licenseeTradeType
          )
        );
      });
    } catch (e) {
      console.log(e);
    }
  }
  setOwnerShipDropDownFieldChange(state, dispatch, payload);
};

export const getDocList = (state, dispatch) => {
  const tradeSubTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.tradeUnits"
  );

  const tradeSubCategories = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.MdmsTradeType"
  );
  let selectedTypes = [];
  tradeSubTypes.forEach(tradeSubType => {
    selectedTypes.push(
      filter(tradeSubCategories, {
        code: tradeSubType.tradeType
      })
    );
  });

  // selectedTypes[0] &&
  //
  let applicationDocArray = [];

  selectedTypes.forEach(tradeSubTypeDoc => {
    applicationDocArray = [
      ...applicationDocArray,
      ...tradeSubTypeDoc[0].applicationDocument
    ];
  });
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  applicationDocArray = applicationDocArray.filter(onlyUnique);
  let applicationDocument = prepareDocumentTypeObj(applicationDocArray);
  dispatch(
    prepareFinalObject(
      "LicensesTemp[0].applicationDocuments",
      applicationDocument
    )
  );

  //REARRANGE APPLICATION DOCS FROM TL SEARCH IN EDIT FLOW
  let applicationDocs = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.applicationDocuments",
    []
  );
  let applicationDocsReArranged =
    applicationDocs &&
    applicationDocs.length &&
    applicationDocument.map(item => {
      const index = applicationDocs.findIndex(
        i => i.documentType === item.name
      );
      return applicationDocs[index];
    });
  applicationDocsReArranged &&
    dispatch(
      prepareFinalObject(
        "Licenses[0].tradeLicenseDetail.applicationDocuments",
        applicationDocsReArranged
      )
    );
};

export const setOwnerShipDropDownFieldChange = (state, dispatch, payload) => {
  let tradeSubOwnershipCat = get(
    payload,
    "Licenses[0].tradeLicenseDetail.subOwnerShipCategory"
  );
  let tradeOwnershipCat = "";
  if (tradeSubOwnershipCat) {
    tradeOwnershipCat = tradeSubOwnershipCat.split(".")[0];
  } else {
    tradeOwnershipCat = get(
      state.screenConfiguration.preparedFinalObject,
      "applyScreenMdmsData.common-masters.OwnerShipCategoryTransformed[0].code",
      ""
    );
    tradeSubOwnershipCat = get(
      state.screenConfiguration.preparedFinalObject,
      `applyScreenMdmsData.common-masters.OwnerShipCategory.${tradeOwnershipCat}[0].code`,
      ""
    );
    set(
      payload,
      "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
      tradeSubOwnershipCat
    );
    payload &&
      dispatch(
        prepareFinalObject(
          "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
          payload.Licenses[0].tradeLicenseDetail.subOwnerShipCategory
        )
      );
  }

  set(
    payload,
    "LicensesTemp[0].tradeLicenseDetail.ownerShipCategory",
    tradeOwnershipCat
  );

  try {
    payload &&
      dispatch(
        prepareFinalObject(
          "LicensesTemp[0].tradeLicenseDetail.ownerShipCategory",
          payload.LicensesTemp[0].tradeLicenseDetail.ownerShipCategory
        )
      );
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.common-masters.subOwnerShipCategoryTransformed",
        get(
          state.screenConfiguration.preparedFinalObject,
          `applyScreenMdmsData.common-masters.OwnerShipCategory.${tradeOwnershipCat}`,
          []
        )
      )
    );

    //handlefield for Type of OwnerShip while setting drop down values as beforeFieldChange won't be callled
    if (tradeOwnershipCat === "INDIVIDUAL") {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.ownerInfoInstitutional",
          "visible",
          false
        )
      );
    } else {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.ownerInfoInstitutional",
          "visible",
          true
        )
      );
    }

    //handlefield for type of sub ownership while setting drop down values as beforeFieldChange won't be callled

    if (tradeSubOwnershipCat === "INDIVIDUAL.SINGLEOWNER") {
      const ownerInfoCards = get(
        state.screenConfiguration.screenConfig.apply, //hardcoded to apply screen
        "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard.props.items"
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "props.hasAddItem",
          false
        )
      );
      if (ownerInfoCards && ownerInfoCards.length > 1) {
        const singleCard = ownerInfoCards.slice(0, 1); //get the first element if multiple cards present

        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
            "props.items",
            singleCard
          )
        );
        dispatch(
          prepareFinalObject(
            "Licenses[0].tradeLicenseDetail.owners",
            get(
              state.screenConfiguration.preparedFinalObject,
              "Licenses[0].tradeLicenseDetail.owners"
            ).slice(0, 1)
          )
        );
      }
    }

    if (tradeSubOwnershipCat === "INDIVIDUAL.MULTIPLEOWNERS") {
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard",
          "props.hasAddItem",
          true
        )
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export const showHideBreakupPopup = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.breakUpDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.breakUpDialog", "props.open", !toggle)
  );
};
export const getDialogButton = (name, key, screenKey) => {
  return {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {}
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: name,
        labelKey: key
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        showHideBreakupPopup(state, dispatch, screenKey);
      }
    }
    //visible: false
  };
};

const getAllBillingSlabs = async tenantId => {
  let payload = await httpRequest(
    "post",
    `/tl-calculator/billingslab/_search?tenantId=${tenantId}`,
    "_search",
    [],
    {}
  );
  return payload;
};

export const getAllDataFromBillingSlab = async (tenantId, dispatch) => {
  const payload = await getAllBillingSlabs(tenantId);
  const processedData =
    payload.billingSlab &&
    payload.billingSlab.reduce(
      (acc, item) => {
        let accessory = { active: true };
        let tradeType = { active: true };
        if (item.accessoryCategory && item.tradeType === null) {
          accessory.code = item.accessoryCategory;
          accessory.uom = item.uom;
          accessory.rate = item.rate;
          item.rate && item.rate > 0 && acc.accessories.push(accessory);
        } else if (item.accessoryCategory === null && item.tradeType) {
          tradeType.code = item.tradeType;
          tradeType.uom = item.uom;
          tradeType.structureType = item.structureType;
          tradeType.licenseType = item.licenseType;
          tradeType.rate = item.rate;
          !isUndefined(item.rate) &&
            item.rate !== null &&
            acc.tradeTypeData.push(tradeType);
        }
        return acc;
      },
      { accessories: [], tradeTypeData: [] }
    );

  const accessories = getUniqueItemsFromArray(
    processedData.accessories,
    "code"
  );
  let structureTypes = getUniqueItemsFromArray(
    processedData.tradeTypeData,
    "structureType"
  );
  structureTypes = commonTransform(
    {
      StructureType: structureTypes.map(item => {
        return { code: item.structureType, active: true };
      })
    },
    "StructureType"
  );
  let licenseTypes = getUniqueItemsFromArray(
    processedData.tradeTypeData,
    "licenseType"
  );
  licenseTypes = licenseTypes.map(item => {
    return { code: item.licenseType, active: true };
  });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.StructureType",
      structureTypes.StructureType
    )
  );
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.TradeLicense.AccessoriesCategory",
      accessories
    )
  );
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.TradeLicense.licenseType",
      licenseTypes
    )
  );
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.StructureTypeTransformed",
      objectToDropdown(structureTypes.StructureType)
    )
  );
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.TradeLicense.TradeType",
      processedData.tradeTypeData
    )
  );
};

export const getUniqueItemsFromArray = (data, identifier) => {
  const uniqueArray = [];
  const map = new Map();
  for (const item of data) {
    if (!map.has(item[identifier])) {
      map.set(item[identifier], true); // set any value to Map
      uniqueArray.push(item);
    }
  }
  return uniqueArray;
};

export const setFilteredTradeTypes = (
  state,
  dispatch,
  licenseType,
  structureSubtype
) => {
  const tradeTypeBSlab = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.TradeLicense.TradeType",
    []
  );
  const mdmsTradeTypes = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.TradeLicense.MdmsTradeType",
    []
  );
  try {
    if (tradeTypeBSlab.length > 0 && mdmsTradeTypes.length > 0) {
      const mdmsTTTransformed = mdmsTradeTypes.reduce((acc, item) => {
        item.code && (acc[item.code] = item);
        return acc;
      }, {});
      let tradeTypeList = [];
      tradeTypeBSlab.length > 0 &&
        tradeTypeBSlab.forEach(item => {
          if (
            item.code &&
            mdmsTTTransformed[item.code] &&
            mdmsTTTransformed[item.code].applicationDocument
          ) {
            tradeTypeList.push({
              ...item,
              applicationDocument:
                mdmsTTTransformed[item.code].applicationDocument
            });
          }
        });
      if (tradeTypeList && tradeTypeList.length > 0) {
        let filteredList =
          tradeTypeList &&
          tradeTypeList.length > 0 &&
          tradeTypeList.filter(item => {
            if (
              item.licenseType === licenseType &&
              item.structureType === structureSubtype
            )
              return true;
          });
        let tradeTypeTransformed = commonTransform(
          { TradeType: [...filteredList] },
          "TradeType"
        );
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.TradeLicense.filteredTradeTypeTree",
            tradeTypeTransformed.TradeType
          )
        );
        // tradeTypeTransformed.TradeType &&
        //   dispatch(
        //     prepareFinalObject(
        //       "applyScreenMdmsData.TradeLicense.TradeType",
        //       tradeTypeTransformed.TradeType
        //     )
        //   );
        return tradeTypeTransformed;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const showCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["home"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("home", "components.cityPickerDialog", "props.open", !toggle)
  );
};
/*
export const applyForm = (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId"
  );

  const isTradeDetailsValid = validateFields(
    "components.cityPickerDialog.children.dialogContent.children.popup.children.cityPicker.children",
    state,
    dispatch,
    "home"
  );

  if (isTradeDetailsValid) {
    window.location.href =
      process.env.NODE_ENV === "production"
        ? `/citizen/tradelicense-citizen/apply?tenantId=${tenantId}`
        : process.env.REACT_APP_SELF_RUNNING === true
        ? `/egov-ui-framework/tradelicense-citizen/apply?tenantId=${tenantId}`
        : `/tradelicense-citizen/apply?tenantId=${tenantId}`;
  }
};
*/
export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};

export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const getLicenseeTypeDropdownData = tradeTypes => {
  let tt = [];
  let tradeTypesFiltered = [];
  tradeTypes.forEach(tradeType => {
    if (tt.indexOf(tradeType.code.split(".")[0]) == -1) {
      tradeTypesFiltered.push({
        code: tradeType.code.split(".")[0],
        active: true
      });
      tt.push(tradeType.code.split(".")[0]);
    }
  });
  return tradeTypesFiltered;
};

export const setLicenseeSubTypeDropdownData = async (
  actionValue,
  state,
  dispatch
) => {
  const tradeTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.TradeType",
    []
  );
  dispatch(
    prepareFinalObject(
      "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
      ""
    )
  );
  const selectedTradeType = actionValue;
  let filterdTradeTypes = [];
  filterdTradeTypes = tradeTypes.filter(tradeType => {
    return (
      tradeType.code.split(".")[0] == selectedTradeType &&
      tradeType.code.split(".")[1]
    );
  });
  if (filterdTradeTypes.length == 0) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.licenseeSubType",
        "props.disabled",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.licenseeSubType",
        "required",
        false
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.licenseeSubType",
        "visible",
        false
      )
    );

    dispatch(
      prepareFinalObject(
        "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
        selectedTradeType
      )
    );
  } else {
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.licenseeSubType",
        "props.disabled",
        false
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.licenseeSubType",
        "required",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.licenseeSubType",
        "visible",
        true
      )
    );
  }
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.TradeLicense.tradeSubType",
      filterdTradeTypes
    )
  );
};

export const fillOldLicenseData = async (state, dispatch) => {
  dispatch(
    initScreen(
      "apply",
      get(state.screenConfiguration, "screenConfig.apply", {})
    )
  );
};

/*
export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "TL_COMMON_TABLE_COL_APP_NO",
        localisationLabels
      );

    case "License No":
      return getLocaleLabels(
        "License No",
        "TL_COMMON_TABLE_COL_LIC_NO",
        localisationLabels
      );

    case "Trade Name":
      return getLocaleLabels(
        "Trade Name",
        "TL_COMMON_TABLE_COL_TRD_NAME",
        localisationLabels
      );
    case "Owner Name":
      return getLocaleLabels(
        "Assigned To",
        "BPA_COMMON_TABLE_COL_ASSIGN_TO",
        localisationLabels
      );

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "TL_COMMON_TABLE_COL_APP_DATE",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "TL_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );

    case "Applicant Name":
      return getLocaleLabels(
        "Applicant Name",
        "BPA_COMMON_TABLE_COL_APP_NAME",
        localisationLabels
      );

    case "Licensee Type":
      return getLocaleLabels(
        "Licensee Type",
        "BPA_COMMON_TABLE_COL_LICENSEE_TYPE",
        localisationLabels
      );

    case "INITIATED":
      return getLocaleLabels("Initiated,", "TL_INITIATED", localisationLabels);
    case "APPLIED":
      return getLocaleLabels("Applied", "TL_APPLIED", localisationLabels);
    case "PAID":
      return getLocaleLabels(
        "Paid",
        "WF_ARCHITECT_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGDOCVERIFICATION":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_ARCHITECT_PENDINGDOCVERIFICATION",
        localisationLabels
      );
    case "APPROVED":
      return getLocaleLabels("Approved", "TL_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "TL_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "TL_CANCELLED", localisationLabels);
    case "PENDINGAPPROVAL":
      return getLocaleLabels(
        "Pending for Approval",
        "WF_ARCHITECT_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_ARCHITECT_PENDINGPAYMENT",
        localisationLabels
      );

    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_ARCHITECT_FIELDINSPECTION",
        localisationLabels
      );

    case "Search Results for Stakeholder Registration Applications":
      return getLocaleLabels(
        "",
        "BPA_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
    default:
      return getLocaleLabels(label, label, localisationLabels);
  }
};*/

export const addressDestruct = (action, state, dispatch) => {
  const ownerData = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.owners[0]"
  );
  const { permanentAddress, permanentCity, permanentPinCode } = ownerData;
  const doorNo = permanentAddress.split(",")[0] || null;
  const buildingName = permanentAddress.split(",")[1] || null;
  const street = permanentAddress.split(",")[2] || null;
  const landmark = permanentAddress.split(",")[3] || null;
  const address = {
    doorNo,
    buildingName,
    street,
    landmark,
    city: permanentCity,
    pincode: permanentPinCode
  };

  dispatch(prepareFinalObject("LicensesTemp[0].userData.address", address));
};

export const setOrganizationVisibility = (
  action,
  state,
  dispatch,
  ownerShipType
) => {
  dispatch(
    prepareFinalObject(
      "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
      ownerShipType
    )
  );
  const componentPathToHide = [
    "components.div.children.formwizardFirstStep.children.organizationDetails",
    "components.div.children.formwizardThirdStep.children.tradeReviewDetails.children.cardContent.children.reviewOrganizationDetails"
  ];
  componentPathToHide &&
    componentPathToHide.map(item => {
      set(
        action.screenConfig,
        `${item}.visible`,
        ownerShipType != "INDIVIDUAL"
      );
    });
};

export const checkValueForNA = value => {
  return value ? value : "NA";
};

export const setMobileNoField = (action, state, dispatch) => {
  let userInfo = JSON.parse(getUserInfo());
  let { mobileNumber } = userInfo;
  if (mobileNumber) {
    dispatch(
      prepareFinalObject(
        "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber",
        mobileNumber
      )
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getOwnerMobNoField.props.disabled`,
      true
    );
  }
};

export const gotoApplyWithStep = (state, dispatch, step) => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  const applicationNumberQueryString = applicationNumber
    ? `&applicationNumber=${applicationNumber}`
    : ``;
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-bpa/apply?step=${step}${applicationNumberQueryString}`
      : `/egov-bpa/apply?step=${step}${applicationNumberQueryString}`;
  dispatch(setRoute(applyUrl));
};

export const showHideAdhocPopup = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  );
};

export const getCommonGrayCard = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      body: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          ch1: getCommonCard(children, {
            style: {
              backgroundColor: "rgb(242, 242, 242)",
              boxShadow: "none",
              borderRadius: 0,
              overflow: "visible"
            }
          })
        },
        gridDefination: {
          xs: 12
        }
      }
    },
    gridDefination: {
      xs: 12
    }
  };
};

export const getLabelOnlyValue = (value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 4
    },
    props: {
      style: {
        marginBottom: "16px"
      },
      ...props
    },
    children: {
      value: getCommonCaption(value)
    }
  };
};

export const getBpaDetailsForOwner = async (state, dispatch, fieldInfo) => {
  try {
    const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
    const ownerNo = get(
      state.screenConfiguration.preparedFinalObject,
      `BPA.owners[${cardIndex}].mobileNumber`,
      ""
    );
    if (!ownerNo.match(getPattern("MobileNo"))) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Incorrect Number!",
            labelKey: "ERR_MOBILE_NUMBER_INCORRECT"
          },
          "error"
        )
      );
      return;
    }
    const owners = get(
      state.screenConfiguration.preparedFinalObject,
      `BPA.owners`,
      []
    );
    //owners from search call before modification.
    const oldOwnersArr = get(
      state.screenConfiguration.preparedFinalObject,
      "BPA.owners",
      []
    );
    //Same no search on Same index
    if (ownerNo === owners[cardIndex].userName) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Owner has been added already!",
            labelKey: "ERR_OWNER_ALREADY_ADDED_TOGGLE_MSG"
          },
          "error"
        )
      );
      return;
    }

    //Same no search in whole array
    const matchingOwnerIndex = owners.findIndex(
      item => item.userName === ownerNo
    );
    if (matchingOwnerIndex > -1) {
      if (
        !isUndefined(owners[matchingOwnerIndex].userActive) &&
        owners[matchingOwnerIndex].userActive === false
      ) {
        //rearrange
        dispatch(
          prepareFinalObject(
            `BPA.owners[${matchingOwnerIndex}].userActive`,
            true
          )
        );
        dispatch(
          prepareFinalObject(
            `BPA.owners[${cardIndex}].userActive`,
            false
          )
        );
        //Delete if current card was not part of oldOwners array - no need to save.
        if (
          oldOwnersArr.findIndex(
            item => owners[cardIndex].userName === item.userName
          ) == -1
        ) {
          owners.splice(cardIndex, 1);
          dispatch(
            prepareFinalObject(
              `BPA.owners`,
              owners
            )
          );
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Owner already added!",
              labelKey: "ERR_OWNER_ALREADY_ADDED_1"
            },
            "error"
          )
        );
      }
      return;
    } else {
      //New number search only
      let payload = await httpRequest(
        "post",
        "/user/_search?tenantId=pb",
        "_search",
        [],
        {
          tenantId: "pb",
          userName: `${ownerNo}`
        }
      );
      if (payload && payload.user && payload.user.hasOwnProperty("length")) {
        if (payload.user.length === 0) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "This mobile number is not registered!",
                labelKey: "ERR_MOBILE_NUMBER_NOT_REGISTERED"
              },
              "info"
            )
          );
        } else {
          const userInfo =
            payload.user &&
            payload.user[0] &&
            JSON.parse(JSON.stringify(payload.user[0]));
          if (userInfo && userInfo.createdDate) {
            userInfo.createdDate = convertDateTimeToEpoch(userInfo.createdDate);
            userInfo.lastModifiedDate = convertDateTimeToEpoch(
              userInfo.lastModifiedDate
            );
            userInfo.pwdExpiryDate = convertDateTimeToEpoch(
              userInfo.pwdExpiryDate
            );
          }
          let currOwnersArr = get(
            state.screenConfiguration.preparedFinalObject,
            "BPA.owners",
            []
          );

          currOwnersArr[cardIndex] = userInfo;
          dispatch(
            prepareFinalObject(
              `BPA.owners`,
              currOwnersArr
            )
          );
        }
      }
    }
  } catch (e) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "info"
      )
    );
  }
};


const riskType = (state, dispatch) => {
  let occupancyType = get(
    state.screenConfiguration.preparedFinalObject,
    "srutinyDetails.planDetail.virtualBuilding.occupancyTypes[0].type.name"
  );
  let plotArea = get(
    state.screenConfiguration.preparedFinalObject,
    "srutinyDetails.planDetail.plot.area"
  );
  let buildingBlocks = get(
    state.screenConfiguration.preparedFinalObject,
    "srutinyDetails.planDetail.blocks"
  );
  let blocks = buildingBlocks.map(item => {
    return item && item.building && item.building.buildingHeight;
  });
  let buildingHeight = Math.max(blocks);
  let scrutinyRiskType;
  if (
    occupancyType === "Residential" &&
    plotArea > 500 &&
    buildingHeight > 15
  ) {
    scrutinyRiskType = "HIGH";
  } else if (
    occupancyType === "Residential" &&
    plotArea <= 500 &&
    plotArea >= 300 &&
    buildingHeight <= 15 &&
    buildingHeight >= 10
  ) {
    scrutinyRiskType = "MEDIUM";
  } else {
    scrutinyRiskType = "LOW";
  }
  dispatch(
    prepareFinalObject(
      "BPA.riskType",
      scrutinyRiskType
    )
  );
};

export const getScrutinyDetails = async (state, dispatch, fieldInfo) => {
  try {
    const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
    const scrutinyNo = get(
      state.screenConfiguration.preparedFinalObject,
      `BPA.edcrNumber`,
      ""
    );

    // const tenantId = get(
    //   state.screenConfiguration.preparedFinalObject,
    //   "citiesByModule.citizenTenantId.value"
    // );
    if (!scrutinyNo || !scrutinyNo.match(getPattern("^[a-zA-Z0-9]*$"))) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Incorrect Scrutiny Number!",
            labelKey: "BPA_INCORRECT_SCRUTINY_NUMBER"
          },
          "error"
        )
      );
      return;
    }
    let payload = await edcrHttpRequest(
      "post",
      "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + scrutinyNo + "&tenantId=pb.amritsar",
      {}
    );
    payload = payload.edcrDetail;
    if (payload && payload.hasOwnProperty("length")) {
      if (payload.length === 0) {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "This scrutiny number is not registered!",
              labelKey: "ERR_SCRUTINY_NUMBER_NOT_REGISTERED"
            },
            "info"
          )
        );
      } else {
        const scrutinyData = payload && JSON.parse(JSON.stringify(payload));

        if (scrutinyData && scrutinyData.planDetail && scrutinyData.planDetail.applicationDate) {
          scrutinyData.planDetail.applicationDate = convertDateTimeToEpoch(scrutinyData.planDetail.applicationDate);
          scrutinyData.lastModifiedDate = convertDateTimeToEpoch(
            scrutinyData.lastModifiedDate
          );
          scrutinyData.pwdExpiryDate = convertDateTimeToEpoch(
            scrutinyData.pwdExpiryDate
          );
        };

        const tenantId = get(
          state.screenConfiguration.preparedFinalObject,
          "BPAs[0].BPADetails.plotdetails.citytown"
        );
        const city = scrutinyData[0].tenantId;

        if (tenantId.value === city) {
          let currOwnersArr = get(
            state.screenConfiguration.preparedFinalObject,
            "srutinyDetails",
            []
          );
          currOwnersArr = scrutinyData[0];
          dispatch(
            prepareFinalObject(
              `srutinyDetails`,
              currOwnersArr
            )
          );
          riskType(state, dispatch);
        } else {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: `Scrutiny number ${scrutinyNo} is from ${city}`,
                labelKey: `Scrutiny number ${scrutinyNo} is from ${city}`
              },
              "error"
            )
          );
        }
      }
    }
  } catch (e) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "info"
      )
    );
  }
};

// export const getMdmsData = async queryObject => {
//   try {
//     const response = await httpRequest(
//       "post",
//       "egov-mdms-service/v1/_get",
//       "",
//       queryObject
//     );
//     return response;
//   } catch (error) {
//     console.log(error);
//     return {};
//   }
// };

// Get user data from uuid API call



export const searchBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "consumerCode",
        value: applicationNumber
      }
    ];

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/collection-services/receipts/_search",
      "",
      queryObject
    );

    // Get Bill
    const response = await getBill([
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "applicationNumber",
        value: applicationNumber
      }
    ]);

    // If pending payment then get bill else get receipt
    let billData = get(payload, "Receipt[0].Bill") || get(response, "Bill");

    if (billData) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
      const estimateData = createEstimateData(billData[0]);
      estimateData &&
        estimateData.length &&
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.estimateCardData",
            estimateData
          )
        );
    }
  } catch (e) {
    console.log(e);
  }
};

// export const createEstimateData = billObject => {
//   const billDetails = billObject && billObject.billDetails;
//   let fees =
//     billDetails &&
//     billDetails[0].billAccountDetails &&
//     billDetails[0].billAccountDetails.map(item => {
//       return {
//         name: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode },
//         value: item.amount,
//         info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
//       };
//     });
//   return fees;
// };

export const generateBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    if (applicationNumber && tenantId) {
      const queryObj = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "applicationNumber",
          value: applicationNumber
        }
      ];
      const payload = await getBill(queryObj);
      // let payload = sampleGetBill();
      if (payload && payload.Bill[0]) {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));
        const estimateData = createEstimateData(payload.Bill[0]);
        estimateData &&
          estimateData.length &&
          dispatch(
            prepareFinalObject(
              "applyScreenMdmsData.estimateCardData",
              estimateData
            )
          );
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.NOCNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
      "props.value",
      ""
    )
  );
};

// export const getRequiredDocData = async (action, state, dispatch) => {
//   let tenantId =
//     process.env.REACT_APP_NAME === "Citizen" ? "pb.amritsar" : getTenantId();
//   let mdmsBody = {
//     MdmsCriteria: {
//       tenantId: tenantId,
//       moduleDetails: [
//         {
//           moduleName: "BPA",
//           masterDetails: [{ name: "Documents" }]
//         }
//       ]
//     }
//   };
//   try {
//     let payload = null;
//     payload = mdmsMockJson;
//     console.log(mdmsMockJson);
//     // payload = await httpRequest(
//     //   "post",
//     //   "/egov-mdms-service/v1/_search",
//     //   "_search",
//     //   [],
//     //   mdmsBody
//     // );
//     dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
//   } catch (e) {
//     console.log(e);
//   }
// };

export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Floor Description":
      return getLocaleLabels(
        "Floor Description",
        "BPA_COMMON_TABLE_COL_FLOOR_DES",
        localisationLabels
      );
    case "Occupancy/Sub Occupancy":
      return getLocaleLabels(
        "Occupancy/Sub Occupancy",
        "BPA_COMMON_TABLE_COL_OCCUP",
        localisationLabels
      );
    case "Buildup Area":
      return getLocaleLabels(
        "Buildup Area",
        "BPA_COMMON_TABLE_COL_BUILD_AREA",
        localisationLabels
      );
    case "Floor Area":
      return getLocaleLabels(
        "Floor Area",
        "BPA_COMMON_TABLE_COL_FLOOR_AREA",
        localisationLabels
      );
    case "Carpet Area":
      return getLocaleLabels(
        "Carpet Area",
        "BPA_COMMON_TABLE_COL_CARPET_AREA",
        localisationLabels
      );
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "TL_COMMON_TABLE_COL_APP_NO",
        localisationLabels
      );

    case "NOC No":
      return getLocaleLabels(
        "NOC No",
        "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
        localisationLabels
      );

    case "NOC Type":
      return getLocaleLabels("NOC Type", "NOC_TYPE_LABEL", localisationLabels);
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
        localisationLabels
      );

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "NOC_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );

    case "INITIATED":
      return getLocaleLabels("Initiated,", "NOC_INITIATED", localisationLabels);
    case "APPLIED":
      getLocaleLabels("Applied", "NOC_APPLIED", localisationLabels);
    case "PAID":
      getLocaleLabels("Paid", "WF_NEWTL_PENDINGAPPROVAL", localisationLabels);

    case "APPROVED":
      return getLocaleLabels("Approved", "NOC_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "NOC_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "NOC_CANCELLED", localisationLabels);
    case "PENDINGAPPROVAL ":
      return getLocaleLabels(
        "Pending for Approval",
        "WF_FIRENOC_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_FIRENOC_PENDINGPAYMENT",
        localisationLabels
      );
    case "DOCUMENTVERIFY":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_FIRENOC_DOCUMENTVERIFY",
        localisationLabels
      );
    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_FIRENOC_FIELDINSPECTION",
        localisationLabels
      );

    case "Search Results for BPA Applications":
      return getLocaleLabels(
        "Search Results for BPA Applications",
        "BPA_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
  }
};


export const showApplyCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["search"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("search", "components.cityPickerDialog", "props.open", !toggle)
  );
};


const city = (state, dispatch, tenantId) => {
  let city = get(
    state.screenConfiguration.preparedFinalObject,
    "BPAs[0].BPADetails.plotdetails.citytown"
  );
  if (!city) {
    dispatch(prepareFinalObject("BPAs[0].BPADetails.plotdetails.citytown", tenantId));
  }
};

export const applyForm = (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId"
  );

  const isTradeDetailsValid = validateFields(
    "components.cityPickerDialog.children.dialogContent.children.popup.children.cityPicker.children",
    state,
    dispatch,
    "search"
  );

  if (isTradeDetailsValid) {
    dispatch(prepareFinalObject("BPAs", []));
    const applyUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? `/egov-ui-framework/egov-bpa/apply` : `/egov-bpa/apply`;
    dispatch(setRoute(applyUrl));
    city(state, dispatch, tenantId);
  }
};


// const getMdmsData = async () => {
//   let mdmsBody = {
//     // MdmsCriteria: {
//     //   tenantId: commonConfig.tenantId,
//     //   moduleDetails: [
//     //     {
//     //       moduleName: "tenant",
//     //       masterDetails: [{ name: "citymodule" }]
//     //     }
//     //   ]
//     // }
//   };
//   try {
//     let payload = await httpRequest(
//       "post",
//       "/egov-mdms-service/v1/_search",
//       "_search",
//       [],
//       mdmsBody
//     );
//     return payload;
//   } catch (e) {
//     console.log(e);
//   }
// };

export const fetchData = async (action, state, dispatch) => {
  // const response = cityModuleMockJson; //await getSearchResults();
  const mdmsRes = cityModuleMockJson; //await getMdmsData(dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "TL") return true;
    });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.citiesByModule.TL",
      tenants
    )
  );
  // try {
  //   if (response && response.Licenses && response.Licenses.length > 0) {
  //     dispatch(prepareFinalObject("searchResults", response.Licenses));
  //     dispatch(
  //       prepareFinalObject("myApplicationsCount", response.Licenses.length)
  //     );
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
};

export const createBill = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    console.log(error, 'fetxh');
  }
};

export const setNameOfUser = (action, state, dispatch) => {
  let userInfo = JSON.parse(getUserInfo());
  let { name } = userInfo;
  if (name) {
    dispatch(
      prepareFinalObject(
        "Licenses[0].tradeLicenseDetail.owners[0].name",
        name
      )
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.ownerName.props.disabled`,
      true
    );
  }
};
