import axios from "axios";
import commonConfig from "config/common.js";
import { getCommonCaption, getCommonCard, getCommonSubHeader, getLabel, getPattern, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, initScreen, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
  getFileUrl,
  getFileUrlFromAPI, getLocaleLabels, getQueryArg,


  getTransformedLocale, getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import { getPaymentSearchAPI, getUserSearchedResponse, printPdf } from "egov-ui-kit/utils/commons";
import {
  getTenantId,
  getUserInfo,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import _ from "lodash";
import filter from "lodash/filter";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import set from "lodash/set";
import { edcrHttpRequest, httpRequest, wrapRequestBody } from "../../../../ui-utils/api";
import { getBpaSearchResults, prepareNOCUploadData } from "../../../../ui-utils/commons";
import "./index.css";

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

export const getCheckbox = (content, jsonPath, props = { }) => {
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
  props = { },
  gridDefination = { }
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
    }, { })
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
    return { };
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
    moduleName: "egov-bpa",
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
  let transformedData = { };
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
            i < splitList.length - 2 ? { } : []
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
    return { };
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

export const getReceipt = async (queryObject, businessService) => {
  try {
    const response = await httpRequest(
      "post",
      getPaymentSearchAPI(businessService),
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
    return { };
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
    props: { }
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
    return { };
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
        { }
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
    // const response = await httpRequest(
    //   "post",
    //   "/user/_search",
    //   "",
    //   [],
    //   bodyObject
    // );

    const response = getUserSearchedResponse();
    return response;
  } catch (error) {
    console.log(error);
    return { };
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
    billingSlabIds || { };
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
  href = { },
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
  let isPAID = isApplicationPaid(currentStatus);
  if (process.env.REACT_APP_NAME !== "Citizen" &&
    window.location.pathname.indexOf("/bpastakeholder/search-preview") > -1) {
    isPAID = true
  }
  // const payload = getFromReceipt
  //   ? await getReceipt(queryObj.filter(item => item.key !== "businessService"))
  //   : await getBill(queryObj);
  // const estimateData = payload
  //   ? getFromReceipt
  //     ? getEstimateData(payload.Receipt[0].Bill, getFromReceipt, LicenseData)
  //     : payload.billResponse &&
  //       getEstimateData(payload.billResponse.Bill, false, LicenseData)
  //   : [];
  let payload = { };
  let estimateData = { };
  if (isgetBill) {
    payload = await getBill(queryObjForGetBill);
    estimateData =
      payload &&
      getEstimateData(payload.billResponse.Bill[0], false, LicenseData);
  } else {
    payload = isPAID
      ? await getReceipt(queryObjForGetReceipt, businessService)
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
    { }
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

export const getTodaysDateInYYYMMDD = () => {
  let date = new Date();
  let month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  return date;
};

export const getEighteenYearOldDateForDOB = () => {
  let date = new Date();
  let month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear() - 18}-${month}-${day}`;
  return date;
};

export const getHundredYearOldDateForDOB = () => {
  let date = new Date();
  let month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear() - 100}-${month}-${day}`;
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

export const ifUserRoleMatches = roleList => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  let found = roleList.some(elem => roleCodes.includes(elem));
  return !found;
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
              "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children.counsilForArchNo",
              "visible",
              true
            )
          );
        else
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container3.children.counsilForArchNo",
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

export const prepareBPAREGDocumentDetailsUploadRedux = async (state, dispatch) => {
  let docs = get(state.screenConfiguration.preparedFinalObject, "BPARegDocumentsContract");
  let bpaDocs = [];

  if (docs && docs.length > 0) {
    docs.forEach(section => {
      section.cards.forEach(doc => {
        let docObj = { };
        docObj.documentType = section.code;
        docObj.documentCode = doc.code;
        docObj.isDocumentRequired = doc.required;
        docObj.isDocumentTypeRequired = doc.required;
        bpaDocs.push(docObj);
      })
    });
  }

  let uploadedDocs = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.applicationDocuments", []);

  if (uploadedDocs && uploadedDocs.length > 0) {
    let fileStoreIds = jp.query(uploadedDocs, "$.*.fileStoreId");
    let fileUrls = fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : { };
    uploadedDocs.forEach(upDoc => {
      bpaDocs.forEach(bpaDoc => {
        let bpaDetailsDoc = (upDoc.documentType).split('.')[0] + "." + (upDoc.documentType).split('.')[1];
        if (bpaDetailsDoc == bpaDoc.documentCode) {
          let url = (fileUrls && fileUrls[upDoc.fileStoreId] && fileUrls[upDoc.fileStoreId].split(",")[0]) || "";
          let name = (fileUrls[upDoc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[upDoc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
            `Document - ${index + 1}`;
          bpaDoc.dropDownValues = { };
          bpaDoc.dropDownValues.value = upDoc.documentType;
          bpaDoc.documents = [
            {
              fileName: name,
              fileStoreId: upDoc.fileStoreId,
              fileUrl: url,
              id: upDoc.id
            }
          ]
        }
      })
    })
    dispatch(prepareFinalObject("bparegDocumentDetailsUploadRedux", bpaDocs));
  }
}

export const getDocList = async (state, dispatch) => {
  const tradeSubTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.tradeUnits"
  );

  let TradeTypetoRoleMapping = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.StakeholderRegistraition.TradeTypetoRoleMapping", []
  );

  let tardetypSeletedTypes = [];
  tradeSubTypes.forEach(tradeTradeSubType => {
    tardetypSeletedTypes.push(
      filter(TradeTypetoRoleMapping, {
        tradeType: tradeTradeSubType.tradeType
      })
    );
  });

  let docTyps = tardetypSeletedTypes[0][0].docTypes;
  if (docTyps && docTyps.length > 0) {
    const bpaDocuments = docTyps;
    let documentsContract = [];
    let tempDoc = { };

    bpaDocuments.forEach(doc => {
      let card = { };
      card["code"] = doc.code.split(".")[0];
      card["title"] = doc.code.split(".")[0];
      card["cards"] = [];
      tempDoc[doc.code.split(".")[0]] = card;
    });
    bpaDocuments.forEach(doc => {
      let card = { };
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      tempDoc[doc.code.split(".")[0]].cards.push(card);
    });

    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });
    dispatch(prepareFinalObject("BPARegDocumentsContract", documentsContract));
  }
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
      style: { }
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
    { }
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
      }, { });
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
  const ocCityPicker = get(
    state.screenConfiguration.screenConfig,
    "home.components.cityPickerDialogForOC.props.open", false
  );
  if (ocCityPicker) {
    let toggle = get(
      state.screenConfiguration.screenConfig["home"],
      "components.cityPickerDialogForOC.props.open",
      false
    );
    dispatch(
      handleField("home", "components.cityPickerDialogForOC", "props.open", !toggle)
    );
  } else {
    let toggle = get(
      state.screenConfiguration.screenConfig["home"],
      "components.cityPickerDialog.props.open",
      false
    );
    dispatch(
      handleField("home", "components.cityPickerDialog", "props.open", !toggle)
    );
  }
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
  // dispatch(
  //   prepareFinalObject(
  //     "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
  //     null
  //   )
  // );
  const licenceType = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
  );
  if (licenceType) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children.licenseeSubType",
        "props.value",
        null
      )
    );
  }

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
        "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children.licenseeSubType",
        "props.disabled",
        false
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children.licenseeSubType",
        "required",
        false
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children.licenseeSubType",
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
        "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children.licenseeSubType",
        "props.disabled",
        false
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children.licenseeSubType",
        "required",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.LicenseeCard.children.cardContent.children.tradeUnitCardContainer.children.container2.children.licenseeSubType",
        "visible",
        false
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
      get(state.screenConfiguration, "screenConfig.apply", { })
    )
  );
};

