import commonConfig from "config/common.js";
import {
  getCommonCaption,
  getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField,
  hideSpinner,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
  captureSource,
  getFileUrlFromAPI,
  getLocaleLabels,
  getQueryArg,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { openPdf, printPdf } from "egov-ui-kit/utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import store from "ui-redux/store";
import { downloadConReceipt } from "egov-common/ui-utils/commons";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";

import { httpRequest } from "../../../../ui-utils";

// sms("sms"),
// email("email"),
// ivr("ivr"),
// mobileapp("mobileapp"),
// whatsapp("whatsapp"),
// csc("csc"),
// web("web");

export const downloadPdf = (link, openIn = "_blank") => {
  var win = window.open(link, openIn);
  if (win) {
    win.focus();
  } else {
    toggleSnackbar(
      true,
      {
        labelName:
          "Looks like your browser is blocking pop-ups. Allow pop-ups in your browser to download certificate.",
        labelKey: "BND_BROWSER_WARN_BROWSER_BLOCKED",
      },
      "error"
    );
  }
};


export const convertEpochToDateCustom = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};

export const validateTimeZone = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz != "Asia/Calcutta" && tz != "Asia/Kolkata") {
      alert(
        "Looks like your system's time zone is not correct! \nChange your system's time zone to Indian Standard Time (UTC+5:30 Chennai,Kolkata,Mumbai,NewDelhi)\nand try again."
      );
      return false;
    }
  } catch (e) {
    alert(
      "Looks like this browser is very old. Please update your browser and continue"
    );
    return false;
  }
  return true;
};

export const getCommonApplyFooter = (children) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
    },
    children,
  };
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item,
      };

      return result;
    }, {})
  );
};

