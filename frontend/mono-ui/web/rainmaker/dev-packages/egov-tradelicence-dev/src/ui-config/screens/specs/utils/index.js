import commonConfig from "config/common.js";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";
import { getCommonSubHeader, getLabel, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, initScreen, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getLocaleLabels, getQueryArg, getTodaysDateInYMD, getTransformedLocalStorgaeLabels, getObjectKeys, getObjectValues, } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils/api";
import "./index.css";
import { showHideAdhocPopup as showReqDocPopup} from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";

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
      buttonLabel: { labelName: "UPLOAD FILES", labelKey: "TL_UPLOAD_FILES_BUTTON" },
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

export const showHideAdhocPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["pay"],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(handleField("pay", "components.adhocDialog", "props.open", !toggle));
};

export const getButtonVisibility = (status, button) => {
  if (status === "CITIZENACTIONREQUIRED" && button === "RESUBMIT")
    return true;
  if (status === "pending_payment" && button === "PROCEED TO PAYMENT")
    return true;
  if (status === "pending_approval" && button === "APPROVE") return true;
  if (status === "pending_approval" && button === "REJECT") return true;
  if (status === "approved" && button === "CANCEL TRADE LICENSE") return true;
  if (status === "APPROVED" && button === "APPROVED") return true;
  if (status === "EXPIRED" && button === "EXPIRED") return true;
  if (status === "PENDINGPAYMENT" && button === "PENDINGPAYMENT") return true;
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
      "/tl-services/v1/_search",
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
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const calculateBill = async queryObject => {
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
      getPaymentSearchAPI('TL'),
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
      getPaymentSearchAPI('TL'),
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
      "egov-mdms-service/v1/_search",
      "",
      [],
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
          // if (oldOwnersArr.length > 0) {
          //   currOwnersArr.push({
          //     ...oldOwnersArr[cardIndex],
          //     userActive: false
          //   });
          // }
          dispatch(
            prepareFinalObject(
              `Licenses[0].tradeLicenseDetail.owners`,
              currOwnersArr
            )
          );
          // dispatch(
          //   prepareFinalObject(
          //     `Licenses[0].tradeLicenseDetail.owners[0].mobileNumber`,
          //     ownerNo
          //   )
          // );
          validateOwners(state, dispatch);
        }
      }
    }
  } catch (e) {
    dispatch(toggleSnackbar(true, e.message, "info"));
  }
};

export const validateOwners = (state, dispatch)=>{
  let ownersJsonPath = "";
  let owners = [];
  let ownership = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
    "INDIVIDUAL"
  );
  ownership = ownership.split(".")[0];
  if(ownership==="INDIVIDUAL"){
    ownersJsonPath = "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.OwnerInfoCard.props.items";
    owners = get(
      state.screenConfiguration.screenConfig.apply,
      ownersJsonPath,
      []
    );
    for(let i =0;i<owners.length;i++){
      let obj = owners[i]["item"+i].children.cardContent.children.tradeUnitCardContainer.children;
      applyRequiredValidation(obj, state, dispatch);
    }
  } else {
    ownersJsonPath = "components.div.children.formwizardSecondStep.children.tradeOwnerDetails.children.cardContent.children.ownerInfoInstitutional";
    owners = get(
      state.screenConfiguration.screenConfig.apply,
      ownersJsonPath,
      []
    );
    let obj = owners.children.cardContent.children.tradeUnitCardContainerInstitutional.children;
    applyRequiredValidation(obj, state, dispatch);
  }
}

export const applyRequiredValidation = (obj, state, dispatch) => {
  Object.keys(obj).map((item)=>{
    let jsonPath = obj[item].jsonPath;
    let componentJsonpath = obj[item].componentJsonpath;
    let isFieldValid = obj[item].isFieldValid;
    let value = get(state.screenConfiguration.preparedFinalObject, jsonPath, null);
    if(value && !isFieldValid){
      dispatch(
        handleField(
          "apply",
          componentJsonpath,
          "props.error",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          componentJsonpath,
          "props.helperText",
          ""
        )
      );
      dispatch(
        handleField(
          "apply",
          componentJsonpath,
          "isFieldValid",
          true
        )
      );
    }
  })
}