export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "BPA_COMMON_TABLE_COL_APP_NO",
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
      return getLocaleLabels("Initiated,", "WF_BPA_INITIATED", localisationLabels);
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
      return getLocaleLabels("Approved", "WF_BPA_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "WF_BPA_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "WF_BPA_CANCELLED", localisationLabels);
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

    case "DOCUMENTVERIFY":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_FIRENOC_DOCUMENTVERIFY",
        localisationLabels
      );

    case "Search Results for BPA Applications":
      return getLocaleLabels(
        "Search Results for BPA Applications",
        "BPA_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
    case "DOC_VERIFICATION_PENDING":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_BPA_DOC_VERIFICATION_PENDING",
        localisationLabels
      );

    case "PENDING_APPL_FEE_PAYMENT":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_BPA_PENDING_APPL_FEE_PAYMENT",
        localisationLabels
      );

    default:
      return getLocaleLabels(label, label, localisationLabels);
  }
};

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
  const cityfield = permanentAddress.split(",")[4] || null;
  const address = {
    doorNo,
    buildingName,
    street,
    landmark,
    city: cityfield,
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
      `components.div.children.formwizardSecondStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getOwnerMobNoField.props.disabled`,
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
  const tenantId = getQueryArg(window.location.href, "tenantId") ||
    get(
      state.screenConfiguration.preparedFinalObject,
      "BPA.landInfo.address.city"
    );
  const ownershipCategory = get(
    state.screenConfiguration.preparedFinalObject,
    "BPA.landInfo.ownershipCategory"
  );
  if (ownershipCategory) {
    let ownerShipMajorType = dispatch(
      prepareFinalObject(
        "BPA.landInfo.ownerShipMajorType",
        ownershipCategory.split('.')[0]
      )
    );
  }
  const tenantIdQueryString = tenantId ? `&tenantId=${tenantId}` : ``;
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-bpa/apply?step=${step}${applicationNumberQueryString}${tenantIdQueryString}`
      : `/egov-bpa/apply?step=${step}${applicationNumberQueryString}${tenantIdQueryString}`;
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

export const getLabelOnlyValue = (value, props = { }) => {
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
      `BPA.landInfo.owners[${cardIndex}].mobileNumber`,
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
      `BPA.landInfo.owners`,
      []
    );
    let tenantId =
      get(
        state.screenConfiguration.preparedFinalObject,
        "BPA.landInfo.address.city"
      ) || getQueryArg(window.location.href, "tenantId") || getTenantId();
    //owners from search call before modification.
    const oldOwnersArr = get(
      state.screenConfiguration.preparedFinalObject,
      "BPA.landInfo.owners",
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
            `BPA.landInfo.owners[${matchingOwnerIndex}].userActive`,
            true
          )
        );
        dispatch(
          prepareFinalObject(`BPA.landInfo.owners[${cardIndex}].userActive`, false)
        );
        //Delete if current card was not part of oldOwners array - no need to save.
        if (
          oldOwnersArr.findIndex(
            item => owners[cardIndex].userName === item.userName
          ) == -1
        ) {
          owners.splice(cardIndex, 1);
          dispatch(prepareFinalObject(`BPA.landInfo.owners`, owners));
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

      let ownerTenatID = getTenantId(), userTenantId;
      if (ownerTenatID && ownerTenatID.split(".") && ownerTenatID.split(".").length > 0) userTenantId = ownerTenatID.split(".")[0];
      let payload = await httpRequest(
        "post",
        "/user/_search?tenantId=" + tenantId,
        "_search",
        [],
        {
          tenantId: userTenantId ? userTenantId : getTenantId(),
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
            "BPA.landInfo.owners",
            []
          );
          let ownershipCategory = get(
            state.screenConfiguration.preparedFinalObject,
            "BPA.landInfo.ownershipCategory"
          );
          if (ownershipCategory && ownershipCategory == "INDIVIDUAL.SINGLEOWNER") {
            userInfo.isPrimaryOwner = true;
          }
          let relationship = get(
            state.screenConfiguration.preparedFinalObject,
            `BPA.landInfo.owners[${cardIndex}].relationship`
          );
          if (relationship) {
            userInfo.relationship = relationship;
          }

          currOwnersArr[cardIndex] = userInfo;
          dispatch(prepareFinalObject(`BPA.landInfo.owners`, currOwnersArr));
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

export const edcrDetailsToBpaDetails = (state, dispatch) => {
  getRiskType(state, dispatch);
  let path = window.location.href.includes("oc-bpa")
  let scrutinytype = path ? "ocScrutinyDetails" : "scrutinyDetails";

  let applicationType = get(
    state.screenConfiguration.preparedFinalObject,
    `${scrutinytype}.appliactionType`
  ) || "BUILDING_PLAN_SCRUTINY";

  let serviceType = get(
    state.screenConfiguration.preparedFinalObject,
    `${scrutinytype}.applicationSubType`
  ) || "NEW_CONSTRUCTION";

  dispatch(prepareFinalObject("BPA.applicationType", applicationType));
  dispatch(prepareFinalObject("BPA.serviceType", serviceType));
}

export const getRiskType = (state, dispatch, forBPA) => {
  let path = window.location.href.includes("oc-bpa");
  if (forBPA) {
    path = false;
  }
  let scrutinytype = path ? "ocScrutinyDetails" : "scrutinyDetails";
  let occupancyType = get(
    state.screenConfiguration.preparedFinalObject,
    `${scrutinytype}.planDetail.virtualBuilding.occupancyTypes[0].type.name`
  );
  let plotArea = get(
    state.screenConfiguration.preparedFinalObject,
    `${scrutinytype}.planDetail.plot.area`
  );
  let buildingBlocks = get(
    state.screenConfiguration.preparedFinalObject,
    `${scrutinytype}.planDetail.blocks`
  );
  let blocks = buildingBlocks.map(item => {
    return item && item.building && item.building.buildingHeight;
  });
  let buildingHeight = Math.max(blocks);
  let riskType = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.BPA.RiskTypeComputation"
  );
  let block = get(
    state.screenConfiguration.preparedFinalObject,
    `${scrutinytype}.planDetail.blocks[0].building.occupancies[0].typeHelper.type`, []
  );
  // dispatch(prepareFinalObject("BPA.blocks", [block]));
  let scrutinyRiskType;
  if (
    plotArea < riskType[2].toPlotArea &&
    buildingHeight < riskType[2].toBuildingHeight
  ) {
    scrutinyRiskType = "LOW"
  } else if (
    (plotArea >= riskType[1].fromPlotArea && plotArea <= riskType[1].toPlotArea) ||
    (buildingHeight >= riskType[1].fromBuildingHeight && buildingHeight <= riskType[1].toBuildingHeight)) {
    scrutinyRiskType = "MEDIUM"
  } else if (
    (plotArea > riskType[0].fromPlotArea) ||
    (buildingHeight >= riskType[0].fromBuildingHeight)) {
    scrutinyRiskType = "HIGH"
  }
  // if(scrutinyRiskType === "LOW"){
  //   const tenantId = getQueryArg(window.location.href, "tenantId");
  //   const queryObject = [
  //     { key: "tenantId", value: tenantId },
  //     { key: "businessServices", value: "BPA_LOW" }
  //   ];
  //   setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  // }

  dispatch(prepareFinalObject("BPA.riskType", scrutinyRiskType));
  return scrutinyRiskType;
};

export const residentialType = (state, dispatch) => {
  let resType = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.BPA.OccupancyType[0].code"
  );
  if (resType) {
    dispatch(prepareFinalObject("BPA.occupancyType", resType));
  }
}

export const licenceType = async (state, dispatch) => {
  let tradeTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.TradeType", []
  );
  let userInfo = JSON.parse(getUserInfo());
  let roles = userInfo.roles;
  let numberOfRoles = [];
  roles.forEach(role => {
    numberOfRoles.push(role.code.split('_')[1]);
  })
  let tradeTypesCode = [];
  tradeTypes.forEach(type => {
    tradeTypesCode.push(type.code.split('.')[0]);
  });
  let filteredRoles = [];
  numberOfRoles.forEach(fRole => {
    tradeTypesCode.forEach(fcode => {
      if (fRole === fcode) {
        filteredRoles.push({ code: fRole });
      }
    })
  });
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  let unique = filteredRoles.filter(onlyUnique);
  if (unique && unique.length > 1) {
    dispatch(
      prepareFinalObject(`applyScreenMdmsData.licenceTypes`, unique)
    );
  }
}

export const getScrutinyDetails = async (state, dispatch, fieldInfo) => {
  try {
    const scrutinyNo = get(
      state.screenConfiguration.preparedFinalObject,
      `BPA.edcrNumber`,
      ""
    );
    let tenantId =
      getQueryArg(window.location.href, "tenantId") ||
      get(
        state.screenConfiguration.preparedFinalObject,
        "BPA.landInfo.address.city"
      );
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
      "/edcr/rest/dcr/scrutinydetails?edcrNumber=" +
      scrutinyNo +
      "&tenantId=" + tenantId,
      { }
    );
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId,
      },
      {
        key: "edcrNumber",
        value: scrutinyNo,
      }
    ];
    const bpaSearch = await httpRequest(
      "post",
      "bpa-services/v1/bpa/_search",
      "",
      queryObject
    );
    let isData = true;
    bpaSearch.BPA && bpaSearch.BPA.length > 0 &&
      bpaSearch.BPA.forEach((data, index) => {
        if ((data.edcrNumber === scrutinyNo) && ((data.status != "REJECTED") && (data.status != "PERMIT REVOCATION"))) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Application Number already exists",
                labelKey: "APPLICATION_NUMBER_ALREADY_EXISTS"
              },
              "error"
            )
          );
          isData = false;
        }
      })

    if (isData) {
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
          if (
            scrutinyData &&
            scrutinyData.planDetail &&
            scrutinyData.planDetail.applicationDate
          ) {
            scrutinyData.planDetail.applicationDate = convertDateTimeToEpoch(
              scrutinyData.planDetail.applicationDate
            );
            scrutinyData.lastModifiedDate = convertDateTimeToEpoch(
              scrutinyData.lastModifiedDate
            );
            scrutinyData.pwdExpiryDate = convertDateTimeToEpoch(
              scrutinyData.pwdExpiryDate
            );
          }

          const tenantId = get(
            state.screenConfiguration.preparedFinalObject,
            "BPA.landInfo.address.city"
          );
          let id = tenantId.split('.')[1];
          const city = scrutinyData[0].tenantId;

          if (tenantId === city) {
            let currOwnersArr = get(
              state.screenConfiguration.preparedFinalObject,
              "scrutinyDetails",
              []
            );
            currOwnersArr = scrutinyData[0];
            dispatch(prepareFinalObject(`scrutinyDetails`, currOwnersArr));
            let occupancyObj = get(currOwnersArr, "planDetail.occupancies[0].typeHelper.type", { });
            dispatch(prepareFinalObject("BPA.OccupanciesList", [occupancyObj]));
            dispatch(prepareFinalObject("scrutinyDetails.planDetail.planInformation.occupancies", occupancyObj.code));
            // await riskType(state, dispatch);
            await edcrDetailsToBpaDetails(state, dispatch);
            await residentialType(state, dispatch);
            await licenceType(state, dispatch);
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
        key: "consumerCodes",
        value: applicationNumber
      }
    ];

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/collection-services/payments/_search",
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

export const generateBillForBPA = async (dispatch, applicationNumber, tenantId, businessService) => {
  try {
    if (applicationNumber && tenantId) {
      const queryObj = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "consumerCode",
          value: applicationNumber
        },
        { key: "businessService", value: businessService }
      ];
      const payload = await createBill(queryObj, dispatch);
      if (payload && payload.Bill[0]) {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));
        const estimateData = createBpaEstimateData(payload.Bill[0]);
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

export const createBpaEstimateData = billObject => {
  const billDetails = billObject && billObject.billDetails;
  let fees =
    billDetails &&
    billDetails[0].billAccountDetails &&
    billDetails[0].billAccountDetails.map(item => {
      return {
        name: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode },
        value: item.amount,
        info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
      };
    });
  return fees;
};

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

export const getBpaTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Floor Description":
      return getLocaleLabels(
        "Floor Description",
        "BPA_COMMON_TABLE_COL_FLOOR_DES",
        localisationLabels
      );
    case "Level":
      return getLocaleLabels(
        "Level",
        "Level",
        // "BPA_COMMON_TABLE_COL_LEVEL",
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
        "BPA_COMMON_TABLE_COL_APP_NO",
        localisationLabels
      );

    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "BPA_COMMON_TABLE_COL_OWN_NAME_LABEL",
        localisationLabels
      );

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "BPA_COMMON_TABLE_COL_APP_DATE_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "BPA_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );

    case "INITIATED":
      return getLocaleLabels("Initiated,", "WF_BPA_INITIATED", localisationLabels);
    case "APPLIED":
      getLocaleLabels("Applied", "NOC_APPLIED", localisationLabels);
    case "PAID":
      getLocaleLabels("Paid", "WF_NEWTL_PENDINGAPPROVAL", localisationLabels);

    case "APPROVED":
      return getLocaleLabels(
        "Approved",
        "WF_BPA_APPROVED",
        localisationLabels
      );
    case "REJECTED":
      return getLocaleLabels(
        "Rejected",
        "WF_BPA_REJECTED",
        localisationLabels
      );
    case "PERMIT REVOCATION":
      return getLocaleLabels(
        "PERMIT REVOCATION",
        "WF_BPA_PERMIT REVOCATION",
        localisationLabels
      );
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "NOC_CANCELLED", localisationLabels);
    case "PENDINGAPPROVAL ":
      return getLocaleLabels(
        "Pending for Approval",
        "WF_BPA_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_BPA_PENDINGPAYMENT",
        localisationLabels
      );
    case "DOCUMENTVERIFY":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_BPA_DOCUMENTVERIFY",
        localisationLabels
      );
    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_BPA_FIELDINSPECTION",
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
    case "DOC_VERIFICATION_INPROGRESS":
      return getLocaleLabels(
        "Doc Verification Inprogress",
        "WF_BPA_DOC_VERIFICATION_INPROGRESS",
        localisationLabels
      );
    case "FIELDINSPECTION_INPROGRESS":
      return getLocaleLabels(
        "Field Inspection Inprogress",
        "WF_BPA_FIELDINSPECTION_INPROGRESS",
        localisationLabels
      );
    case "NOC_VERIFICATION_INPROGRESS":
      return getLocaleLabels(
        "Noc Verification Inprogress",
        "WF_BPA_NOC_VERIFICATION_INPROGRESS",
        localisationLabels
      );
    case "APPROVAL_INPROGRESS":
      return getLocaleLabels(
        "Approval Inprogress",
        "WF_BPA_APPROVAL_INPROGRESS",
        localisationLabels
      );
    case "PENDING_SANC_FEE_PAYMENT":
      return getLocaleLabels(
        "Pending Sanc Fee Payment",
        "WF_BPA_PENDING_SANC_FEE_PAYMENT",
        localisationLabels
      );
    case "INPROGRESS":
      return getLocaleLabels(
        "Inprogress",
        "WF_BPA_INPROGRESS",
        localisationLabels
      );
    case "PENDING_APPL_FEE":
      return getLocaleLabels(
        "Pedding Application Fee",
        "WF_BPA_PENDING_APPL_FEE",
        localisationLabels
      );
    case "CITIZEN_APPROVAL_INPROCESS":
      return getLocaleLabels(
        "Inprogress",
        "WF_BPA_CITIZEN_APPROVAL_INPROCESS",
        localisationLabels
      );
    case "PENDING_FEE":
      return getLocaleLabels(
        "Pending Fee Payment",
        "WF_BPA_PENDING_FEE",
        localisationLabels
      );
    case "CITIZEN_ACTION_PENDING_AT_DOC_VERIF":
      return getLocaleLabels(
        "Send Back From Doc Verification",
        "WF_BPA_CITIZEN_ACTION_PENDING_AT_DOC_VERIF",
        localisationLabels
      );
    case "CITIZEN_ACTION_PENDING_AT_FI_VERIF":
      return getLocaleLabels(
        "Send Back From Field Inspection",
        "WF_BPA_CITIZEN_ACTION_PENDING_AT_FI_VERIF",
        localisationLabels
      );
    case "CITIZEN_ACTION_PENDING_AT_NOC_VERIF":
      return getLocaleLabels(
        "Send Back From Noc Verification",
        "WF_BPA_CITIZEN_ACTION_PENDING_AT_NOC_VERIF",
        localisationLabels
      );
    case "BPA_COL_APP_STATUS":
      return getLocaleLabels(
        "Application Status",
        "BPA_COL_APP_STATUS",
        localisationLabels
      );
    case "BPA_COL_MODULE_SERVICE":
      return getLocaleLabels(
        "Module/Service",
        "BPA_COL_MODULE_SERVICE",
        localisationLabels
      );
    case "BPA_COMMON_SLA":
      return getLocaleLabels(
        "SLA(Days Remaining)",
        "BPA_COMMON_SLA",
        localisationLabels
      );
    case "BPA_COL_ASSIGNEDTO":
      return getLocaleLabels(
        "Assigned To",
        "BPA_COL_ASSIGNEDTO",
        localisationLabels
      );
    case "BPAREG_SERVICE":
      return getLocaleLabels(
        "Stake Holder",
        "BPAREG_SERVICE",
        localisationLabels
      );
    case "BPA_APPLY_SERVICE":
      return getLocaleLabels(
        "BPA Apply",
        "BPA_APPLY_SERVICE",
        localisationLabels
      );
    case "WF_BPA_BUILDING_PLAN_SCRUTINY":
      return getLocaleLabels(
        "Building Plan Scrutiny",
        "WF_BPA_BUILDING_PLAN_SCRUTINY",
        localisationLabels
      );
    case "WF_BPA_BUILDING_OC_PLAN_SCRUTINY":
      return getLocaleLabels(
        "Building Plan OC Scrutiny",
        "WF_BPA_BUILDING_OC_PLAN_SCRUTINY",
        localisationLabels
      );
    case "WF_BPA_NEW_CONSTRUCTION":
      return getLocaleLabels(
        "New Contruction",
        "WF_BPA_NEW_CONSTRUCTION",
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

export const showCitizenApplyCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["citizen"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("citizen", "components.cityPickerDialog", "props.open", !toggle)
  );
}

const city = (state, dispatch, tenantId) => {
  let city = get(
    state.screenConfiguration.preparedFinalObject,
    "BPAs[0].BPADetails.plotdetails.citytown"
  );
  if (!city) {
    dispatch(
      prepareFinalObject("BPAs[0].BPADetails.plotdetails.citytown", tenantId)
    );
  }
};
export const gotoHome = (state, dispatch) => {
  showComparisonDialog(state, dispatch);
  dispatch(
    setRoute(
      `/`
    )
  )
};

export const applyForm = (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId"
  );

  const ocCityPicker = get(
    state.screenConfiguration.screenConfig,
    "home.components.cityPickerDialogForOC.props.open", false
  );
  if (ocCityPicker) {
    const isOcCityValid = validateFields(
      "components.cityPickerDialogForOC.children.dialogContent.children.popup.children.cityPicker.children",
      state,
      dispatch,
      "home"
    );

    if (isOcCityValid) {
      window.location.href =
        process.env.NODE_ENV === "production"
          ? `/citizen/oc-bpa/apply?tenantId=${tenantId}`
          : process.env.REACT_APP_SELF_RUNNING === true
            ? `/egov-ui-framework/oc-bpa/apply?tenantId=${tenantId}`
            : `/oc-bpa/apply?tenantId=${tenantId}`;
    };
  } else {
    const isTradeDetailsValid = validateFields(
      "components.cityPickerDialog.children.dialogContent.children.popup.children.cityPicker.children",
      state,
      dispatch,
      "home"
    );

    if (isTradeDetailsValid) {
      window.location.href =
        process.env.NODE_ENV === "production"
          ? `/citizen/egov-bpa/apply?tenantId=${tenantId}`
          : process.env.REACT_APP_SELF_RUNNING === true
            ? `/egov-ui-framework/egov-bpa/apply?tenantId=${tenantId}`
            : `/egov-bpa/apply?tenantId=${tenantId}`;
    };
  }

  city(state, dispatch, tenantId);
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
    console.log(error, "fetxh");
  }
};

export const setNameOfUser = (action, state, dispatch) => {
  let userInfo = JSON.parse(getUserInfo());
  let { name } = userInfo;
  if (name) {
    dispatch(
      prepareFinalObject("Licenses[0].tradeLicenseDetail.owners[0].name", name)
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardSecondStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.ownerName.props.disabled`,
      true
    );
  }
};

