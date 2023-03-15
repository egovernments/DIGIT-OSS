import { download, downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";
import {
  getCommonCaption, getCommonCard, getLabelWithValue, getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
  getFileUrl, getFileUrlFromAPI, getLocaleLabels, getQueryArg, getTransformedLocale, getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import { getPaymentSearchAPI, getUserSearchedResponse } from "egov-ui-kit/utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import set from "lodash/set";
import store from "ui-redux/store";
import { httpRequest } from "../../../../ui-utils/api";
import { getSearchResults } from "../../../../ui-utils/commons";

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "pt-apply-wizard-footer"
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
  if (fields.isFieldValid === false) {
    return false;
  }
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
    "consumerCode"
  );
  const tenantId = getQueryArg(
    window.location.href,
    "tenantId"
  );
  const applicationNumberQueryString = applicationNumber
    ? `consumerCode=${applicationNumber}&tenantId=${tenantId}`
    : ``;
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/pt-mutation/apply?${applicationNumberQueryString}&step=${step}`
      : `/pt-mutation/apply?${applicationNumberQueryString}&step=${step}`;
  store.dispatch(setRoute(applyUrl));
};

export const showHideAdhocPopup = (state, dispatch, screenKey) => {


  // let link = `/property-tax/assessment-form`;
  // let moduleName = process.env.REACT_APP_NAME === "Citizen" ? '/citizen' : '/employee';
  // window.location.href = process.env.NODE_ENV === "production" ? moduleName + link : link;


  // dispatch(setRoute(`/property-tax/assessment-form`));


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
export const getTodaysDateInYMD = () => {
  let date = new Date();
  //date = date.valueOf();
  let month = date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  // date = epochToYmdDate(date);
  return date;
};

export const getRequiredDocData = async (action, state, dispatch) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen" ? "pb.amritsar" : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "PropertyTax",
          masterDetails: [{ name: "MutationDocuments" }]
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
    case "Unique Property ID":
      return getLocaleLabels(
        "Unique Property ID",
        "PT_COMMON_TABLE_COL_PT_ID",
        localisationLabels
      );
    case "Unique Property Id":
      return getLocaleLabels(
        "Unique Property Id",
        "PT_COMMON_TABLE_COL_UNIQ_PT_ID",
        localisationLabels
      );
    case "Action":
      return getLocaleLabels(
        "Action",
        "PT_COMMON_TABLE_COL_ACTION_LABEL",
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
    case "INWORKFLOW":
      return getLocaleLabels(
        "In Workflow",
        "INWORKFLOW",
        localisationLabels
      );
    case "Property ID":
      return getLocaleLabels(
        "Property ID",
        "PT_MUTATION_PID",
        localisationLabels
      );
    default:
      return getLocaleLabels(
        label,
        label,
        localisationLabels
      );
  }
};

export const checkValueForNA = value => {
  return value == null || value == undefined || value == '' ? "NA" : value;
};
export const fetchBill = async queryObject => {
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
export const getpayments = async queryObject => {

  let businessService = '';
  queryObject && Array.isArray(queryObject) && queryObject.map(query => {
    if (query.key == "businessService") {
      businessService = query.value;
    }
  })

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

export const downloadCertificateForm = async (oldProperties, pdfcode, tenantId, applicationNumber, mode = 'download') => {
  const queryStr = [
    { key: "key", value: pdfcode },
    { key: "tenantId", value: tenantId }
  ]
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  const response = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "acknowledgementIds", value: applicationNumber }
  ]);
  const Properties = get(response, "Properties", oldProperties);
  const document = get(Properties[0], "documents").filter(item => item.documentType == "PTMUTATION");
  const oldFileStoreId = document && get(document[0], "fileStoreId")
  if (oldFileStoreId) {
    downloadReceiptFromFilestoreID(oldFileStoreId, mode, tenantId)
  }
  else {

    try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Properties }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
        .then(res => {
          res.filestoreIds[0]
          if (res && res.filestoreIds && res.filestoreIds.length > 0) {
            res.filestoreIds.map(fileStoreId => {
              downloadReceiptFromFilestoreID(fileStoreId, mode, tenantId)
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

export const downloadReceitForm = async (tenantId, applicationNumber, mode = 'download') => {

  let queryObj = [
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCodes",
      value: applicationNumber
    },
    {
      key: "businessService",
      value: 'PT.MUTATION'
    },

  ];

  download(queryObj, mode, "consolidatedreceipt",'PAYMENT')
}
export const getLabelIfNotNull = (label, value, props) => {
  const labelObj = getLabelWithValue(label, value, props);
  return labelObj;
}



export const showHideMutationDetailsCard = (action, state, dispatch) => {
  const isMutationDetailsCard = get(state, "screenConfiguration.preparedFinalObject.PropertyConfiguration[0].Mutation.MutationDetails");
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.mutationDetails",
      "props.hidden",
      !isMutationDetailsCard
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.mutationSummary",
      "props.hidden",
      !isMutationDetailsCard
    )
  );
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.mutationSummary",
      "props.hidden",
      !isMutationDetailsCard
    )
  );
}


export const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  let allDocuments =
    state.screenConfiguration.preparedFinalObject.Property.documents;

  allDocuments && allDocuments.forEach(doc => {
    documentsPreview.push({
      title: getTransformedLocale(doc.documentType),
      fileStoreId: doc.fileStoreId,
      linkText: "View"
    });
  });
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
  documentsPreview = documentsPreview.map((doc, index) => {
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
  dispatch(prepareFinalObject("documentsUploadRedux", documentsPreview));
};

export const setCardVisibility = (state, action, dispatch) => {
  let owners = get(state, "screenConfiguration.preparedFinalObject.Property.owners");
  if (owners && owners.length > 0) {
    owners.map(owner => {
      if (owner.ownerType != 'NONE' && owner.status == "ACTIVE") {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.transferorDetails.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentID.props.style.display",
          'block'
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.transferorDetails.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentType.props.style.display",
          'block'
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transferorSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentID.props.style.display",
          'block'
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transferorSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentType.props.style.display",
          'block'
        );
      }
    })
  }
  if (
    get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType",
      ""
    ).includes("MULTIPLEOWNERS")
  ) {
    set(
      action.screenConfig,
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
      { display: "none" }
    );
    set(
      action.screenConfig,
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.props.style",
      {}
    );
  } else if (
    get(
      state,
      "screenConfiguration.preparedFinalObject.Property.ownershipCategory",
      ""
    ).includes("INSTITUTIONAL")
  ) {
    set(
      action.screenConfig,
      "components.div.children.formwizardFirstStep.children.transferorDetails.props.style",
      { display: "none" }
    );
    set(
      action.screenConfig,
      "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transferorSummary.props.style",
      { display: "none" }
    );
  } else {
    set(
      action.screenConfig,
      "components.div.children.formwizardFirstStep.children.transferorInstitutionDetails.props.style",
      { display: "none" }
    );
    set(
      action.screenConfig, "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transferorInstitutionSummary.props.style",
      { display: "none" }
    );
  }
}