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
import { httpRequest } from "../../../../ui-utils/api";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import isUndefined from "lodash/isUndefined";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import commonConfig from "config/common.js";

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
    uiFramework: "custom-molecules-local",
    componentPath: "UploadMultipleFiles",
    props: {
      maxFiles: 4,
      jsonPath: jsonPath,
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      buttonLabel: {
        labelKey: "HR_UPLOAD_FILES_LABEL",
        labelName: "UPLOAD FILES"
      },
      maxFileSize: 5000
    }
  };
};

export const getApplicationNoContainer = number => {
  return {
    uiFramework: "custom-atoms-local",
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
      return `/egov-ui-framework/hrms/acknowledgement?purpose=application&status=rejected&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
    case "cancel":
      return `/egov-ui-framework/hrms/acknowledgement?purpose=application&status=cancelled&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
    default:
      return `/egov-ui-framework/hrms/acknowledgement?purpose=approve&status=success&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
  }
};

export const onClickPreviousButton = (
  queryValue,
  applicationNumber,
  tenantId
) => {
  switch (queryValue) {
    case "reject":
      return `/egov-ui-framework/hrms/search-preview?role=approver&status=pending_approval&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    case "cancel":
      return `/egov-ui-framework/hrms/search-preview?role=approver&status=approved&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    default:
      return `/egov-ui-framework/hrms/search-preview?role=approver&status=pending_approval&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  }
};
export const getFeesEstimateCard = props => {
  const { sourceJsonPath, ...rest } = props;
  return {
    uiFramework: "custom-containers-local",
    componentPath: "EstimateCardContainer",
    props: {
      // estimate: {
      //   header,
      //   fees,
      //   extra
      // }
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

export const showHideAdhocPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["view"],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField("view", "components.adhocDialog", "props.open", !toggle)
  );
};

export const getButtonVisibility = (status, button) => {
  if (status === "pending_payment" && button === "PROCEED TO PAYMENT")
    return true;
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

// Prepare dropdown data with object as value from array
export const objectArrayToDropdown = (objectArray, labelName) => {
  return objectArray.map(item => {
    if (item.hasOwnProperty(labelName))
      return { name: item[labelName], value: JSON.stringify(item) };
  });

  // let dropDown = [];
  // for (var item in objectArray) {
  //   console.log(item);
  //   if (item.hasOwnProperty(labelName)) {
  //     dropDown.push({ label: item.labelName, value: item });
  //   }
  // }
  // return dropDown;
};

// Search API call

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/tl-calculator/v1/_getbill",
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
      "/collection-services/receipts/_search",
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
      "collection-services/receipts/_search",
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
    case "PAID":
      return { word1: "Status: ", word2: "Pending Approval" };
    case "APPLIED":
      return { word1: "Status: ", word2: "Pending Payment" };
    case "REJECTED":
      return { word1: "Status: ", word2: "Application Rejected" };
    case "CANCELLED":
      return { word1: `Trade License No: `, word2: `${licenseNo}` };
    case "APPROVED":
      return { word1: `Trade License No: `, word2: `${licenseNo}` };
    default:
      return { word1: "", word2: "" };
  }
};

//const nestedLevelScheama = ["Major", "Minor", "Subminor", "Details"];
//applyScreenMdmsData.MdmsRes.TradeLicense.TradeType
// const reTrasnformerForNestedDropDown = (
//   originaJsonPath,
//   value,
//   state,
//   dispatch
// ) => {
//   let nestedValues = value.split(".");
//   while (nestedValues.length > 1) {
//     const originalNestedValues = value.split(".");
//     const originalObject = get(state, `${originaJsonPath}`);
//     nestedValues = value.split(".");
//     const targetLevel = nestedValues.pop();
//     const targetpath = nestedValues.join(".");
//     let targetValues = get(originalObject, `${targetpath}`, []);
//     targetValues =
//       targetValues.length && targetValues.length >= 0
//         ? targetValues
//         : objectToDropdown(targetValues);