export const getBpaMdmsData = async (action, state, dispatch, mdmsBody) => {
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};

export const showHideBpaMapPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.mapsDialog.props.open",
    false
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.mapsDialog",
      "props.open",
      !toggle
    )
  );
};

export const getBpaMapLocator = textSchema => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-bpa",
    componentPath: "MapLocator",
    props: { }
  };
};

export const geBpatDetailsFromProperty = async (state, dispatch) => {
  try {
    const propertyId = get(
      state.screenConfiguration.preparedFinalObject,
      "BPA.propertyId",
      ""
    );
    const cityId = get(
      state.screenConfiguration.preparedFinalObject,
      "BPAs[0].BPADetails.plotdetails.citytown.value",
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
        { }
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
              "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocPropertyID",
              "props.value",
              ""
            )
          );
        } else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
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
              "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.children.cityDropdown",
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

const tenantData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "citymodule" }]
        }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
}

export const getTenantMdmsData = async (action, state, dispatch) => {

  const mdmsRes = await tenantData(action, state, dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "BPAAPPLY") return true;
    });
  dispatch(
    prepareFinalObject(
      "citiesByModule.TL",
      tenants
    )
  );
};


export const getMdmsDataForBpa = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return { };
  }
};

export const requiredDocumentsData = async (state, dispatch, action) => {
  try {
    let mdmsData = get(
      state.screenConfiguration.preparedFinalObject,
      "applyScreenMdmsData"
    );
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "tenantId", value: tenantId }
    ];
    const wfPayload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObject
    );
    const wfState = wfPayload.ProcessInstances[0];
    let appState;
    const appWfState = wfState.state.state;
    dispatch(prepareFinalObject("applicationProcessInstances", get(wfPayload, "ProcessInstances[0]")));

    let requiredDocuments, appDocuments = [];
    if (mdmsData && mdmsData.BPA && wfState) {
      let documents = mdmsData.BPA.DocTypeMapping;
      let requiredDocTypes;
      // documents.forEach( doc => {
      //   if(doc.WFState === wfState.state.state){
      appState = appWfState;
      //   }
      // });
    };
    let proInstance = wfPayload.ProcessInstances[0];
    let nextActions = get(proInstance, "nextActions");
    let isVisibleTrue = false;
    if (nextActions && nextActions.length > 0) isVisibleTrue = true;
    prepareDocumentsView(state, dispatch, action, appState, isVisibleTrue);
    let permitList = get(state.screenConfiguration.preparedFinalObject, "BPA.additionalDetails.pendingapproval");
    if (permitList && permitList.length > 0) {
      let riskType = get(
        state,
        "screenConfiguration.preparedFinalObject.BPA.riskType", ""
      );
      if (riskType && riskType != "LOW") {
        set(
          action,
          "screenConfig.components.div.children.body.children.cardContent.children.permitListSummary.visible",
          true
        );
        dispatch(prepareFinalObject("permitList", permitList));
      }
    }
    if (isVisibleTrue && wfState.state.state == "FIELDINSPECTION_PENDING" && mdmsData && mdmsData.BPA && mdmsData.BPA.CheckList) {
      let fieldInfoDocs = mdmsData.BPA.CheckList;
      prepareFieldDocumentsUploadData(state, dispatch, action, fieldInfoDocs, appWfState);
    }
    let riskType = get(
      state,
      "screenConfiguration.preparedFinalObject.BPA.riskType", ""
    );
    if (isVisibleTrue && wfState.state.state == "PENDINGAPPROVAL" && mdmsData && mdmsData.BPA && mdmsData.BPA.CheckList) {
      if (riskType && riskType !== "LOW") {
        let checkListConditions = mdmsData.BPA.CheckList;
        prepareapprovalQstns(state, dispatch, action, checkListConditions, appWfState);
      }
    }
    await prepareNOCUploadData(state, dispatch);
    await prepareNocFinalCards(state, dispatch, isVisibleTrue);
  } catch (e) {
    console.log(e);
  }
}

const prepareapprovalQstns = async (state, dispatch, action, checkListConditions, appWfState) => {
  let bpaAppDetails = get(state.screenConfiguration.preparedFinalObject, "BPA", { });
  let approvalQuastions = [];
  checkListConditions.forEach(wfDoc => {
    if (wfDoc.WFState == appWfState && wfDoc.RiskType === bpaAppDetails.riskType && wfDoc.ServiceType === bpaAppDetails.serviceType && wfDoc.applicationType === bpaAppDetails.applicationType) {
      approvalQuastions = wfDoc.conditions;
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.permitConditions.visible",
        true
      );
    }
  });
  let approvalConditions = approvalQuastions;
  let approvalConditionsWithValue = [];
  approvalConditions.forEach(condtn => {
    approvalConditionsWithValue.push({
      condition: condtn,
      conditionValue: false
    })
  })
  if (approvalConditions && approvalConditions.length > 0) {
    dispatch(prepareFinalObject("permitConditions", approvalConditionsWithValue));
  }
}

