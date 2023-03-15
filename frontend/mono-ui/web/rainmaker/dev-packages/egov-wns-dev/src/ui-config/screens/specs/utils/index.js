import commonConfig from "config/common.js";
import {
  getCommonCaption, getCommonCard, getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getLocaleLabels, getQueryArg, getTransformedLocalStorgaeLabels } from "egov-ui-framework/ui-utils/commons";
import { getUserSearchedResponse } from "egov-ui-kit/utils/commons";
import {
  getTenantId,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils/api";
import "./index.css";

export const getCommonApplyFooter = (position, children) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: (position === 'BOTTOM') ? "apply-wizard-footer" : ""
    },
    children
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
      return `/wns/acknowledgement?purpose=application&status=rejected&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
    case "cancel":
      return `/wns/acknowledgement?purpose=application&status=cancelled&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
    default:
      return `/wns/acknowledgement?purpose=approve&status=success&applicationNumber=${applicationNumber}&secondNumber=${secondNumber}&tenantId=${tenantId}`;
  }
};

export const onClickPreviousButton = (
  queryValue,
  applicationNumber,
  tenantId
) => {
  switch (queryValue) {
    case "reject":
      return `/wns/search-preview?role=approver&status=pending_approval&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    case "cancel":
      return `/wns/search-preview?role=approver&status=approved&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    default:
      return `/wns/search-preview?role=approver&status=pending_approval&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  }
};
export const getFeesEstimateCard = props => {
  const { sourceJsonPath, ...rest } = props;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
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

export const getFeesEstimateOverviewCard = props => {
  const { sourceJsonPath, ...rest } = props;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "EstimateOverviewCardContainer",
    props: {
      sourceJsonPath,
      ...rest
    }
  };
};

export const getIconStyle = key => {
  return style[key];
};

export const showHideAdhocPopup = (state, dispatch, screenKey, value = true, adhocDetails = {}) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );

  // if (screenKey == "viewBill") {
  //   dispatch(
  //     handleField(
  //       "viewBill",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyAmount",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "viewBill",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyReason",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "viewBill",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.commentsField",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "viewBill",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateAmount",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "viewBill",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateReason",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "viewBill",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateCommentsField",
  //       "props.value",
  //       null
  //     )
  //   );
  // }

  // if (screenKey == "search-preview") {
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.commentsField",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyAmount",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyReason",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateAmount",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateCommentsField",
  //       "props.value",
  //       null
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateReason",
  //       "props.value",
  //       null
  //     )
  //   );
  // } else {
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.commentsField",
  //       "props.value",
  //       get(adhocDetails, "adhocPenaltyComment", null)
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyAmount",
  //       "props.value",
  //       get(adhocDetails, "adhocPenalty", null)
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyReason",
  //       "props.value",
  //       get(adhocDetails, "adhocPenaltyReason", null)
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateAmount",
  //       "props.value",
  //       get(adhocDetails, "adhocRebate", null)
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateCommentsField",
  //       "props.value",
  //       get(adhocDetails, "adhocRebateComment", null)
  //     )
  //   );
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateReason",
  //       "props.value",
  //       get(adhocDetails, "adhocRebateReason", null)
  //     )
  //   );
  // }

  dispatch(handleField(screenKey, "components.adhocDialog", "props.open", !toggle));
};

export const showHideAdhocPopupAndValues = (state, dispatch, screenKey = "search-preview") => {
  let toggle = get(state.screenConfiguration.screenConfig[screenKey],"components.adhocDialog.props.open",false);
  let getValuesofAdhoc = localStorage.getItem("WS_ADDITIONAL_DETAILS_FOR_DATA");
  let isAdditionalReqData = localStorage.getItem("IS_WS_ADDITIONAL_DETAILS_FOR_DATA");
  let adhocDetails = getValuesofAdhoc ? JSON.parse(getValuesofAdhoc) : {};
  let additionalDetailsIsRequired = isAdditionalReqData ? JSON.parse(isAdditionalReqData) : false;
  if (additionalDetailsIsRequired) {
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.commentsField", "props.value", get(adhocDetails, "additionalDetails.adhocPenaltyComment", null)));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyAmount", "props.value", get(adhocDetails, "additionalDetails.adhocPenalty", null)));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyReason", "props.value", get(adhocDetails, "additionalDetails.adhocPenaltyReason", null)));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateAmount", "props.value", get(adhocDetails, "additionalDetails.adhocRebate", null)));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateCommentsField", "props.value", get(adhocDetails, "additionalDetails.adhocRebateComment", null)));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateReason", "props.value", get(adhocDetails, "additionalDetails.adhocRebateReason", null)));
  } else {
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.commentsField", "props.value", null));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyAmount", "props.value", null));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocPenaltyCard.children.penaltyAmountAndReasonContainer.children.penaltyReason", "props.value", null));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateAmount", "props.value", null));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateCommentsField", "props.value", null));
    dispatch(handleField("search-preview", "components.adhocDialog.children.popup.children.adhocRebateCard.children.rebateAmountAndReasonContainer.children.rebateReason", "props.value", null));
  }
  dispatch(handleField(screenKey, "components.adhocDialog", "props.open", !toggle));
}

export const getButtonVisibility = (status, button) => {
  if (status === "pending_payment" && button === "PROCEED TO PAYMENT")
    return true;
  if (status === "pending_approval" && button === "APPROVE") return true;
  if (status === "pending_approval" && button === "REJECT") return true;
  if (status === "approved" && button === "CANCEL TRADE LICENSE") return true;
  return false;
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
      "/tl-services/v1/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    return {};
  }
};

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
  }
};

export const convertEpochToDateAndHandleNA = dateEpoch => {
  if (
    dateEpoch !== undefined &&
    dateEpoch !== null &&
    dateEpoch !== "" &&
    dateEpoch !== "NA" &&
    dateEpoch !== 0
  ) {
    let convertedToDate = convertEpochToDate(dateEpoch);
    return convertedToDate;
  } else { return "NA"; }
}

export const handlePropertySubUsageType = params => {
  params = handleNA(params);
  if (params !== "NA" && params.split(".").length > 1) {
    return params;
  } else {
    return "NA";
  }
}

export const handleNA = params => {
  if (params !== undefined && params !== null && params !== "" && params !== 0) {
    return params;
  } else { return "NA"; }
}

export const handleRoadType = params => {
  return handleNA(params) == "NA" ? "NA" : 'WS_ROADTYPE_' + params;
}


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
    return {};
  }
};

export const getAutoSelector = textScheama => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
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
    moduleName: "egov-wns",
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
    case "PENDINGAPPROVAL":
      return { word1: "Status: ", word2: "WF_NEWTL_PENDINGAPPROVAL" };
    case "PENDINGPAYMENT":
      return { word1: "Status: ", word2: "WF_NEWTL_PENDINGPAYMENT" };
    case "FIELDINSPECTION":
      return { word1: "Status: ", word2: "WF_NEWTL_FIELDINSPECTION" };
    case "APPLIED":
      return { word1: "Status: ", word2: "TL_APPLIED" };
    case "REJECTED":
      return { word1: "Status: ", word2: "TL_REJECTED" };
    case "CANCELLED":
      return { word1: `Trade License No: `, word2: `${licenseNo}` };
    case "APPROVED":
      return { word1: `Trade License No: `, word2: `${licenseNo}` };
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
                value: payload.applyScreen.property.address.locality.code,
                label: payload.applyScreen.property.address.locality.name
              }
            )
          );
          dispatch(
            prepareFinalObject(
              "Licenses[0].tradeLicenseDetail.address",
              payload.applyScreen.property.address
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.children.cityDropdown",
              "props.value",
              payload.applyScreen.property.address.tenantId
            )
          );
        }
      }
    }
  } catch (e) {
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
    return {};
  }
};

const getStatementForDocType = docType => {
  switch (docType) {
    case "OWNERIDPROOF":
      return "Allowed documents are Aadhar Card / Voter ID Card / Driving License";
    case "OWNERSHIPPROOF":
      return "Allowed documents are Rent Deed / Lease Doc / Property Registry / General or Special Power of Attorney";
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

export const createEstimateData = async (
  billData,
  jsonPath,
  dispatch,
  href = {},
  getFromReceipt
) => {
  const payload = billData
  const estimateData = payload
  dispatch(prepareFinalObject(jsonPath, estimateData));
  var event = new CustomEvent("estimateLoaded", { detail: true });
  window.parent.document.dispatchEvent(event);
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
    return "/wns";
  } else {
    return "/wns-citizen";
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

export const getDocList = (state, dispatch) => {
  const documentList = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.ws-services-masters.Documents");
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  let applicationDocArray = documentList.filter(onlyUnique);
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

export const resetFieldsForApplication = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.consumerNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.applicationstatus",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.toDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.applicationType",
      "props.value",
      ""
    )
  );
};

export const resetFieldsForConnection = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.consumerid",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.propertyid",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.oldConsumerid",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.propertyid",
      "props.value",
      ""
    )
  );
}

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

export const getRequiredDocData = async (action, state, dispatch) => {
  let tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "FireNoc",
          masterDetails: [{ name: "Documents" }]
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
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
  }
};


export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "WS_COMMON_TABLE_COL_APP_NO_LABEL",
        localisationLabels
      );

    case "Application Type":
      return getLocaleLabels(
        "Application Type",
        "WS_COMMON_TABLE_COL_APP_TYPE_LABEL",
        localisationLabels
      );

    case "Consumer No":
      return getLocaleLabels(
        "Consumer No",
        "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
        localisationLabels
      );
    case "Service":
      return getLocaleLabels(
        "Service",
        "WS_COMMON_TABLE_COL_SERVICE_LABEL",
        localisationLabels
      );
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "WS_COMMON_TABLE_COL_OWN_NAME_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "WS_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );

    case "Due":
      return getLocaleLabels(
        "Due",
        "WS_COMMON_TABLE_COL_AMT_DUE_LABEL",
        localisationLabels
      );

    case "Due Date":
      return getLocaleLabels(
        "Due Date",
        "WS_COMMON_TABLE_COL_DUE_DATE_LABEL",
        localisationLabels
      );

    case "Action":
      return getLocaleLabels(
        "Action",
        "WS_COMMON_TABLE_COL_ACTION_LABEL",
        localisationLabels
      );

    case "Address":
      return getLocaleLabels(
        "Address",
        "WS_COMMON_TABLE_COL_ADDRESS",
        localisationLabels
      );

    case "Application Status":
      return getLocaleLabels(
        "Application Status",
        "WS_COMMON_TABLE_COL_APPLICATION_STATUS"
      )
    // case "Connection Type":
    //   return getLocaleLabels(
    //     "Connection Type",
    //     "Connection Type"
    //   )

    // case "INITIATED":
    //   return getLocaleLabels("Initiated,", "TL_INITIATED", localisationLabels);
    // case "APPLIED":
    //   getLocaleLabels("Applied", "TL_APPLIED", localisationLabels);
    // case "PAID":
    //   getLocaleLabels("Paid", "WF_NEWTL_PENDINGAPPROVAL", localisationLabels);

    // case "APPROVED":
    //   return getLocaleLabels("Approved", "TL_APPROVED", localisationLabels);
    // case "REJECTED":
    //   return getLocaleLabels("Rejected", "TL_REJECTED", localisationLabels);
    // case "CANCELLED":
    //   return getLocaleLabels("Cancelled", "TL_CANCELLED", localisationLabels);
    // case "PENDINGAPPROVAL ":
    //   return getLocaleLabels(
    //     "Pending for Approval",
    //     "WF_NEWTL_PENDINGAPPROVAL",
    //     localisationLabels
    //   );
    // case "PENDINGPAYMENT":
    //   return getLocaleLabels(
    //     "Pending payment",
    //     "WF_NEWTL_PENDINGPAYMENT",
    //     localisationLabels
    //   );

    // case "FIELDINSPECTION":
    //   return getLocaleLabels(
    //     "Pending for Field Inspection",
    //     "WF_NEWTL_FIELDINSPECTION",
    //     localisationLabels
    //   );

    case "Search Results for Water & Sewerage Connections":
      return getLocaleLabels(
        "Search Results for Water & Sewerage Connections",
        "WS_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    case "Search Results for Water & Sewerage Application":
      return getLocaleLabels(
        "Search Results for Water & Sewerage Application",
        "WS_HOME_SEARCH_APPLICATION_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    // case "MY_APPLICATIONS":
    //   return getLocaleLabels(
    //     "My Applications",
    //     "TL_MY_APPLICATIONS",
    //     localisationLabels
    //   );
  }
};
const setVisible = (key, status, action) => {
  set(
    action,
    `screenConfig.components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.${key}.visible`,
    status
  );
}
export const triggerModificationsDisplay = (action, isModeEnable) => {
  setVisible('modificationsEffectiveFrom', isModeEnable, action);
  setVisible('plumberDetailsContainer', !isModeEnable, action);
  setVisible('roadCuttingChargeContainer', !isModeEnable, action);
}

export const getDemand = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/demand/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "warning"
      )
    );
  }
};

export const validateFieldOfWNS = (
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
        fields[variable] && fields[variable].componentPath != "DynamicMdmsContainer" &&
        fields[variable].props && fields[variable].jsonPath &&
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
      } else if (fields[variable] && fields[variable].componentPath == "DynamicMdmsContainer" && fields[variable].props && fields[variable].visible != false) {
        let { masterName, moduleName, rootBlockSub, dropdownFields } = fields[variable].props;
        let isIndex = fields[variable].index || 0;
        dropdownFields.forEach((item, i) => {
          let isValid = get(
            state.screenConfiguration.preparedFinalObject,
            `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${isIndex}].${item.key}`,
            ''
          );
          if (isValid == '' || isValid == 'none' || isValid == null || isValid.includes("null")) {
            isFormValid = false;
            dispatch(
              handleField(
                "apply",
                `${fields[variable].componentJsonpath}.props.dropdownFields[${i}]`,
                "isRequired",
                true
              )
            );
          }
        });

      }
    }
  }
  return isFormValid;
};