//     dispatch(
//       prepareFinalObject(
//         `${targetpath}.${nestedLevelScheama[nestedValues.length + 1]}`,
//         targetValues
//       )
//     );
//   }
// };

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

    if (owners && owners.length > 1) {
      const currentNumber = owners[cardIndex].mobileNumber;
      const numbers = owners.filter(
        item => currentNumber === item.mobileNumber
      );
      if (numbers.length > 1) {
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
    }
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
        dispatch(
          prepareFinalObject(
            `Licenses[0].tradeLicenseDetail.owners[${cardIndex}]`,
            userInfo
          )
        );
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
      return "TL_UPLOAD_STATEMENT1";
    case "OWNERSHIPPROOF":
      return "TL_UPLOAD_STATEMENT2";
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
    ? item.debitAmount
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
  if (Bill && Bill.length) {
    const extraData = ["Rebate", "Penalty"].map(item => {
      return {
        name: {
          labelName: item,
          labelKey: item
        },
        value: null,
        info: getToolTipInfo(item, LicenseData) && {
          labelName: getToolTipInfo(item, LicenseData),
          labelKey: getToolTipInfo(item, LicenseData)
        }
      };
    });
    const { billAccountDetails } = Bill[0].billDetails[0];
    const transformedData = billAccountDetails.reduce((result, item) => {
      if (getFromReceipt) {
        item.accountDescription &&
          result.push({
            name: {
              labelName: item.accountDescription.split("-")[0],
              labelKey: item.accountDescription.split("-")[0]
            },
            value: getTaxValue(item),
            info: getToolTipInfo(
              item.accountDescription.split("-")[0],
              LicenseData
            ) && {
              labelName: getToolTipInfo(
                item.accountDescription.split("-")[0],
                LicenseData
              ),
              labelKey: getToolTipInfo(
                item.accountDescription.split("-")[0],
                LicenseData
              )
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
              labelName: getToolTipInfo(item.taxHeadCode, LicenseData),
              labelKey: getToolTipInfo(item.taxHeadCode, LicenseData)
            }
          });
      }
      return result;
    }, []);
    return [
      ...transformedData.filter(item => item.name.labelKey === "TL_TAX"),
      ...transformedData.filter(item => item.name.labelKey !== "TL_TAX"),
      ...extraData
    ];
  }
};