export const getMdmsData = async (requestBody) => {
  try {
    const response = await httpRequest(
      "post",
      "egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );

    return response;
  } catch (error) {
    return {};
  }
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
        (fields[variable].props.disableValidation === undefined ||
          !fields[variable].props.disableValidation) &&
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            ),
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

//Convert IST epoch to IST Date.
export const convertEpochToDateWithTimeIST = (dateEpoch) => {
  let ist;
  try {
    ist = new Date(dateEpoch)
      .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      .split(",")[0];
    return ist;
  } catch (e) {
    return "Use latest browser.";
    //alert("Catching error");
    // var now = new Date(dateEpoch);
    // var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    // ist = new Date(dateEpoch.getTime() + (5.5 * 60 * 60000))
    // return `${ist.getDate()}/${ist.getMonth()+1}/${ist.getFullYear()}`;
  }
};

export const getEpochForDate = (date) => {
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

export const ifUserRoleExists = (role) => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map((role) => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const convertEpochToDate = (dateEpoch) => {
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
  const applicationNumberQueryString = applicationNumber
    ? `&applicationNumber=${applicationNumber}`
    : ``;
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/abg/apply?step=${step}${applicationNumberQueryString}`
      : `/abg/apply?step=${step}${applicationNumberQueryString}`;
  dispatch(setRoute(applyUrl));
};

export const showHideAdhocPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["search"],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField("search", "components.adhocDialog", "props.open", !toggle)
  );
};

export const getCommonGrayCard = (children) => {
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
              overflow: "visible",
            },
          }),
        },
        gridDefination: {
          xs: 12,
        },
      },
    },
    gridDefination: {
      xs: 12,
    },
  };
};

export const getLabelOnlyValue = (value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 4,
    },
    props: {
      style: {
        marginBottom: "16px",
      },
      ...props,
    },
    children: {
      value: getCommonCaption(value),
    },
  };
};

export const onActionClick = (rowData) => {
  switch (rowData[8]) {
    case "PAY":
      return "";
    case "DOWNLOAD RECEIPT":
      "";
    case "GENERATE NEW RECEIPT":
      "";
  }
};

export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Bill No.":
      return getLocaleLabels(
        "Bill No.",
        "ABG_COMMON_TABLE_COL_BILL_NO",
        localisationLabels
      );

    case "Consumer Name":
      return getLocaleLabels(
        "Consumer Name",
        "ABG_COMMON_TABLE_COL_CONSUMER_NAME",
        localisationLabels
      );

    case "Service Category":
      return getLocaleLabels(
        "Service Category",
        "ABG_COMMON_TABLE_COL_SERVICE_CATEGORY",
        localisationLabels
      );
    case "Bill Date":
      return getLocaleLabels(
        "Bill Date",
        "ABG_COMMON_TABLE_COL_BILL_DATE",
        localisationLabels
      );

    case "Bill Amount(Rs)":
      return getLocaleLabels(
        "Bill Amount(Rs)",
        "ABG_COMMON_TABLE_COL_BILL_AMOUNT",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "ABG_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );
    case "Action":
      return getLocaleLabels(
        "Action",
        "ABG_COMMON_TABLE_COL_ACTION",
        localisationLabels
      );

    case "Consumer ID":
      return getLocaleLabels(
        "Consumer ID",
        "ABG_COMMON_TABLE_COL_CONSUMER_ID",
        localisationLabels
      );

    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "ABG_COMMON_TABLE_COL_OWN_NAME",
        localisationLabels
      );

    case "Download":
      return getLocaleLabels(
        "Download",
        "ABG_COMMON_TABLE_COL_DOWNLOAD_BUTTON"
      );

    case "View button":
      return getLocaleLabels(
        "Action",
        "ABG_COMMON_TABLE_COL_VIEW_BUTTON",
        localisationLabels
      );

    case "ACTIVE":
      return getLocaleLabels(
        "Pending",
        "BILL_GENIE_ACTIVE_LABEL",
        localisationLabels
      );

    case "CANCELLED":
      return getLocaleLabels(
        "Cancelled",
        "BILL_GENIE_CANCELLED_LABEL",
        localisationLabels
      );

    case "PAID":
      return getLocaleLabels(
        "Paid",
        "BILL_GENIE_PAID_LABEL",
        localisationLabels
      );
    case "PAY":
    case "PARTIALLY PAID":
      return getLocaleLabels("PAY", "BILL_GENIE_PAY", localisationLabels);
    case "EXPIRED":
      return getLocaleLabels(
        "Expired",
        "BILL_GENIE_EXPIRED",
        localisationLabels
      );
    case "GENERATE NEW BILL":
      return getLocaleLabels(
        "GENERATE NEW BILL",
        "BILL_GENIE_GENERATE_NEW_BILL",
        localisationLabels
      );

    case "DOWNLOAD RECEIPT":
      return getLocaleLabels(
        "DOWNLOAD RECEIPT",
        "BILL_GENIE_DOWNLOAD_RECEIPT",
        localisationLabels
      );
    case "Search Results for Bill":
      return getLocaleLabels(
        "Search Results for Bill",
        "BILL_GENIE_SEARCH_TABLE_HEADER",
        localisationLabels
      );
    case "PARTIALLY_PAID":
    case "PARTIALLY PAID":
      return getLocaleLabels(
        "Partially Paid",
        "BILL_GENIE_PARTIALLY_PAID",
        localisationLabels
      );
    case "BILL_GENIE_GROUP_SEARCH_HEADER":
      return getLocaleLabels(
        "Search Results for Group Bills",
        "BILL_GENIE_GROUP_SEARCH_HEADER",
        localisationLabels
      );
  }
};

export const loadCertDetails = async (action, state, dispatch, data) => {
  let requestBody = {};
  const queryParams = [
    { key: "tenantId", value: data.tenantId },
    { key: "id", value: data.id },
  ];

  if (data.birthcertificateno)
    queryParams.push({
      key: "birthcertificateno",
      value: data.birthcertificateno,
    });
  else if (data.deathcertificateno)
    queryParams.push({
      key: "deathcertificateno",
      value: data.deathcertificateno,
    });

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      `/birth-death-services/${data.module}/_viewcertdata`,
      "_viewcertdata",
      queryParams,
      requestBody
    );
    return payload;
  } catch (e) {
    toggleSnackbar(
      true,
      {
        labelName: "Api Error",
        labelKey: "ERR_API_ERROR",
      },
      "error"
    );
    //return {"RequestInfo":{"apiId":"Mihy","ver":".01","ts":null,"resMsgId":"uief87324","msgId":"20170310130900|en_IN","status":"successful"},"BirthCertificate":[{"id":"1","createdby":null,"createdtime":null,"dateofbirth":1614063655148,"dateofreport":1614063655148,"firstname":"san","gender":1,"hospitalname":null,"informantsaddress":null,"informantsname":null,"lastname":null,"middlename":null,"placeofbirth":"Bangalore","registrationno":"2021-1","remarks":null,"lastmodifiedby":null,"lastmodifiedtime":null,"counter":0,"tenantid":null,"fullname":"SRI V S","birthFatherInfo":{"id":null,"aadharno":null,"createdby":null,"createdtime":null,"education":null,"emailid":null,"firstname":"abc","lastname":null,"middlename":null,"mobileno":null,"nationality":null,"proffession":null,"religion":null,"lastmodifiedby":null,"lastmodifiedtime":null,"fullname":"R S H"},"birthMotherInfo":{"id":null,"aadharno":null,"createdby":null,"createdtime":null,"education":null,"emailid":null,"firstname":"abc1","lastname":null,"middlename":null,"mobileno":null,"nationality":null,"proffession":null,"religion":null,"lastmodifiedby":null,"lastmodifiedtime":null,"fullname":"S V H"},"birthPermaddr":{"fullAddress":"100 112 CROSS 108 Church Servant Qtr. Jalapahar"},"birthPresentaddr":{"fullAddress":"100 112 CROSS 108 Church Servant Qtr. Jalapahar"}}]};
  }
};

export const loadFullCertDetails = async (action, state, dispatch, data) => {
  let requestBody = {};
  const queryParams = [
    { key: "tenantId", value: data.tenantId },
    { key: "id", value: data.id },
  ];

  let payload = null;
  try {
    payload = await httpRequest(
      "post",
      `/birth-death-services/${data.module}/_viewfullcertdata`,
      "_viewcertdata",
      queryParams,
      requestBody
    );
    return payload;
  } catch (e) {
    toggleSnackbar(
      true,
      {
        labelName: "Api Error",
        labelKey: "ERR_API_ERROR",
      },
      "error"
    );
    return payload;
    //return {"RequestInfo":{"apiId":"Mihy","ver":".01","ts":null,"resMsgId":"uief87324","msgId":"20170310130900|en_IN","status":"successful"},"BirthCertificate":[{"id":"1","createdby":null,"createdtime":null,"dateofbirth":1614063655148,"dateofreport":1614063655148,"firstname":"san","gender":1,"hospitalname":null,"informantsaddress":null,"informantsname":null,"lastname":null,"middlename":null,"placeofbirth":"Bangalore","registrationno":"2021-1","remarks":null,"lastmodifiedby":null,"lastmodifiedtime":null,"counter":0,"tenantid":null,"fullname":"SRI V S","birthFatherInfo":{"id":null,"aadharno":null,"createdby":null,"createdtime":null,"education":null,"emailid":null,"firstname":"abc","lastname":null,"middlename":null,"mobileno":null,"nationality":null,"proffession":null,"religion":null,"lastmodifiedby":null,"lastmodifiedtime":null,"fullname":"R S H"},"birthMotherInfo":{"id":null,"aadharno":null,"createdby":null,"createdtime":null,"education":null,"emailid":null,"firstname":"abc1","lastname":null,"middlename":null,"mobileno":null,"nationality":null,"proffession":null,"religion":null,"lastmodifiedby":null,"lastmodifiedtime":null,"fullname":"S V H"},"birthPermaddr":{"fullAddress":"100 112 CROSS 108 Church Servant Qtr. Jalapahar"},"birthPresentaddr":{"fullAddress":"100 112 CROSS 108 Church Servant Qtr. Jalapahar"}}]};
  }
};

export const loadMdmsData = async (action, state, dispatch) => {
  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
            { name: "citymodule" },
          ],
        },
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "Help" }],
        },
      ],
    },
  };

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );
    if (payload) {
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      const citymodule = get(payload, "MdmsRes.tenant.citymodule");
      const liveTenants =
        citymodule && citymodule.filter((item) => item.code === "UC");
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.tenant.citiesByModule",
          get(liveTenants[0], "tenants")
        )
      );
    }
    return payload;
  } catch (e) {}
};

export const loadHospitals = async (
  action,
  state,
  dispatch,
  module,
  tenantId
) => {
  let requestBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "birth-death-service",
          masterDetails: [
            {
              name: "hospitalList",
            },
          ],
        },
      ],
    },
  };
  let payload = null;

  const queryParams = [{ key: "tenantId", value: tenantId }];

  try {
    payload = await httpRequest(
      "post",
      "egov-mdms-service/v1/_search",
      "_search",
      queryParams,
      requestBody
    );
  } catch (e) {
    toggleSnackbar(
      true,
      {
        labelName: "",
        labelKey: "ERR_API_ERROR",
      },
      "error"
    );
  }
  return payload;
};

export const downloadCert = async (tenantId, id, module) => {
  let requestBody = {};
  let payload = null;

  const queryParams = [
    { key: "tenantId", value: tenantId },
    { key: "id", value: id },
    { key: "source", value: captureSource() },
    // { key: "source" , value: "web" }
  ];
  try {
    payload = await httpRequest(
      "post",
      `/birth-death-services/${module}/_download`,
      "_download",
      queryParams,
      requestBody
    );
  } catch (e) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelCode: e.message },
        "error"
      )
    );
    // store.dispatch(
    //   toggleSnackbar(
    //     true,
    //     {
    //       labelName: "Could not initiate download",
    //       labelKey: "ERR_API_ERROR"
    //     },
    //     "error"
    //   )
    // );
    //toBeRemoved
    //payload = {consumerCode:"CH-CB-AGRA-2020-001504", filestoreId:"4f0d9299-7fa0-4af6-9077-389ebf2367c4", tenantId: "pb.agra"};
  }

  return payload;
};

export const postPaymentSuccess = async (data) => {
  store.dispatch(toggleSpinner());
  setTimeout(() => {
    postPaymentActivity(data);
    store.dispatch(toggleSpinner());
  }, 4000); //Give 2 sec gap so that the screen is loaded correctly
};

export const postPaymentActivity = async (
  data,
  doDownloadCertificate = true
) => {
  try {
    if (data.tenantId && data.consumerCode) {
      store.dispatch(toggleSpinner());
      let queryParams = [
        { key: "tenantId", value: data.tenantId },
        { key: "consumerCode", value: data.consumerCode },
      ];
      let module = data.businessService == "BIRTH_CERT" ? "birth" : "death";
      const response = await httpRequest(
        "post",
        `birth-death-services/${module}/_getfilestoreid`,
        "getfilestoreid",
        queryParams,
        {} //{ searchCriteria: queryObject }
      );
      store.dispatch(toggleSpinner());
      if (doDownloadCertificate && response && response.filestoreId) {
        let mode = "download";
        downloadReceiptFromFilestoreID(response.filestoreId, mode);

        store.dispatch(hideSpinner());
        /*
        Redirection removed
        setTimeout(() => {
          // store.dispatch(toggleSpinner());
          store.dispatch(setRoute(`/${module}-citizen/myApplications`));
        }, 5000); //Give 5 sec gap redirect to my applications page.
        */
      }
      return response;
    }
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const triggerDownload = (module) => {
  const state = store.getState();
  const certificateId = get(
    state,
    `screenConfiguration.preparedFinalObject.bnd.${module}.download.certificateId`
  );
  const tenantId = get(
    state,
    `screenConfiguration.preparedFinalObject.bnd.${module}.download.tenantId`
  );
  const businessService = get(
    state,
    `screenConfiguration.preparedFinalObject.bnd.${module}.download.businessService`
  );

  downloadCert(tenantId, certificateId, module).then((response) => {
    if (response && response.consumerCode) {
      // Redirect to payment page
      const appName =
        process.env.REACT_APP_NAME === "Citizen" ? "citizen" : "employee";

      const url =
        process.env.NODE_ENV === "development"
          ? `/egov-common/pay?consumerCode=${response.consumerCode}&tenantId=${tenantId}&businessService=${businessService}`
          : `/${appName}/egov-common/pay?consumerCode=${response.consumerCode}&tenantId=${tenantId}&businessService=${businessService}`;
      document.location.href = `${document.location.origin}${url}`;
    } else if (response && response.filestoreId) {
      downloadReceiptFromFilestoreID(response.filestoreId, "download");
    }
  });
};

export const downloadReceipt = async (consumerCode, tenantId) => {
  const state = store.getState();

  store.dispatch(toggleSpinner());
  let queryParams = [
    { key: "tenantId", value: tenantId },
    { key: "consumerCodes", value: consumerCode },
  ];
  const response = await httpRequest(
    "post",
    "collection-services/payments/_search",
    "_search",
    queryParams,
    {} //{ searchCriteria: queryObject }
  );
  store.dispatch(toggleSpinner());
  if (response && response.Payments && response.Payments.length > 0) {
    if (response.Payments[0].fileStoreId) {
      let mode = "download";
      downloadReceiptFromFilestoreID(response.Payments[0].fileStoreId, mode);
    } else {
      const receiptQueryString = [
        { key: "consumerCode", value: consumerCode },
        { key: "tenantId", value: tenantId },
        {
          key: "bussinessService",
          value: response.Payments[0].paymentDetails[0].businessService,
        },
      ];
      downloadConReceipt(
        receiptQueryString,
        "consolidatedreceipt",
        "PAYMENT",
        `RECEIPT-${consumerCode}.pdf`
      );
    }
  } else {
    store.dispatch(setRoute(`/uc-citizen/search`));
  }
  return response;
};