const prepareFieldDocumentsUploadData = async (state, dispatch, action, fieldInfoDocs, appWfState) => {
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );

  let appState = get(
    state.screenConfiguration.preparedFinalObject, "BPA.status",
    []
  )

  let bpaAppDetails = get(state.screenConfiguration.preparedFinalObject, "BPA", { });

  let fieldInfo = []
  fieldInfoDocs.forEach(wfDoc => {
    if (wfDoc.WFState == appWfState && wfDoc.RiskType === bpaAppDetails.riskType && wfDoc.ServiceType === bpaAppDetails.serviceType && wfDoc.applicationType === bpaAppDetails.applicationType) {
      fieldInfo.push({ "docTypes": wfDoc.docTypes, "questions": wfDoc.questions });
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.fieldinspectionSummary.visible",
        true
      );
    }
  });

  let fieldreqDocuments = fieldInfo[0].docTypes;
  let applyFieldinspectionQstns = fieldInfo[0].questions;
  let checklistSelect = [];

  if (applyFieldinspectionQstns && applyFieldinspectionQstns.length > 0) {
    checklistSelect = [
      { code: applyFieldinspectionQstns[0].fieldType.split("/")[0], label: `BPA_ADD_HOC_CHARGES_POPUP_BUTTON_${applyFieldinspectionQstns[0].fieldType.split("/")[0]}` },
      { code: applyFieldinspectionQstns[0].fieldType.split("/")[1], label: `BPA_ADD_HOC_CHARGES_POPUP_BUTTON_${applyFieldinspectionQstns[0].fieldType.split("/")[1]}` },
      { code: applyFieldinspectionQstns[0].fieldType.split("/")[2], label: `BPA_ADD_HOC_CHARGES_POPUP_BUTTON_${applyFieldinspectionQstns[0].fieldType.split("/")[2]}` }
    ];

    const FieldinspectionQstns = applyFieldinspectionQstns.map(v => ({
      code: v.question, title: v.question, cards: [{
        name: v.question, code: v.question, required: true, dropDownValues: {
          label: "BPA_SELECT_LABEL", required: true, menu: checklistSelect
        }
      }]
    }));

    dispatch(prepareFinalObject("FieldinspectionQstns", FieldinspectionQstns));
  }

  if (fieldreqDocuments && fieldreqDocuments.length > 0) {
    let documentsList = [];
    fieldreqDocuments.forEach(doc => {
      let code = doc.code;
      doc.dropDownValues = [];
      documentsDropDownValues.forEach(value => {
        let values = value.code.slice(0, code.length);
        if (code === values) {
          doc.hasDropdown = true;
          doc.dropDownValues.push(value);
        }
      });
      documentsList.push(doc);
    });
    const docList = documentsList.filter((el) => {
      return fieldreqDocuments.some((f) => {
        return f.code === el.code;
      });
    });
    const bpaDocuments = docList;
    let documentsContract = [];
    let tempDoc = { };

    bpaDocuments.forEach(doc => {
      let card = { };
      card["code"] = doc.code.split(".")[0];
      card["title"] = doc.code.split(".")[0];
      card["cards"] = [];
      tempDoc[doc.code.split(".")[0]] = card;
    });
    bpaDocuments.forEach(doc => {
      let card = { };
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropDownValues) {
        let dropDownValues = { };
        dropDownValues.label = "BPA_SELECT_DOCS_LABEL";
        dropDownValues.required = doc.required ? true : false;
        dropDownValues.menu = doc.dropDownValues.filter(item => {
          return item.active;
        });
        dropDownValues.menu = dropDownValues.menu.map(item => {
          return { code: item.code, label: item.code };
        });
        card["dropDownValues"] = dropDownValues;
      }
      tempDoc[doc.code.split(".")[0]].cards.push(card);
    });

    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });
    let applyFieldinspectionDocument = [];
    documentsContract.forEach(doc => {
      applyFieldinspectionDocument.push(doc);
    });
    dispatch(prepareFinalObject("nocDocumentsContract", applyFieldinspectionDocument));
  }
}
const documentMaping = async (state, dispatch, action, documentsPreview) => {
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : { };
  let documentsPreviews = documentsPreview.map((doc, index) => {
    doc["link"] =
      (fileUrls &&
        fileUrls[doc.fileStoreId] &&
        getFileUrl(fileUrls[doc.fileStoreId])) ||
      "";
    doc["name"] =
      (fileUrls[doc.fileStoreId] &&
        decodeURIComponent(
          getFileUrl(fileUrls[doc.fileStoreId])
            .split("?")[0]
            .split("/")
            .pop()
            .slice(13)
        )) ||
      `Document - ${index + 1}`;
    return doc;
  });
  return documentsPreviews;
}
const prepareDocumentsView = async (state, dispatch, action, appState, isVisibleTrue) => {
  let documentsPreview = [];

  // Get all documents from response
  let BPA = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA",
    { }
  );

  let applicantDocuments = jp.query(
    BPA,
    "$.documents.*"
  );

  let uploadedAppDocuments = [];
  let otherDocuments = jp.query(
    BPA,
    "$.additionalDetail.documents.*"
  );
  let allDocuments = [
    // ...buildingDocuments,
    ...applicantDocuments,
    ...otherDocuments
  ];
  let additionalDetail = BPA.additionalDetails,
    fieldInspectionDetails, fieldInspectionDocs = [], fieldInspectionsQstions = [];
  if (additionalDetail && additionalDetail["fieldinspection_pending"] && additionalDetail["fieldinspection_pending"].length > 0) {
    fieldInspectionDetails = additionalDetail["fieldinspection_pending"][0]
    fieldInspectionDocs = fieldInspectionDetails.docs;
    fieldInspectionsQstions = fieldInspectionDetails.questions;
  }

  if (fieldInspectionDocs && fieldInspectionDocs.length > 0 && fieldInspectionsQstions && fieldInspectionsQstions.length > 0) {
    let fiDocumentsPreview = [];
    fieldInspectionDocs.forEach(fiDoc => {
      fiDocumentsPreview.push({
        title: getTransformedLocale(fiDoc.documentType),
        fileStoreId: fiDoc.fileStoreId,
        linkText: "View"
      });
    })

    let fieldInspectionDocuments = await documentMaping(state, dispatch, action, fiDocumentsPreview);
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.fieldSummary.visible",
      true
    );
    dispatch(prepareFinalObject("fieldInspectionDocumentsDetailsPreview", fieldInspectionDocuments));
    dispatch(prepareFinalObject("fieldInspectionCheckListDetailsPreview", fieldInspectionsQstions));
  }
  let fileStoreIds = jp.query(allDocuments, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : { };
  allDocuments.map((doc, index) => {
    uploadedAppDocuments.push(doc);
    let obj = { };
    obj.title = getTransformedLocale(doc.documentType);
    obj.fileStoreId = doc.fileStoreId;
    obj.linkText = "View";
    obj.wfState = doc.wfState;
    if (doc.auditDetails) {
      obj["createdTime"] = doc.auditDetails.createdTime;
    }

    obj["link"] =
      (fileUrls &&
        fileUrls[doc.fileStoreId] &&
        getFileUrl(fileUrls[doc.fileStoreId])) ||
      "";
    obj["name"] =
      (fileUrls[doc.fileStoreId] &&
        decodeURIComponent(
          getFileUrl(fileUrls[doc.fileStoreId])
            .split("?")[0]
            .split("/")
            .pop()
            .slice(13)
        )) ||
      `Document - ${index + 1}`;
    obj.createdBy = getLoggedinUserRole(doc.wfState);
    obj.additionalDetails = doc.additionalDetails;
    // if(!doc.createdBy){
    //   if (doc.wfState === "SEND_TO_CITIZEN") {
    //     obj.createdBy = "BPA Architect"
    //   }
    //   else if(doc.wfState === "DOC_VERIFICATION_PENDING") {
    //     obj.createdBy = "BPA Document Verifier"
    //   }
    //   else if (doc.wfState === "FIELDINSPECTION_PENDING") {
    //     obj.createdBy = "BPA Field Inspector"   
    //   }
    //   else if (doc.wfState === "NOC_VERIFICATION_PENDING") {
    //     obj.createdBy = "BPA Noc Verifier"    
    //   } else {
    //     obj.createdBy = "BPA Architect"
    //   }
    // } else {
    //   obj.createdBy = doc.createdBy
    // }

    obj['auditDetails'] = doc.auditDetails;
    documentsPreview.push(obj);
    return obj;
  });
  dispatch(prepareFinalObject("documentDetailsPreview", documentsPreview));
  let previewDocuments = [];
  let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
  prepareDocsInEmployee(state, dispatch, action, appState, uploadedAppDocuments, documentsPreview, isVisibleTrue);
  // if((isEmployee && isVisibleTrue) || (!isEmployee && isVisibleTrue)) {
  //   prepareDocsInEmployee(state, dispatch, action, appState, uploadedAppDocuments, documentsPreview);
  // } else {
  //   prepareFinalCards(state, dispatch, documentsPreview, [] )
  // }


};
const getRequiredMdmsCards = (state, dispatch) => {
  const bpaDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "BPA",
    { }
  );

  let documentMapping = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.DocTypeMapping",
    []
  );

  let documentType = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );
};

/**
 * This method will be called to get the current role of logged-in user
 * @param {String} wfState 
 * @returns {String} currentRole
 */
export const getLoggedinUserRole = (wfState) => {
  let userInfo = JSON.parse(getUserInfo()),
    roles = get(userInfo, "roles"),
    currentRole,
    isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;

  if (roles && roles.length == 1) {
    currentRole = roles[0].name;

  } else if (roles && roles.length > 1) {
    if (isEmployee) {
      if (wfState) {
        wfState = wfState.state;
        if (wfState === "SEND_TO_CITIZEN") {
          currentRole = "BPA_ARCHITECT"
        }
        else if (wfState === "DOC_VERIFICATION_PENDING") {
          currentRole = "BPA_DOC_VERIFIER"
        }
        else if (wfState === "FIELDINSPECTION_PENDING") {
          currentRole = "BPA_FIELD_INSPECTOR"
        }
        else if (wfState === "NOC_VERIFICATION_PENDING") {
          currentRole = "BPA_NOC_VERIFIER"
        }
        else if (window.location.href.includes("noc-search-preview")) {
          currentRole = "BPA_F_NOC_VERIFIER"
        }
        else {
          currentRole = "BPA_ARCHITECT"
        }
      }

    } else {
      currentRole = roles.find((code) => code == "BPA_ARCHITECT")
      if (!currentRole) {
        currentRole = roles[0].name;
      } else {
        currentRole = currentRole.name;
      }
    }
  }

  return currentRole;
};