const getStatementForDocType = docType => {
  switch (docType) {
    case "OWNERIDPROOF":
      return "TL_OWNERIDPROOF_NOTE";
    case "OWNERSHIPPROOF":
      return "TL_OWNERSHIPPROOF_NOTE";
    case "OWNERPHOTO":
      return "TL_OWNERPHOTO_NOTE";
    default:
      return "";
  }
};


export const downloadAcknowledgementForm = (Licenses, mode = "download") => {

  const queryStr = [
    { key: "key", value: "tlapplication" },
    { key: "tenantId", value: commonConfig.tenantId }
  ]
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Licenses }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
      .then(res => {
        res.filestoreIds[0]
        if (res && res.filestoreIds && res.filestoreIds.length > 0) {
          res.filestoreIds.map(fileStoreId => {
            downloadReceiptFromFilestoreID(fileStoreId, mode)
          })
        } else {
          console.log("Error In Acknowledgement form Download");
        }
      });
  } catch (exception) {
    alert('Some Error Occured while downloading Acknowledgement form!');
  }
}

export const downloadCertificateForm = async (Licenses, mode = 'download') => {
  let tenantId = get(Licenses[0], "tenantId");
  let applicationNumber = get(Licenses[0], "applicationNumber")
  const applicationType = Licenses && Licenses.length > 0 ? get(Licenses[0], "applicationType") : "NEW";
  const queryStr = [
    { key: "key", value: applicationType === "RENEWAL" ? "tlrenewalcertificate" : "tlcertificate" },
    { key: "tenantId", value: commonConfig.tenantId }
  ]
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  let queryObject = [
    { key: "tenantId", value: tenantId },
    {
      key: "applicationNumber",
      value: applicationNumber
    }
  ];
  const LicensesPayload = await getSearchResults(queryObject);
  const updatedLicenses = get(LicensesPayload, "Licenses");
  const oldFileStoreId = get(updatedLicenses[0], "fileStoreId")
  if (oldFileStoreId) {
    downloadReceiptFromFilestoreID(oldFileStoreId, mode)
  }
  else {
    try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Licenses }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
        .then(res => {
          res.filestoreIds[0]
          if (res && res.filestoreIds && res.filestoreIds.length > 0) {
            res.filestoreIds.map(fileStoreId => {
              downloadReceiptFromFilestoreID(fileStoreId, mode)
            })
          } else {
            console.log("Error In Acknowledgement form Download");
          }
        });
    } catch (exception) {
      alert('Some Error Occured while downloading Acknowledgement form!');
    }
  }
}

