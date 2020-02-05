import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getUserInfo, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import {
  getQueryArg,
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import isUndefined from "lodash/isUndefined";
import {
  getCommonCard,
  getCommonValue,
  getCommonCaption,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { sampleGetBill } from "../../../../ui-utils/sampleResponses";

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

export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
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

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
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

export const gotoApplyWithStep = (state, dispatch, step) => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  const tenantId = getQueryArg(
    window.location.href,
    "tenantId"
  );
  const applicationNumberQueryString = applicationNumber
    ? `&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
    : ``;
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/pt-mutation/apply?step=${step}${applicationNumberQueryString}`
      : `/pt-mutation/apply?step=${step}${applicationNumberQueryString}`;
  dispatch(setRoute(applyUrl));
};

export const showHideAdhocPopup = (state, dispatch, screenKey) => {
  dispatch(setRoute(`/property-tax/assessment-form`));
  // let toggle = get(
  //   state.screenConfiguration.screenConfig[screenKey],
  //   "components.adhocDialog.props.open",
  //   false
  // );
  // dispatch(
  //   handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  // );
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

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};

export const getDetailsForOwner = async (state, dispatch, fieldInfo) => {
  try {
    const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
    const ownerNo = get(
      state.screenConfiguration.preparedFinalObject,
      `FireNOCs[0].fireNOCDetails.applicantDetails.owners[${cardIndex}].mobileNumber`,
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
      `FireNOCs[0].fireNOCDetails.applicantDetails.owners`,
      []
    );
    //owners from search call before modification.
    const oldOwnersArr = get(
      state.screenConfiguration.preparedFinalObject,
      "FireNOCs[0].fireNOCDetails.applicantDetails.owners",
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
            `FireNOCs[0].fireNOCDetails.applicantDetails.owners[${matchingOwnerIndex}].userActive`,
            true
          )
        );
        dispatch(
          prepareFinalObject(
            `FireNOCs[0].fireNOCDetails.applicantDetails.owners[${cardIndex}].userActive`,
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
              `FireNOCs[0].fireNOCDetails.applicantDetails.owners`,
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
            "FireNOCs[0].fireNOCDetails.applicantDetails.owners",
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
              `FireNOCs[0].fireNOCDetails.applicantDetails.owners`,
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

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/firenoc-calculator/v1/_getbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

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

export const createEstimateData = billObject => {
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

export const getRequiredDocData = async (action, state, dispatch) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen" ? "pb.amritsar" : getTenantId();
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
    console.log(e);
  }
};

export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Property Tax Unique Id":
      return getLocaleLabels(
        "Property Tax Unique Id",
        "PT_COMMON_TABLE_COL_PT_ID",
        localisationLabels
      );

      case "Application No":
        return getLocaleLabels(
          "Application No.",
          "PT_COMMON_TABLE_COL_APP_NO",
          localisationLabels
        );

        case "Application Type":
          return getLocaleLabels(
            "Application Type",
            "PT_COMMON_TABLE_COL_APP_TYPE",
            localisationLabels
          );
  
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "PT_COMMON_TABLE_COL_OWNER_NAME",
        localisationLabels
      );

    case "Guardian Name":
      return getLocaleLabels("Guardian Name", "PT_GUARDIAN_NAME", localisationLabels);
    case "Existing Property Id":
      return getLocaleLabels(
        "Existing Property Id",
        "PT_COMMON_COL_EXISTING_PROP_ID",
        localisationLabels
      );

    case "Address":
      return getLocaleLabels(
        "Address",
        "PT_COMMON_COL_ADDRESS",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "PT_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );
    case "ACTIVE":
      return getLocaleLabels("Active,", "PT_ACTIVE", localisationLabels);
    case "INITIATED":
      return getLocaleLabels("Initiated,", "PT_INITIATED", localisationLabels);
    case "APPLIED":
      getLocaleLabels("Applied", "PT_APPLIED", localisationLabels);
    case "PAID":
      getLocaleLabels("Paid", "WF_NEWPT_PENDINGAPPROVAL", localisationLabels);

    case "APPROVED":
      return getLocaleLabels("Approved", "PT_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "PT_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "PT_CANCELLED", localisationLabels);
    case "PENDINGAPPROVAL ":
      return getLocaleLabels(
        "Pending for Approval",
        "WF_PT_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_PT_PENDINGPAYMENT",
        localisationLabels
      );
    case "DOCUMENTVERIFY":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_PT_DOCUMENTVERIFY",
        localisationLabels
      );
    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_PT_FIELDINSPECTION",
        localisationLabels
      );

    case "Search Results for PT Applications":
      return getLocaleLabels(
        "Search Results for PT Applications",
        "PT_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    case "Search Results for Properties":
      return getLocaleLabels(
        "Search Results for Properties",
        "PT_HOME_PROPERTY_RESULTS_TABLE_HEADING",
        localisationLabels
      );
      
      case "Search Results for Property Application":
      return getLocaleLabels(
        "Search Results for Property Application",
        "PT_HOME_APPLICATION_RESULTS_TABLE_HEADING",
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