const getEditableUserRoleforNoc = (state, isVisibleTrue) => {
  let userInfo = JSON.parse(getUserInfo()),
    roles = get(userInfo, "roles"),
    allowedToUpload = false;
  // let processInstances = get(
  //   state,
  //   "screenConfiguration.preparedFinalObject.applicationProcessInstances",
  //   {}
  // );
  // if(processInstances){
  //  if(processInstances.nextActions.length > 0){
  //   allowedToUpload = true;
  //  }
  // }
  let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
  roles.map(role => {
    if (isEmployee && isVisibleTrue && (role.code == "BPA_NOC_VERIFIER")) {
      allowedToUpload = true;
    }
    if (
      window.location.href.includes("egov-bpa/apply") ||
      window.location.href.includes("oc-bpa/apply")) {
      allowedToUpload = true;
    }
  })

  return allowedToUpload;
}

const getUploadedDocsFromNoc = (state, dispatch) => {
  let nocAppDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.Noc",
    []
  );
  let applicantDocuments = [];
  nocAppDetails.forEach(nocDoc => {
    let documents = jp.query(
      nocDoc,
      "$.documents.*"
    );
    if (documents) {
      applicantDocuments.push(documents)
    }
  });
  return applicantDocuments;
}

export const prepareNocDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  let allDocuments = await getUploadedDocsFromNoc(state, dispatch);
  var uploadedAppDocuments = [];
  let fileStoreIds = jp.query(allDocuments, "$.*..fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : { };
  allDocuments.map((doc) => {
    doc.map((docs, index) => {
      uploadedAppDocuments.push(docs);
      let obj = { };

      obj.title = getTransformedLocale(docs.documentType);
      obj.fileStoreId = docs.fileStoreId;
      obj.linkText = "View";
      if (docs.auditDetails) {
        obj["createdTime"] = docs.auditDetails.createdTime;
      }

      obj["link"] =
        (fileUrls &&
          fileUrls[docs.fileStoreId] &&
          getFileUrl(fileUrls[docs.fileStoreId])) ||
        "";
      obj["name"] =
        (fileUrls[docs.fileStoreId] &&
          decodeURIComponent(
            getFileUrl(fileUrls[docs.fileStoreId])
              .split("?")[0]
              .split("/")
              .pop()
              .slice(13)
          )) ||
        `Document - ${index + 1}`;
      obj.createdBy = getLoggedinUserRole(docs.wfState);
      obj.additionalDetails = docs.additionalDetails;
      obj['auditDetails'] = docs.auditDetails;
      // obj = Object.assign(docs);
      documentsPreview.push(obj);
      return obj;
    })
  });
  dispatch(prepareFinalObject("nocDocumentDetailsPreview", documentsPreview));
  return documentsPreview;
};

export const prepareNocFinalCards = async (state, dispatch, isVisibleTrue) => {
  let mdmsNocDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NOC.DocumentTypeMapping",
    []
  );
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );
  let nocAppDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.Noc",
    { }
  );

  let nocDocumentsContract = get(
    state,
    "screenConfiguration.preparedFinalObject.nocBPADocumentsContract",
    { }
  );

  let nocDocuments = { };
  var uploadedAppDocuments = [];
  let requiredDocTypesFromMdms = [],
    nocDocsFromMdms = [];
  nocAppDetails.forEach(nocDoc => {
    mdmsNocDocuments.forEach(mdmsData => {
      if (mdmsData.applicationType === nocDoc.applicationType && mdmsData.nocType === nocDoc.nocType) {
        nocDocsFromMdms.push(mdmsData);
        nocDocuments[nocDoc.nocType] = mdmsData.docTypes;
        //  nocDocuments[nocDoc.nocType]['documents'] = nocDoc.documents;
        requiredDocTypesFromMdms.push(mdmsData.nocType);
      }
    });
  });
  console.log('nocDocsFromMdms', nocDocsFromMdms);

  let documentsList = [],
    finalDoc = { },
    finalNocDocs = [];
  for (let item in nocDocuments) {
    let documents = nocDocuments[item];
    if (documents && documents.length > 0) {

      documents.forEach(doc => {
        let card = { };
        card["code"] = doc.documentType.split(".")[0];
        card["title"] = doc.documentType.split(".")[0];
        card["cards"] = [];
        card["nocType"] = doc.nocType;
        finalDoc[doc.documentType.split(".")[0]] = card;
      });

      documents.map(doc => {
        doc.dropDownValues = [];
        documentsDropDownValues.forEach(value => {
          let values = value.code.slice(0, doc.documentType.length);
          if (doc.documentType === values) {
            doc.hasDropdown = true;
            doc.dropDownValues.push(value);
          }
        });
        documentsList.push(doc);
      })
    }
  }

  documentsList.forEach(doc => {
    let card = { };
    card["name"] = doc.documentType;
    card["code"] = doc.documentType;
    card["nocType"] = doc.nocType;
    card["required"] = doc.required ? true : false;
    if (doc.hasDropdown && doc.dropDownValues) {
      let dropDownValues = { };
      dropDownValues.label = "BPA_SELECT_DOCS_LABEL";
      dropDownValues.required = doc.required;
      dropDownValues.menu = doc.dropDownValues.filter(item => {
        return item.active;
      });
      dropDownValues.menu = dropDownValues.menu.map(item => {
        return { code: item.code, label: item.code };
      });
      card["dropDownValues"] = dropDownValues;
    }
    finalDoc[doc.documentType.split(".")[0]].cards.push(card);
  });
  if (finalDoc) {
    Object.keys(finalDoc).forEach(key => {
      finalNocDocs.push(finalDoc[key]);
    });
  }

  let finalDocuments = [],
    documentsContract = finalNocDocs;
  if (documentsContract && documentsContract.length > 0) {

    let documentsCodes = [], nocBpaDocuments = [];

    documentsContract.forEach(documents => {
      documents.cards.forEach(cardDoc => {
        documentsCodes.push(cardDoc.code);
      });
    });

    let documentsDocTypes = [];
    uploadedAppDocuments.forEach(appDoc => {
      if (appDoc && appDoc.documentType) {
        let code = (appDoc.documentType).split('.')[0] + '.' + (appDoc.documentType).split('.')[1]
        documentsDocTypes.push(code);
      }
    });

    function comparer(otherArray) {
      return function (current) {
        return otherArray.filter(function (other) {
          return other == current
        }).length == 0;
      }
    }

    let result;
    if (documentsDocTypes && documentsDocTypes.length > 0) {
      documentsCodes.map(docs => {
        documentsDocTypes.map(doc => {
          if (docs === doc) {
            documentsContract[0].cards.map(items => {
              if (items && items.code === doc) return items.required = false;
            })
          }
        })
        return docs;
      })
      result = documentsCodes;
    } else {
      result = documentsCodes;
    }

    let finalDocs = [];

    documentsContract.forEach(doc => {
      let cards = [];
      for (let i = 0; i < result.length > 0; i++) {
        let codes = result[i];
        doc.cards.forEach(docCards => {
          if (docCards.code === codes) {
            cards.push(docCards);
          }
        })
      }
      finalDocs.push({
        cards: cards,
        code: doc.code,
        title: doc.code
      });
    });


    if (finalDocs && finalDocs.length > 0) {
      finalDocs.forEach(fDoc => {
        if (fDoc && fDoc.cards && fDoc.cards.length > 0) {
          finalDocuments.push(fDoc);
        }
      })
    };

    let nocDocs = [], appDocs = [];
    if (finalDocuments && finalDocuments.length > 0) {
      finalDocuments.forEach(finalDoc => {
        if (finalDoc.code == "NOC") {
          nocDocs.push(finalDoc);
        } else {
          appDocs.push(finalDoc);
        }
      })
    }


    dispatch(prepareFinalObject("nocfinalcards", finalNocDocs));

  }
  let nocDocumentsContractFinal = await prepareNocDocumentsView(state, dispatch);
  dispatchFinalNocCardsForPreview(state, dispatch, nocDocumentsContractFinal, finalNocDocs, isVisibleTrue)
}

const dispatchFinalNocCardsForPreview = (state, dispatch, nocDocuments, nocDocumentsFromMdms, isVisibleTrue) => {
  // let mdmsCards = getRequiredMdmsCards(state, dispatch);
  let cards = [];
  let documentCards = get(
    state,
    "screenConfiguration.preparedFinalObject.nocBPADocumentsContract",
    { }
  );
  let cardReadOnly = getEditableUserRoleforNoc(state, isVisibleTrue);
  console.log(cardReadOnly);
  //let cardReadOnly = false;
  if (documentCards && documentCards.length > 0) {
    cards = documentCards[0].cards;
  }

  for (var i = 0; i < cards.length; i++) {
    cards[i].documents && cards[i].documents.length &&
      cards[i].documents.map(fidocs => {
        nocDocuments && nocDocuments.length &&
          nocDocuments.forEach(doc => {
            if (doc.fileStoreId === fidocs.fileStoreId) {
              fidocs.link = get(doc, "link");
              fidocs.name = get(doc, "name");
            }
          })
      })
  }

  if (nocDocumentsFromMdms && nocDocumentsFromMdms.length > 0) {
    const allCards = [].concat(...nocDocumentsFromMdms.map(({ cards }) => cards || []));
    allCards && allCards.map((mdmsCard) => {
      let found = false;
      for (var i = 0; i < cards.length; i++) {

        if (mdmsCard.code == cards[i].code) {
          cards[i].readOnly = !cardReadOnly;
          let mergedCard = { ...cards[i], ...mdmsCard };
          cards[i] = { ...mergedCard };
          found = true;
        } else {
          cards[i].readOnly = !cardReadOnly;
        }

      }
      if (!found) {
        mdmsCard['readOnly'] = !cardReadOnly;
        cards.push(mdmsCard)
      }
    });


    cards.sort(compare);
  }
  dispatch(prepareFinalObject("nocForPreview", cards));

}
export const compare = (a, b) => {
  // Use toUpperCase() to ignore character casing
  const nocTypeA = a.nocType.toUpperCase();
  const nocTypeB = b.nocType.toUpperCase();
  let comparison = 0;
  if (nocTypeA > nocTypeB) {
    comparison = 1;
  } else if (nocTypeA < nocTypeB) {
    comparison = -1;
  }
  return comparison;
}
const prepareFinalCards = (state, dispatch, documentsPreview, requiredDocsFromMdms, isVisibleTrue) => {
  // let mdmsCards = getRequiredMdmsCards(state, dispatch);
  let cards = [];
  documentsPreview.forEach((item) => {
    item.documentCode = getDocumentCode(item.title)
  }
  )
  let documentCards = groupBy(documentsPreview, 'documentCode');
  let bpaDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "BPA",
    { }
  );
  let cardReadOnly = false;
  if (bpaDetails.status == "INPROGRESS") {
    cardReadOnly = true;
  }

  let sendBackCitizen = true;
  if (bpaDetails.status && bpaDetails.status.includes("CITIZEN_ACTION_PENDING")) {
    sendBackCitizen = false;
  }

  if (get(bpaDetails, "status") === "DOC_VERIFICATION_INPROGRESS" && isVisibleTrue) {
    isVisibleTrue = true;
  } else {
    isVisibleTrue = false;
  }

  documentCards && Object.keys(documentCards).map((doc) => {
    let card = {
      documentCode: doc,
      documents: documentCards[doc],
      wfState: documentCards[doc].wfState,
      readOnly: true
    }
    cards.push(card);
  });
  if (requiredDocsFromMdms.length > 0) {
    const allCards = [].concat(...requiredDocsFromMdms.map(({ cards }) => cards || []));

    allCards && allCards.map((mdmsCard) => {
      let found = false;
      mdmsCard.documentCode = getTransformedLocale(mdmsCard.code);
      for (var i = 0; i < cards.length; i++) {
        if (mdmsCard.documentCode == cards[i].documentCode) {
          let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
          cards[i].readOnly = isEmployee ? !isVisibleTrue : sendBackCitizen; //(cardReadOnly || !mdmsCard.allow);
          let mergedCard = { ...cards[i], ...mdmsCard };
          cards[i] = { ...mergedCard };
          found = true;
        }
      }

      if (!found) {
        let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
        mdmsCard.readOnly = isEmployee ? !isVisibleTrue : sendBackCitizen;//(cardReadOnly || !mdmsCard.allow);
        cards.push(mdmsCard)
      }
    });
  }
  /**
   * @Todo should be handled at component level
   */
  cards.map(card => {
    if (card.documents) {
      card.documents.map(item => {
        if (!item.fileName) {
          item.fileName = item.name;
        }
      })
    }
  });
  cards.sort(documentsSorting);
  dispatch(prepareFinalObject("finalCardsforPreview", cards));

}
/**
 * 
 * @param {String} documentType 
 * Eg: APPL_ADDRESSPROOF_ELECTRICITYBILL 
 * retrun APPL_ADDRESSPROOF
 */