export const prepareDocumentTypeObj = documents => {
  let documentsArr =
    documents.length > 0
      ? documents.reduce((documentsArr, item, ind) => {
        documentsArr.push({
          ...item,
          jsonPath: `Licenses[0].tradeLicenseDetail.applicationDocuments[${ind}]`,
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

const getEstimateData = (ResponseData, isPaid, LicenseData) => {
  if (ResponseData) {
    // const extraData = ["TL_COMMON_REBATE", "TL_COMMON_PEN"].map(item => {
    //   return {
    //     name: {
    //       labelName: item,
    //       labelKey: item
    //     },
    //     value: null,
    //     info: getToolTipInfo(item, LicenseData) && {
    //       value: getToolTipInfo(item, LicenseData),
    //       key: getToolTipInfo(item, LicenseData)
    //     }
    //   };
    // });
    const { billAccountDetails } = ResponseData.billDetails[0];
    const transformedData = billAccountDetails.reduce((result, item) => {
      if (isPaid) {
        item.accountDescription &&
          result.push({
            name: {
              labelName: item.accountDescription.split("-")[0],
              labelKey: item.accountDescription.split("-")[0]
            },
            // value: getTaxValue(item)            
            value: item.amount,
            info: getToolTipInfo(
              item.accountDescription.split("-")[0],
              LicenseData
            ) && {
              value: getToolTipInfo(
                item.accountDescription.split("-")[0],
                LicenseData
              ),
              key: getToolTipInfo(
                item.accountDescription.split("-")[0],
                LicenseData
              )
            }
          });
        item.taxHeadCode &&
          result.push({
            name: {
              labelName: item.taxHeadCode,
              labelKey: item.taxHeadCode
            },
            // value: getTaxValue(item),
            value: item.amount,
            info: getToolTipInfo(item.taxHeadCode, LicenseData) && {
              value: getToolTipInfo(item.taxHeadCode, LicenseData),
              key: getToolTipInfo(item.taxHeadCode, LicenseData)
            }
          });
      } else {
        item.taxHeadCode &&
          result.push({
            name: {
              labelName: item.taxHeadCode,
              labelKey: item.taxHeadCode
            },
            value: item.amount,
            // value: getTaxValue(item),
            // value : get(ResponseData , "totalAmount"),
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
      ...transformedData.filter(item => item.name.labelKey !== "TL_TAX"),
      // ...extraData
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
      dispatch(
        toggleSnackbar(
          open,
          {
            lableName: "Billing Slab error!",
            labelKey: "ERR_BILLING_SLAB_ERROR"
          },
          "error"
        )
      );
    }
  }
};

const isApplicationPaid = (currentStatus, workflowCode) => {
  let isPAID = false;
  if (currentStatus === "CITIZENACTIONREQUIRED") {
    return isPAID;
  }
  const businessServiceData = JSON.parse(localStorageGet("businessServiceData"));

  if (!isEmpty(businessServiceData)) {
    const tlBusinessService = JSON.parse(localStorageGet("businessServiceData")).filter(item => item.businessService === workflowCode)
    const states = tlBusinessService && tlBusinessService.length > 0 && tlBusinessService[0].states;
    for (var i = 0; i < states.length; i++) {
      if (states[i].state === currentStatus) {
        break;
      }
      if (
        states[i].actions &&
        states[i].actions.filter(item => item.action === "PAY").length > 0
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
  getFromReceipt
) => {
  const workflowCode = get(LicenseData, "workflowCode") ? get(LicenseData, "workflowCode") : "NewTL"
  const applicationNo =
    get(LicenseData, "applicationNumber") ||
    getQueryArg(href, "applicationNumber");
  const tenantId =
    get(LicenseData, "tenantId") || getQueryArg(href, "tenantId");
  const businessService = "TL"; //Hardcoding Alert
  const queryObj = [
    { key: "tenantId", value: tenantId },
    {
      key: "consumerCodes",
      value: applicationNo
    },
    {
      key: "businessService",
      value: businessService
    }
  ];
  const getBillQueryObj = [
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
  const currentStatus = LicenseData.status;
  const isPAID = isApplicationPaid(currentStatus, workflowCode);
  const fetchBillResponse = await getBill(getBillQueryObj);
  const payload = isPAID
    ? await getReceipt(queryObj.filter(item => item.key !== "businessService"))
    : fetchBillResponse && fetchBillResponse.Bill && fetchBillResponse.Bill[0];

  let estimateData = payload
    ? isPAID
      ? payload &&
      payload.Payments &&
      payload.Payments.length > 0 &&
      getEstimateData(
        payload.Payments[0].paymentDetails[0].bill,
        isPAID,
        LicenseData
      )
      : payload && getEstimateData(payload, false, LicenseData)
    : [];
  estimateData = estimateData || [];
  set(
    estimateData,
    "payStatus",
    isPAID
  );
  dispatch(prepareFinalObject(jsonPath, estimateData));
  const accessories = get(LicenseData, "tradeLicenseDetail.accessories", []);
  if (payload) {
    const getBillResponse = await calculateBill(getBillQueryObj);
    getBillResponse &&
      getBillResponse.billingSlabIds &&
      getBillingSlabData(
        dispatch,
        getBillResponse.billingSlabIds,
        tenantId,
        accessories
      );
  }

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
    var nextYr1format = nextYr1.substring(2, 4);
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1format;
  } else {
    var nextYr2 = today.getFullYear().toString();
    var nextYr2format = nextYr2.substring(2, 4);
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2format;
  }
  return fiscalYr;
};

export const getnextFinancialYear = (year) => {
  const nextFY = year.substring(0, 2) + (parseInt(year.substring(2, 4)) + 1) + year.substring(4, 5) + (parseInt(year.substring(5, 7)) + 1);
  return nextFY;
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
      } else if(fields[variable] && fields[variable].componentPath == "DynamicMdmsContainer" && fields[variable].props){
        let {masterName, moduleName, rootBlockSub, dropdownFields} = fields[variable].props;
        let isIndex = fields[variable].index || 0;
        dropdownFields.forEach((item, i) => {
          let isValid = get(
            state.screenConfiguration.preparedFinalObject ,
            `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${isIndex}].${item.key}`,
            ''
          );
          if(isValid == '' || isValid == 'none') {
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

export const getDocList = (state, dispatch) => {
  const tradeUnits = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.tradeUnits[0]"
  );

  const documentObj = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.TradeLicense.documentObj");
  const documentTypes = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.common-masters.DocumentType");

  const applicationType = getQueryArg(window.location.href , "action") === "EDITRENEWAL" ? "RENEWAL" :
  get( state.screenConfiguration.preparedFinalObject, "Licenses[0].applicationType", "NEW");
  const documentObjArray = documentObj && tradeUnits&& documentObj.filter(item => item.tradeType === tradeUnits.tradeType.split(".")[0]);

  const filteredDocTypes = documentObjArray[0].allowedDocs.reduce((acc, item, index) => {
    documentTypes.find((document, index) => {
      if (document.code === item.documentType)
        acc.push({
          ...documentTypes[index]
        })
    });
    return acc;
  }, [])
  const applicationDocArray = filteredDocTypes && filteredDocTypes.reduce((result, item) => {
    const transformedDocObj = documentObjArray[0].allowedDocs.filter(docObj => docObj.documentType === item.code)[0];
    if (transformedDocObj.applicationType.includes(applicationType)) {
      result.push(
        {
          code: item.code,
          maxFileSize: item.maxFileSize,
          required: transformedDocObj.required,
          formatProps: {
            accept: item.allowedFormat.join(",")
          },
          description: `COMMON_${item.code}_DESCRIPTION`,
          statement: `COMMON_${item.code}_STATEMENT`
        }
      )
    }
    return result;
  }, [])

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
    applicationDocument.reduce((acc, item) => {
      const index = applicationDocs.findIndex(
        i => i.documentType === item.code
      );
      if (index > - 1) {
        acc.push(applicationDocs[index])
      }
      return acc;
    }, [])
  applicationDocsReArranged &&
    dispatch(
      prepareFinalObject(
        "Licenses[0].tradeLicenseDetail.applicationDocuments",
        applicationDocsReArranged
      )
    );

}

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

export const applyForm = (state, dispatch, action) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId"
  );
  const reqDocUi=get( state, "screenConfiguration.screenConfig.home.components.adhocDialog.children.popup", []);
  set(reqDocUi, 'children.footer.children.footerChildElement.children.applyButton.onClickDefination', {
  action: "condition",
    callBack: (state, dispatch) => {
      dispatch(prepareFinalObject('documentsUploadRedux', {}))
      const applyUrl = process.env.NODE_ENV === "production"
        ? `/tradelicense-citizen/apply?tenantId=${tenantId}`
        : process.env.REACT_APP_SELF_RUNNING === true
          ? `/egov-ui-framework/tradelicense-citizen/apply?tenantId=${tenantId}`
          : `/tradelicense-citizen/apply?tenantId=${tenantId}`;
      dispatch(setRoute(applyUrl))
    }
  })
  set(
    action,
    "screenConfig.components.adhocDialog.children.popup",
    reqDocUi
  );
  const isTradeDetailsValid = validateFields(
    "components.cityPickerDialog.children.dialogContent.children.popup.children.cityPicker.children",
    state,
    dispatch,
    "home"
  );
  if (isTradeDetailsValid) {
    showReqDocPopup(state, dispatch, "home");
  }
  dispatch(prepareFinalObject("Licenses", []));
  dispatch(prepareFinalObject("LicensesTemp", []));
  dispatch(prepareFinalObject("DynamicMdms", []));
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

export const getTradeTypeDropdownData = tradeTypes => {
  return (
    tradeTypes &&
    tradeTypes.TradeType &&
    Object.keys(tradeTypes.TradeType).map(item => {
      return { code: item, active: true };
    })
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
        "Owner Name",
        "TL_COMMON_TABLE_COL_OWN_NAME",
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
    case "INITIATED":
      return getLocaleLabels("Initiated,", "TL_INITIATED", localisationLabels);
    case "APPLIED":
      return getLocaleLabels("Applied", "TL_APPLIED", localisationLabels);
    case "PAID":
      return getLocaleLabels(
        "Paid",
        "WF_NEWTL_PENDINGAPPROVAL",
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
        "WF_NEWTL_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_NEWTL_PENDINGPAYMENT",
        localisationLabels
      );

    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_NEWTL_FIELDINSPECTION",
        localisationLabels
      );

    case "Search Results for Trade License Applications":
      return getLocaleLabels(
        "",
        "TL_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
    case "Financial Year":
      return getLocaleLabels(
        "Financial Year",
        "TL_COMMON_TABLE_COL_FIN_YEAR",
        localisationLabels
      );
    case "Application Type":
      return getLocaleLabels(
        "Application Type",
        "TL_COMMON_TABLE_COL_APP_TYPE",
        localisationLabels
      );
    case "RENEWAL":
      return getLocaleLabels(
        "Renewal",
        "TL_TYPE_RENEWAL",
        localisationLabels
      );
    case "NEW":
      return getLocaleLabels(
        "New",
        "TL_TYPE_NEW",
        localisationLabels
      );
  }
};

export const checkValueForNA = value => {
  return value ? value : "NA";
};
export const triggerUpdateByKey = (state, keyIndex, value, dispatch) => {
  if(dispatch == "set"){
    set(state, `screenConfiguration.preparedFinalObject.DynamicMdms.TradeLicense.tradeUnits.selectedValues[${keyIndex}]`, value);
  } else {
    dispatch(prepareFinalObject( `DynamicMdms.TradeLicense.tradeUnits.${keyIndex}`, value ));
  }
}
export const updateMdmsDropDowns = async ( state, dispatch ) => {
  const tradeSubTypes = get( state, "screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail.tradeUnits", []);
  if (tradeSubTypes.length > 0) {
    try {
      tradeSubTypes.forEach((tradeSubType, i) => {
        const tradeCat = tradeSubType.tradeType.split(".")[0];
        const tradeType = tradeSubType.tradeType.split(".")[1];
        let formObj = {
          tradeCategory: tradeCat, tradeType: tradeType, tradeSubType: tradeSubType.tradeType
        }
        triggerUpdateByKey(state, i, formObj, 'set');

        triggerUpdateByKey(state, `tradeTypeTransformed.allDropdown[${i}]`, getObjectKeys(get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.TradeLicense.tradeUnits.tradeUnitsTransformed.${tradeCat}`, [])) , dispatch);
        triggerUpdateByKey(state, `tradeSubTypeTransformed.allDropdown[${i}]`, getObjectValues(get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.TradeLicense.tradeUnits.tradeUnitsTransformed.${tradeCat}.${tradeType}`, [])) , dispatch);
 
        triggerUpdateByKey(state, `selectedValues[${i}]`, formObj , dispatch);
      });
    } catch (e) {
      console.log(e);
    }
  }
};
export const updateStructureTypes = async ( state, dispatch ) => {
  const structType = get(
    state,
    "screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail.structureType"
  );
  if (structType) {
    set(
      state,
      "screenConfiguration.preparedFinalObject.LicensesTemp[0].tradeLicenseDetail.structureType",
      structType.split(".")[0]
    );
    try {
      dispatch(prepareFinalObject( `DynamicMdms.common-masters.structureTypes.selectedValues[0].structureType`, structType.split(".")[0] ));
  
      let dropDownValues = getObjectValues(get(state.screenConfiguration.preparedFinalObject,`DynamicMdms.common-masters.structureTypes.structureTypesTransformed.${structType.split(".")[0]}`,[]));
      let structureSubTypeDropValues = [];
      if (dropDownValues && dropDownValues.length === 0) {
        dropDownValues = get(state.screenConfiguration.preparedFinalObject,`applyScreenMdmsData.common-masters.StructureType`,[]);
        if (dropDownValues && dropDownValues,length > 0) {
          structureSubTypeDropValues = dropDownValues.filter(data => data.code.split('.')[0] === structType.split(".")[0]);
          dispatch(prepareFinalObject("DynamicMdms.common-masters.structureTypes.structureSubTypeTransformed.allDropdown[0]", structureSubTypeDropValues));
        }
      } else {
        dispatch(prepareFinalObject("DynamicMdms.common-masters.structureTypes.structureSubTypeTransformed.allDropdown[0]", dropDownValues));
      }
      
      // dispatch(prepareFinalObject( `DynamicMdms.common-masters.structureTypes.structureSubTypeTransformed.allDropdown[0]`, getObjectValues(get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.common-masters.structureTypes.structureTypesTransformed.${structType.split(".")[0]}`, [])) ));
      
      dispatch(prepareFinalObject( `DynamicMdms.common-masters.structureTypes.selectedValues[0].structureSubType`, structType ));
        dispatch(
          prepareFinalObject(
            "LicensesTemp[0].tradeLicenseDetail.structureType",
            structType
          )
        );
        dispatch(
          prepareFinalObject(
            "LicensesTemp[0].tradeLicenseDetail.structureSubType",
            structType
          )
        );
    } catch (e) {
      console.log(e);
    }    
  }
}
export const updateOwnerShipEdit = async ( state, dispatch ) => {
  let tradeSubOwnershipCat = get(
    state,
    "screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail.subOwnerShipCategory"
  );
  let tradeOwnershipCat = "";
  if (tradeSubOwnershipCat) {
    tradeOwnershipCat = tradeSubOwnershipCat.split(".")[0];
  } else {
    tradeOwnershipCat = get(
      state.screenConfiguration.preparedFinalObject,
      "DynamicMdms.common-masters.tradeOwner.ownershipTransformed[0].code",
      ""
    );
    tradeSubOwnershipCat = get(
      state.screenConfiguration.preparedFinalObject,
      `DynamicMdms.common-masters.tradeOwner.ownershipTransformed.${tradeOwnershipCat}[0].code`,
      ""
    );
    set(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
      tradeSubOwnershipCat
    );
    
      dispatch(
        prepareFinalObject(
          "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
          tradeSubOwnershipCat
        )
      );
  }

  set(
    state,
    "screenConfiguration.preparedFinalObject.LicensesTemp[0].tradeLicenseDetail.ownerShipCategory",
    tradeOwnershipCat
  );
  set(
    state,
    "screenConfiguration.preparedFinalObject.DynamicMdms.common-masters.tradeOwner.selectedValues[0].ownership",
    tradeOwnershipCat
  );
  try {

      dispatch(
        prepareFinalObject(
          "DynamicMdms.common-masters.tradeOwner.selectedValues[0].ownership",
          tradeOwnershipCat
        )
      );

    dispatch(prepareFinalObject( `DynamicMdms.common-masters.tradeOwner.subOwnershipTransformed.allDropdown[0]`, getObjectValues(get( state.screenConfiguration.preparedFinalObject, `DynamicMdms.common-masters.tradeOwner.tradeOwnerTransformed.${tradeOwnershipCat}`, [])) ));

    dispatch(prepareFinalObject( `DynamicMdms.common-masters.tradeOwner.selectedValues[0].subOwnership`, tradeSubOwnershipCat ));
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
}

export const pageResetAndChange = (state, dispatch, tenant) => {
  dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
  dispatch(prepareFinalObject("LicensesTemp", []));
  dispatch(setRoute(`/tradelicence/apply?tenantId=${tenant}`));
};