const getBillingSlabData = async (dispatch, billingSlabIds, tenantId) => {
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
            accessoriesTotal = accessoriesTotal + item.rate;
            result.accessoryData.push({
              rate: item.rate,
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
  }
};

export const createEstimateData = async (
  LicenseData,
  jsonPath,
  dispatch,
  href = {},
  getFromReceipt
) => {
  const applicationNo =
    get(LicenseData, "applicationNumber") ||
    getQueryArg(href, "applicationNumber");
  const tenantId =
    get(LicenseData, "tenantId") || getQueryArg(href, "tenantId");
  const businessService = "TL"; //Hardcoding Alert
  const queryObj = [
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
  const payload = getFromReceipt
    ? await getReceipt(queryObj.filter(item => item.key !== "businessService"))
    : await getBill(queryObj);
  const estimateData = payload
    ? getFromReceipt
      ? getEstimateData(payload.Receipt[0].Bill, getFromReceipt, LicenseData)
      : payload.billResponse &&
        getEstimateData(payload.billResponse.Bill, false, LicenseData)
    : [];
  dispatch(prepareFinalObject(jsonPath, estimateData));
  payload.billingSlabIds &&
    getBillingSlabData(dispatch, payload.billingSlabIds, tenantId);

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
  if (curMonth > 3) {
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
  let d = new Date(et),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
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
    return "/egov-ui-framework/hrms";
  } else {
    return "/egov-ui-framework/tradelicense-citizen";
  }
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
  const structType = get(
    payload,
    "Licenses[0].tradeLicenseDetail.structureType"
  );
  if (structType) {
    set(
      payload,
      "LicensesTemp[0].tradeLicenseDetail.structureType",
      structType.split(".")[0]
    );
    try {
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.common-masters.StructureSubTypeTransformed",
          get(
            state.screenConfiguration.preparedFinalObject.applyScreenMdmsData[
              "common-masters"
            ],
            `StructureType.${structType.split(".")[0]}`,
            []
          )
        )
      );

      payload &&
        dispatch(
          prepareFinalObject(
            "LicensesTemp[0].tradeLicenseDetail.structureType",
            payload.LicensesTemp[0].tradeLicenseDetail.structureType
          )
        );
    } catch (e) {
      console.log(e);
    }
  }

  const tradeTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.TradeType",
    []
  );
  // debugger;
  const tradeTypeDropdownData =
    tradeTypes &&
    Object.keys(tradeTypes).map(item => {
      return { code: item, active: true };
    });
  tradeTypeDropdownData &&
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
        tradeTypeDropdownData
      )
    );
  const tradeSubTypes = get(
    payload,
    "Licenses[0].tradeLicenseDetail.tradeUnits"
  );

  if (tradeSubTypes.length > 0) {
    try {
      tradeSubTypes.forEach((tradeSubType, i) => {
        const tradeCat = tradeSubType.tradeType.split(".")[0];
        const tradeType = tradeSubType.tradeType.split(".")[1];
        set(payload, `LicensesTemp.tradeUnits[${i}].tradeType`, tradeCat);
        set(payload, `LicensesTemp.tradeUnits[${i}].tradeSubType`, tradeType);

        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.TradeLicense.TradeCategoryTransformed",
            objectToDropdown(
              get(
                state.screenConfiguration.preparedFinalObject,
                `applyScreenMdmsData.TradeLicense.TradeType.${tradeCat}`,
                []
              )
            )
          )
        );

        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.TradeLicense.TradeSubCategoryTransformed",
            get(
              state.screenConfiguration.preparedFinalObject,
              `applyScreenMdmsData.TradeLicense.TradeType.${tradeCat}.${tradeType}`,
              []
            )
          )
        );
        payload &&
          dispatch(
            prepareFinalObject(
              `LicensesTemp.tradeUnits[${i}].tradeType`,
              tradeCat
            )
          );

        payload &&
          dispatch(
            prepareFinalObject(
              `LicensesTemp.tradeUnits[${i}].tradeSubType`,
              tradeType
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
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.TradeLicense.TradeType",
            tradeTypeList
          )
        );
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
        tradeTypeTransformed.TradeType &&
          dispatch(
            prepareFinalObject(
              "applyScreenMdmsData.TradeLicense.TradeType",
              tradeTypeTransformed.TradeType
            )
          );
        return tradeTypeTransformed;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const showCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["search"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("search", "components.cityPickerDialog", "props.open", !toggle)
  );
};

export const createEmployee = (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.tenantId.value"
  );
  get(state.screenConfiguration.preparedFinalObject, "Employee") &&
    dispatch(prepareFinalObject("Employee", []));
  get(
    state.screenConfiguration.preparedFinalObject,
    "hrms.reviewScreen.furnishedRolesList"
  ) && dispatch(prepareFinalObject("hrms.reviewScreen.furnishedRolesList", ""));
  const tenantIdQueryString = tenantId ? `?tenantId=${tenantId}` : "";
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/create${tenantIdQueryString}`
      : `/hrms/create${tenantIdQueryString}`;
  dispatch(setRoute(createUrl));
};

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

// HRMS
export const toggleDeactivateDialog = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["view"],
    "components.deactivateEmployee.props.open",
    false
  );
  dispatch(
    handleField("view", "components.deactivateEmployee", "props.open", !toggle)
  );
};

// HRMS GET STATE ADMIN ROLE
export const getAdminRole = state => {
  let userInfo = JSON.parse(getUserInfo());
  const currentUserRoles = get(userInfo, "roles");

  /** REMOVE THESE 2 HARDCODES after moving StateInfo object to localStorage */
  const configAdminRoles = JSON.parse(
    get(
      state,
      "common.stateInfoById[0].roleMapping.hrmsAdmin",
      '["HRMS_ADMIN"]'
    )
  );
  const stateTenantId = get(
    state,
    "common.stateInfoById[0].code",
    commonConfig.tenantId
  );
  /** END */

  let hasAdminRole = false;
  Array.isArray(currentUserRoles) &&
    currentUserRoles.forEach(role => {
      if (
        Array.isArray(configAdminRoles) &&
        configAdminRoles.includes(role.code) &&
        role.tenantId === stateTenantId
      ) {
        hasAdminRole = true;
      }
    });
  return { hasAdminRole: hasAdminRole, configAdminRoles: configAdminRoles };
};