const getDocumentCode = (documentType) => {
  var code = getTransformedLocale(documentType);
  code = code.substring(0, code.lastIndexOf("_"));
  return code;
}
export const prepareDocsInEmployee = (state, dispatch, action, appState, uploadedAppDocuments, documentsPreview, isVisibleTrue) => {
  let applicationDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.DocTypeMapping",
    []
  );
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );
  let bpaAppDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA",
    { }
  );

  let documents = [];
  let bpaStatus = get(bpaAppDetails, "status");
  let bpaStatusAction = bpaStatus && get(bpaAppDetails, "status").includes("CITIZEN_ACTION_PENDING");
  if (bpaStatusAction) {
    appState = "INITIATED";
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.applyDocSummary.children.cardContent.children.documentDetailsCard.visible",
      false
    );
  }
  applicationDocuments.forEach(doc => {
    if (doc.WFState == appState && doc.RiskType === bpaAppDetails.riskType && doc.ServiceType === bpaAppDetails.serviceType && doc.applicationType === bpaAppDetails.applicationType) {
      documents.push(doc.docTypes)
    }
  });

  let documentsList = [];
  if (documents[0] && documents[0].length > 0) {
    documents[0].forEach(doc => {
      let code = doc.code;
      doc.dropDownValues = [];
      documentsDropDownValues.forEach(value => {
        let values = value.code.slice(0, code.length);
        if (code === values) {
          doc.hasDropdown = true;
          doc.dropDownValues.push(value);
        }
      });
      documentsList.push(doc);
    });
  }
  const bpaDocuments = documentsList;
  let documentsContract = [];
  let tempDoc = { };

  if (bpaDocuments && bpaDocuments.length > 0) {
    bpaDocuments.forEach(doc => {
      let card = { };
      card["code"] = doc.code.split(".")[0];
      card["title"] = doc.code.split(".")[0];
      card["cards"] = [];
      tempDoc[doc.code.split(".")[0]] = card;
    });
    bpaDocuments.forEach(doc => {
      let card = { };
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      card["allow"] = (doc.allow && JSON.parse(doc.allow)) ? true : false;
      card["orderNumber"] = get(doc, "order");
      if (doc.hasDropdown && doc.dropDownValues) {
        let dropDownValues = { };
        dropDownValues.label = "BPA_SELECT_DOCS_LABEL";
        dropDownValues.required = doc.required;
        dropDownValues.menu = doc.dropDownValues.filter(item => {
          return item.active;
        });
        dropDownValues.menu = dropDownValues.menu.map(item => {
          return { code: item.code, label: item.code };
        });
        card["dropDownValues"] = dropDownValues;
      }
      tempDoc[doc.code.split(".")[0]].cards.push(card);
    });
  }

  if (tempDoc) {
    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });
  }
  let finalDocuments = [];
  if (documentsContract && documentsContract.length > 0) {

    let documentsCodes = [], nocBpaDocuments = [];

    documentsContract.forEach(documents => {
      documents.cards.forEach(cardDoc => {
        documentsCodes.push(cardDoc.code);
      });
    });

    let documentsDocTypes = [];
    uploadedAppDocuments.forEach(appDoc => {
      if (appDoc && appDoc.documentType) {
        let code = (appDoc.documentType).split('.')[0] + '.' + (appDoc.documentType).split('.')[1]
        documentsDocTypes.push(code);
      }
    });

    function comparer(otherArray) {
      return function (current) {
        return otherArray.filter(function (other) {
          return other == current
        }).length == 0;
      }
    }

    let result;
    if (documentsDocTypes && documentsDocTypes.length > 0) {
      documentsCodes.map(docs => {
        documentsDocTypes.map(doc => {
          if (docs === doc) {
            documentsContract[0].cards.map(items => {
              if (items && items.code === doc) return items.required = false;
            })
          }
        })
        return docs;
      })
      result = documentsCodes;
    } else {
      result = documentsCodes;
    }

    let finalDocs = [];

    documentsContract.forEach(doc => {
      let cards = [];
      for (let i = 0; i < result.length > 0; i++) {
        let codes = result[i];
        doc.cards.forEach(docCards => {
          if (docCards.code === codes) {
            cards.push(docCards);
          }
        })
      }
      finalDocs.push({
        cards: cards,
        code: doc.code,
        title: doc.code
      });
    });


    if (finalDocs && finalDocs.length > 0) {
      finalDocs.forEach(fDoc => {
        if (fDoc && fDoc.cards && fDoc.cards.length > 0) {
          finalDocuments.push(fDoc);
        }
      })
    };

    let nocDocs = [], appDocs = [];
    if (finalDocuments && finalDocuments.length > 0) {
      finalDocuments.forEach(finalDoc => {
        if (finalDoc.code == "NOC") {
          nocDocs.push(finalDoc);
        } else {
          appDocs.push(finalDoc);
        }
      })
    }
    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if (finalDocuments && finalDocuments.length > 0 && (isEmployee || bpaStatusAction)) {
      // set(
      //   action,
      //   "screenConfig.components.div.children.body.children.cardContent.children.applyDocSummary.children.cardContent.children.uploadedDocumentDetailsCard.visible",
      //   true
      // );
      dispatch(prepareFinalObject("documentsContract", finalDocuments));
    }
  }
  console.log('requiredDocsFromMdms', finalDocuments)
  prepareFinalCards(state, dispatch, documentsPreview, finalDocuments, isVisibleTrue);
};

export const prepareDocumentDetailsUploadRedux = async (state, dispatch) => {
  let docs = get(state.screenConfiguration.preparedFinalObject, "documentsContract");
  let bpaDocs = [];
  const bpaDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "BPA",
    { }
  );
  let uploadedDocs = bpaDetails.documents;

  if (docs && docs.length > 0) {
    docs.forEach(section => {
      section.cards.forEach(doc => {
        let docObj = { };
        docObj.documentType = section.code;
        docObj.documentCode = doc.code;
        if (uploadedDocs && uploadedDocs.length > 0) {
          docObj.isDocumentRequired = false;
        }
        else {
          docObj.isDocumentRequired = doc.required;
        }
        docObj.isDocumentTypeRequired = doc.required;
        bpaDocs.push(docObj);
      })
    });
  }
  if (uploadedDocs && uploadedDocs.length > 0) {
    let fileStoreIds = jp.query(uploadedDocs, "$.*.fileStoreId");
    let fileUrls = fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : { };
    uploadedDocs.forEach(upDoc => {
      bpaDocs.forEach(bpaDoc => {
        let bpaDetailsDoc;
        if (upDoc.documentType) bpaDetailsDoc = (upDoc.documentType).split('.')[0] + "." + (upDoc.documentType).split('.')[1];
        if (bpaDetailsDoc == bpaDoc.documentCode) {
          let url = (fileUrls && fileUrls[upDoc.fileStoreId] && fileUrls[upDoc.fileStoreId].split(",")[0]) || "";
          let name = (fileUrls[upDoc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[upDoc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
            `Document - ${index + 1}`;
          bpaDoc.dropDownValues = { };
          bpaDoc.dropDownValues.value = upDoc.documentType;
          if (bpaDoc.previewdocuments) {
            bpaDoc.previewdocuments.push(
              {
                title: getTransformedLocale(bpaDoc.documentCode),
                documentType: bpaDoc.dropDownValues.value,
                name: name,
                linkText: "View",
                fileName: name,
                fileStoreId: upDoc.fileStoreId,
                fileUrl: url,
                id: upDoc.id,
                wfState: upDoc.wfState
              }
            );
          } else {
            bpaDoc.previewdocuments = [
              {
                title: getTransformedLocale(bpaDoc.documentCode),
                documentType: bpaDoc.dropDownValues.value,
                name: name,
                linkText: "View",
                fileName: name,
                fileStoreId: upDoc.fileStoreId,
                fileUrl: url,
                id: upDoc.id,
                wfState: upDoc.wfState
              }
            ];
          }
        }
      })
    })
    let previewStoreIds = jp.query(bpaDocs, "$..[*].*.fileStoreId");
    let previewFileUrls = previewStoreIds.length > 0 ? await getFileUrlFromAPI(previewStoreIds) : { };

    bpaDocs.forEach(doc => {

      if (doc.previewdocuments && doc.previewdocuments.length > 0) {
        doc.previewdocuments.forEach(docDetail => {
          docDetail["link"] = fileUrls[docDetail.fileStoreId];
          return docDetail;
        });
      }
    });
    dispatch(prepareFinalObject("documentDetailsUploadRedux", bpaDocs));
  }
}

export const revocationPdfDownload = async (action, state, dispatch, mode = "Download") => {
  let bpaDetails = get(
    state.screenConfiguration.preparedFinalObject, "BPA"
  );
  let res = await httpRequest(
    "post",
    `pdf-service/v1/_create?key=bpa-revocation&tenantId=${bpaDetails.tenantId.split(".")[0]}`,
    "",
    [],
    { Bpa: [bpaDetails] }
  );

  let fileStoreId = res.filestoreIds[0];
  let pdfDownload = await httpRequest(
    "get",
    `filestore/v1/files/url?tenantId=${bpaDetails.tenantId.split(".")[0]}&fileStoreIds=${fileStoreId}`, []
  );
  if (mode && mode === "Download") {
    window.open(pdfDownload[fileStoreId]);
  } else {
    printPdf(pdfDownload[fileStoreId]);
  }
}

export const permitOrderNoDownload = async (action, state, dispatch, mode = "Download") => {
  let bpaDetails = get(
    state.screenConfiguration.preparedFinalObject, "BPA"
  );

  let currentDate = new Date();
  set(bpaDetails, "additionalDetails.runDate", convertDateToEpoch(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()));

  let payload = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" +
    bpaDetails.edcrNumber +
    "&tenantId=" + bpaDetails.tenantId, "search", []
  );
  let detailsOfBpa = bpaDetails;
  bpaDetails.edcrDetail = payload.edcrDetail;
  let Bpa = bpaDetails;
  let permitPfKey = "buildingpermit";

  if (!window.location.href.includes("oc-bpa")) {
    if (bpaDetails && bpaDetails.businessService === "BPA_LOW") {
      permitPfKey = "buildingpermit-low"
    }
  } else if (window.location.href.includes("oc-bpa")) {
    permitPfKey = "occupancy-certificate"
  }
  if (window.location.href.includes("oc-bpa") || window.location.href.includes("BPA.NC_OC_SAN_FEE")) {
    permitPfKey = "occupancy-certificate"
  }
  let res = await httpRequest(
    "post",
    `pdf-service/v1/_create?key=${permitPfKey}&tenantId=${bpaDetails.tenantId}`,
    "",
    [],
    { Bpa: [Bpa] }
  );

  let fileStoreId = res.filestoreIds[0];
  let pdfDownload = await httpRequest(
    "get",
    `filestore/v1/files/url?tenantId=${bpaDetails.tenantId}&fileStoreIds=${fileStoreId}`, []
  );
  if (mode && mode === "Download") {
    window.open(pdfDownload[fileStoreId]);
  }
  else {
    printPdf(pdfDownload[fileStoreId]);
  }


  let data = wrapRequestBody({ BPA: detailsOfBpa });
  axios({
    url: '/bpa-services/v1/bpa/_permitorderedcr',
    method: 'POST',
    responseType: 'blob', data
    // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'permitorderedcr.pdf');
    document.body.appendChild(link);
    if (mode && mode === "Download") {
      link.click();
    } else {
      printPdf(link);
    }
  });
}

export const downloadFeeReceipt = async (state, dispatch, status, serviceCode, mode = "Download") => {
  let bpaDetails = get(
    state.screenConfiguration.preparedFinalObject, "BPA"
  );

  let queryObject = [
    {
      key: "tenantId",
      value: bpaDetails.tenantId
    },
    {
      key: "consumerCodes",
      value: bpaDetails.applicationNo
    }
  ];

  let paymentPayload = await httpRequest(
    "post",
    getPaymentSearchAPI(serviceCode, true),
    "",
    queryObject
  );

  let payments = [];

  //  if(process.env.REACT_APP_NAME == "Citizen") {
  if (window.location.href.includes("oc-bpa")) {
    if (paymentPayload.Payments && (paymentPayload.Payments).length > 1) {
      if (serviceCode === "BPA.NC_OC_APP_FEE") {
        payments.push(paymentPayload.Payments[1]);
      }

      if (serviceCode === "BPA.NC_OC_SAN_FEE") {
        payments.push(paymentPayload.Payments[0]);
      }
    } else {
      payments.push(paymentPayload.Payments[0]);
    }
  } else {
    if (paymentPayload.Payments && (paymentPayload.Payments).length > 1) {
      if (serviceCode === "BPA.NC_APP_FEE") {
        payments.push(paymentPayload.Payments[1]);
      }

      if (serviceCode === "BPA.NC_SAN_FEE") {
        payments.push(paymentPayload.Payments[0]);
      }
    } else {
      payments.push(paymentPayload.Payments[0]);
    }
  }
  //  } else {
  //   payments.push(get (paymentPayload, "Payments[0]", []));
  //  }


  let res = await httpRequest(
    "post",
    `pdf-service/v1/_create?key=consolidatedreceipt&tenantId=${bpaDetails.tenantId}`,
    "",
    [],
    { Payments: payments }
  );

  let fileStoreId = res.filestoreIds[0];
  let pdfDownload = await httpRequest(
    "get",
    `filestore/v1/files/url?tenantId=${bpaDetails.tenantId}&fileStoreIds=${fileStoreId}`, []
  );
  if (mode && mode === "Download") {
    window.open(pdfDownload[fileStoreId]);
  } else {
    printPdf(pdfDownload[fileStoreId]);
  }

}

const getFloorDetails = (index) => {
  // let floorNo = ['Ground', 'First', 'Second', 'Third', 'Forth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
  if (index) {
    return `BPA_FLOOR_NAME_${index}`
    // return `${floorNo[index]} floor`;
  }
};

export const setProposedBuildingData = async (state, dispatch, action, value) => {

  let response, occupancyType, BPA;
  let getLocalLabels = get(state, "app.localizationLabels");

  if (value == "ocApply") {
    response = get(
      state,
      "screenConfiguration.preparedFinalObject.ocScrutinyDetails.planDetail.blocks",
      []
    );
    occupancyType = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.SubOccupancyType",
      []
    );
    BPA = get(
      state,
      "screenConfiguration.preparedFinalObject.BPA",
      { }
    );
  } else {
    response = get(
      state,
      "screenConfiguration.preparedFinalObject.scrutinyDetails.planDetail.blocks",
      []
    );
    occupancyType = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.SubOccupancyType",
      []
    );
    BPA = get(
      state,
      "screenConfiguration.preparedFinalObject.BPA",
      { }
    );
  }

  let subOccupancyType = occupancyType.filter(item => {
    return item.active;
  });

  let tableData = [];
  if (response && response.length > 0) {
    for (var j = 0; j < response.length; j++) {
      let blockName = getLocaleLabels("", "BLOCK");
      let title = `BLOCK_${j + 1}`;
      let floors = response[j] && response[j].building && response[j].building.floors;
      let block = await floors.map((item, index) => (
        {
          [("Floor Description")]: getFloorDetails((item.number).toString()) || '-',
          [("Level")]: item.number,
          [("Occupancy/Sub Occupancy")]: item.occupancies[0].type || "NA",//getLocaleLabels("-", item.occupancies[0].type),//getLocaleLabels("-", item.occupancies[0].type, getLocalLabels),
          [("Buildup Area")]: item.occupancies[0].builtUpArea || 0,
          [("Floor Area")]: item.occupancies[0].floorArea || 0,
          [("Carpet Area")]: item.occupancies[0].carpetArea || 0,
        }));
      let occupancyTypeCheck = [],
        floorNo = response[j].number
      if (BPA && BPA.landInfo && BPA.landInfo.unit && BPA.landInfo.unit[j] && BPA.landInfo.unit[j].usageCategory) {
        let sOccupancyType = (BPA.landInfo.unit[j].usageCategory).split(",");
        sOccupancyType.forEach(subOcData => {
          occupancyTypeCheck.push({
            value: subOcData,
            label: getLocaleLabels("NA", `BPA_SUBOCCUPANCYTYPE_${getTransformedLocale(subOcData)}`, getLocalLabels)
          });
        });
      }

      if (occupancyTypeCheck && occupancyTypeCheck.length) {
        tableData.push({ blocks: block, suboccupancyData: subOccupancyType, titleData: title, occupancyType: occupancyTypeCheck, floorNo: floorNo });
      } else {
        tableData.push({ blocks: block, suboccupancyData: subOccupancyType, titleData: title, floorNo: floorNo });
      }

    };
    dispatch(prepareFinalObject("edcr.blockDetail", tableData));

    return tableData;
  }
}


export const getConditionsInPermitList = async (action, state, dispatch) => {
  let permitConditions = get(
    state,
    "screenConfiguration.preparedFinalObject.permitTemp",
    []
  );
  let addedConditions = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.tempAdded",
    []
  );
  let additionalDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.additionalDetails",
    { }
  );

  let permitDetails = [], finalPermitList = [];

  if (permitConditions && permitConditions.length > 0) {
    permitConditions.forEach(cndtn => {
      finalPermitList.push(cndtn);
    })
  }

  if (addedConditions && addedConditions.length > 0) {
    addedConditions.forEach(cndtn => {
      if (additionalDetails && additionalDetails.pendingapproval && additionalDetails.pendingapproval.length > 0) {
        if (cndtn && cndtn.isDeleted !== false) {
          finalPermitList.push(cndtn.conditions);
        }
      }
    })
  }

  dispatch(prepareFinalObject("BPA.additionalDetails.pendingapproval", finalPermitList));
}

export const getLicenseDetails = async (state, dispatch) => {

  let tenantId = getTenantId();
  let userInfo = JSON.parse(getUserInfo());
  const id = get(userInfo, "id");
  const queryObject = [
    {
      key: "tenantId",
      value: commonConfig.tenantId
    },
    {
      key: "id",
      value: id
    }
  ];

  try {
    const License = await httpRequest(
      "post",
      "/tl-services/v1/BPAREG/_search",
      "", [],
      queryObject
    );
    for (let i = 0; i <= License.Licenses.length; i++) {
      if (License.Licenses[i].status === "APPROVED") {
        let name = License.Licenses[i].tradeLicenseDetail.owners[0].name;
        let tradeType = License.Licenses[i].tradeLicenseDetail.tradeUnits[0].tradeType;
        let licenseNumber = License.Licenses[i].licenseNumber;
        let tradeTypeWithLocalization = getTextToLocalMapping(`TRADELICENSE_TRADETYPE_${tradeType.split('.')[0].toUpperCase()}`);
        return `${name}/${tradeTypeWithLocalization}/${licenseNumber}`;
        // return `${License.Licenses[i].tradeLicenseDetail.owners[0].name}/${License.Licenses[i].tradeLicenseDetail.tradeUnits[0].tradeType}/${License.Licenses[i].licenseNumber}`;
      }
    }
  } catch (error) {
    console.log(error);
    return { };
  }
};

export const ocuupancyType = (state, dispatch) => {
  let occupancyDataObj = get(
    state.screenConfiguration.preparedFinalObject,
    "ocScrutinyDetails.planDetail.occupancies[0].typeHelper.type", []
  );
  let occupancyData = [];
  occupancyData.push({ code: occupancyDataObj.code });
  dispatch(prepareFinalObject("applyScreenMdmsData.BPA.occupancyData", occupancyData));
}

export const deviationValidation = (action, state, dispatch) => {
  const APPROVED = "Approved";
  const ALLOW = "Validate and allow";
  const REJECT = "Validate and restrict";
  const INCOMPLETEINFO = "Not enough details";

  let ocScrutinyDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "ocScrutinyDetails", { }
  );
  let scrutinyDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "scrutinyDetails", { }
  );
  let ocEDCRDetails = { };
  ocEDCRDetails.edcrDetail = [];
  ocEDCRDetails.edcrDetail[0] = ocScrutinyDetails;

  let eDCRDetails = { };
  eDCRDetails.edcrDetail = [];
  eDCRDetails.edcrDetail[0] = scrutinyDetails;

  let validationParams = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.BPA.DeviationParams"
  )

  let validationResponse = APPROVED;
  let planParam = [],
    ocParam = [];
  if (validationParams) {
    for (let paramRecord of validationParams) {

      let firstIndex = paramRecord.paramPath.indexOf("[");
      let lastIndex = paramRecord.paramPath.lastIndexOf("[");

      if (firstIndex !== lastIndex) {// To check if the record has multiple sub records like blocks
        let firstpath = paramRecord.paramPath.substring(0, lastIndex);
        let secondpath = paramRecord.paramPath.substring(lastIndex + 4);
        let planRecs = _.get(eDCRDetails, firstpath, []);
        let ocRecs = _.get(ocEDCRDetails, firstpath, []);
        planRecs.forEach((element, i) => {
          planParam.push(_.get(planRecs[i], secondpath, null));
          ocParam.push(_.get(ocRecs[i], secondpath, null));
        });
      } else {
        planParam.push(_.get(eDCRDetails, paramRecord.paramPath, null));
        ocParam.push(_.get(ocEDCRDetails, paramRecord.paramPath, null));
      }
      if (planParam && ocParam && planParam.length === ocParam.length) {
        for (let i = 0; i < planParam.length; i++) {
          let diff = 0;
          if (paramRecord.calculationType === "number") {
            diff = Math.abs(ocParam[i] - planParam[i]);
          } else {
            //(paramRecord.calculationType==="percentage"){
            diff = (Math.abs(ocParam[i] - planParam[i]) / planParam[i]) * 100;
          }

          if (diff > paramRecord.tolerancelimit) {
            if (paramRecord.restrictionType === REJECT) {

              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "System has to validate and restrict the user from creating the application.",
                    labelKey: "BPA_TOLERANCE_LIMIT_ERROR"
                  },
                  "error"
                )
              );
            } else {
              validationResponse = ALLOW;
            }
          }
        }
      } else {
        validationResponse = INCOMPLETEINFO;
        break;
      }
    }
  }

  return validationResponse;
};

export const showComparisonDialog = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.cityPickerDialogofComparison.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.cityPickerDialogofComparison", "props.open", !toggle)
  );
  dispatch(
    handleField("apply", "components.cityPickerDialogofComparison.popup", "props.open", !toggle)
  );

};
export const getPermitDetails = async (permitNumber, tenantId) => {
  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "approvalNo", value: permitNumber }
  ];

  const response = await getBpaSearchResults(queryObject);

  if (response && response.BPA && response.BPA.length > 0)
    return response.BPA[0];
  else
    return 'NOPERMIT';

};

const permitNumberLink = async (state, dispatch) => {

  let tenantId = getQueryArg(window.location.href, "tenantId");
  let appNumber = get(state.screenConfiguration.preparedFinalObject, "bpaDetails.applicationNo", "");
  let permitNumber = get(state.screenConfiguration.preparedFinalObject, "ocScrutinyDetails.permitNumber", "");
  let checkingApp = getTenantId().split('.')[1] ? "employee" : "citizen";
  let url = `${window.location.origin}/egov-bpa/search-preview?applicationNumber=${appNumber}&tenantId=${tenantId}`;
  let linkDetail = {
    labelName: "",
    labelKey: ""
  }
  if (process.env.NODE_ENV === "production") {
    if (checkingApp) {
      url = `${window.location.origin}/${checkingApp}/egov-bpa/search-preview?applicationNumber=${appNumber}&tenantId=${tenantId}`;
    }
  }
  if (appNumber) {
    linkDetail = {
      labelName: permitNumber,
      labelKey: permitNumber
    }
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.basicDetails.children.cardContent.children.basicDetailsContainer.children.buildingPermitNum",
        "props.linkDetail",
        linkDetail
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardThirdStep.children.summaryDetails.children.cardContent.children.scrutinySummary.children.cardContent.children.basicDetailsContainer.children.buildingPermitNum",
        "props.linkDetail",
        linkDetail
      )
    );
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.scrutinySummary.children.cardContent.children.basicDetailsContainer.children.buildingPermitNum",
        "props.linkDetail",
        linkDetail
      )
    );
    dispatch(prepareFinalObject("BPA.permitNumberLink", url));
  } else {
    dispatch(prepareFinalObject("BPA.permitNumberLink", ""));
  }
}

/**
 * This method will be called to retreive the comparison report and vlidate it
 * @return true / false
 */
export const getComparisonResult = async (state, dispatch, tenantId, ocEdcrNumber, bpaEdcrNumber) => {
  /**
   * Getting comparison report and validating it
   */
  let comparisionRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/occomparison?tenantId=" + tenantId + "&ocdcrNumber=" + ocEdcrNumber + "&edcrNumber=" + bpaEdcrNumber,
    "search", []
  );
  let comparisionSuccess = false;
  if (comparisionRes) {
    comparisionSuccess = comparisionRes.comparisonDetail.status == "Accepted" ? true : false;
    dispatch(prepareFinalObject("comparisonDetails", comparisionRes.comparisonDetail));
    dispatch(prepareFinalObject("comparisonDetails.report", comparisionRes.comparisonDetail.comparisonReport));
  }
  return comparisionSuccess;

}

export const getOcEdcrDetails = async (state, dispatch, action) => {
  try {
    const scrutinyNo = get(
      state.screenConfiguration.preparedFinalObject,
      `BPA.edcrNumber`,
      ""
    ) || getQueryArg(window.location.href, "edcrNumber");

    let tenantId = getQueryArg(window.location.href, "tenantId");

    //check format
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

    //get oc edcr details
    let ocpayload = await edcrHttpRequest(
      "post",
      "/edcr/rest/dcr/scrutinydetails?edcrNumber=" +
      scrutinyNo +
      "&tenantId=" + tenantId,
      { }
    );

    //get permit details for oc edcr using permitNumber
    const bpaDetails = await getPermitDetails(get(ocpayload, "edcrDetail[0].permitNumber"), tenantId);
    if (bpaDetails === 'NOPERMIT') {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Incorrect Permit Number!",
            labelKey: "BPA_INCORRECT_PERMIT_NUMBER"
          },
          "error"
        )
      );
      return;
    }

    //Check oc edcr date validity less than today
    const todayDate = new Date();
    if (get(ocpayload, "edcrDetail[0].permitDate") > todayDate) {  //to be checked for the date comparison
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Invalid Permit Date!",
            labelKey: "BPA_INVALID_PERMIT"
          },
          "error"
        )
      );
      return;
    }
    dispatch(
      handleField(
        "apply",
        "components.div.children.footer.children.nextButton",
        "props.disabled",
        true
      )
    );
    let comparisionSuccess = await getComparisonResult(state, dispatch, tenantId, scrutinyNo, bpaDetails.edcrNumber);
    if (!comparisionSuccess) {
      showComparisonDialog(state, dispatch)
      return
    }
    dispatch(
      handleField(
        "apply",
        "components.div.children.footer.children.nextButton",
        "props.disabled",
        false
      )
    );
    //get permit edcr details
    let edcrPayload = await edcrHttpRequest(
      "post",
      "/edcr/rest/dcr/scrutinydetails?edcrNumber=" +
      bpaDetails.edcrNumber +
      "&tenantId=" + tenantId,
      { }
    );

    if (get(ocpayload, "edcrDetail[0].tenantId") !== get(edcrPayload, "edcrDetail[0].tenantId")) {//check city using tenantId- is this correct
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Invalid City!",
            labelKey: "BPA_INVALID_PERMIT_CITY"
          },
          "error"
        )
      );
      return;
    }

    //check duplicates
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId,
      },
      {
        key: "edcrNumber",
        value: scrutinyNo,
      }
    ];
    const bpaSearch = await httpRequest(
      "post",
      "bpa-services/v1/bpa/_search",
      "",
      queryObject
    );

    bpaSearch.BPA && bpaSearch.BPA.length > 0 &&
      bpaSearch.BPA.forEach((data, index) => {
        if (data.edcrNumber === scrutinyNo && ((data.status != "REJECTED") && (data.status != "PERMIT REVOCATION"))) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Application Number already exists",
                labelKey: "APPLICATION_NUMBER_ALREADY_EXISTS"
              },
              "error"
            )
          );
          return;
        }
      });

    let primaryOwnerArray = get(bpaDetails, "landInfo.owners").filter(owr => owr && owr.isPrimaryOwner && owr.isPrimaryOwner == true);
    // set(bpaDetails, "applicantName", primaryOwnerArray[0].name);

    dispatch(prepareFinalObject("ocScrutinyDetails", get(ocpayload, "edcrDetail[0]")));
    dispatch(prepareFinalObject("scrutinyDetails", get(edcrPayload, "edcrDetail[0]")));
    deviationValidation(action, state, dispatch);
    dispatch(prepareFinalObject("bpaDetails", bpaDetails));
    dispatch(prepareFinalObject(`BPA.landInfo`, get(bpaDetails, "landInfo", { })));
    setProposedBuildingData(state, dispatch, action, "ocApply");
    let SHLicenseDetails = await getLicenseDetails(state, dispatch);
    dispatch(prepareFinalObject(`BPA.appliedBy`, SHLicenseDetails));
    dispatch(prepareFinalObject(`BPA.applicantName`, primaryOwnerArray[0].name));
    edcrDetailsToBpaDetails(state, dispatch);
    ocuupancyType(state, dispatch);
    await permitNumberLink(state, dispatch, action)
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

export const applicantNameAppliedByMaping = async (state, dispatch, bpaDetails, ocDetails) => {
  const primaryOwnerArray = bpaDetails && get(bpaDetails, "landInfo.owners") && get(bpaDetails, "landInfo.owners").length > 0 && get(bpaDetails, "landInfo.owners").filter(owr => owr && owr.isPrimaryOwner && owr.isPrimaryOwner == true);
  const tenantId = getQueryArg(window.location.href, "tenantId");

  const permitDetails = await getPermitDetails(get(ocDetails, "permitNumber"), tenantId);
  let comparisionSuccess = await getComparisonResult(state, dispatch, tenantId, ocDetails.edcrNumber, permitDetails.edcrNumber);
  let SHLicenseDetails = await getLicenseDetails(state, dispatch);
  dispatch(prepareFinalObject(`bpaDetails`, permitDetails));
  if (!SHLicenseDetails) { SHLicenseDetails = "NA" }
  dispatch(prepareFinalObject(`BPA.appliedBy`, SHLicenseDetails));
  dispatch(prepareFinalObject(`BPA.applicantName`, primaryOwnerArray && primaryOwnerArray[0] && primaryOwnerArray[0].name));
  await permitNumberLink(state, dispatch);
  await ocuupancyType(state, dispatch);
  await residentialType(state, dispatch);
}

function documentsSorting(a, b) {
  let orderA = a.orderNumber
  let orderB = b.orderNumber
  let comparison = 0;
  if (orderA > orderB) {
    comparison = 1;
  } else if (orderA < orderB) {
    comparison = -1;
  }
  return comparison;
}