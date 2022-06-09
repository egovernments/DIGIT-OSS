import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getUserInfo,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {set,get} from "lodash";
import { getQueryArg,getTransformedLocalStorgaeLabels ,getLocaleLabels} from "egov-ui-framework/ui-utils/commons";
import { 
  handleScreenConfigurationFieldChange as handleField,prepareFinalObject, 
  toggleSnackbar 
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getCommonCard,
  getCommonCaption
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../ui-utils";
import commonConfig from "config/common.js";
import {getRequiredDocuments} from "../../../../ui-containers-local/RequiredDocuments/reqDocs";

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

export const getMdmsData = async  requestBody=> {
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
export const getRequiredDocData = async (action, dispatch, moduleDetails, closePopUp) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId:commonConfig.tenantId,
      moduleDetails: moduleDetails
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
    const moduleName = moduleDetails[0].moduleName;
    let documents = get(
      payload.MdmsRes,
      `${moduleName}.documentObj`,
      []
    );

    if (moduleName === "PropertyTax") {
      payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[1].tenants;
    }
   
    const reqDocuments = getRequiredDocuments(documents, moduleName, footerCallBackForRequiredDataModal(moduleName, closePopUp));
    set(
      action,
      "screenConfig.components.adhocDialog.children.popup",
      reqDocuments
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    return { payload, reqDocuments };
  } catch (e) {
  }
};
const footerCallBackForRequiredDataModal = (moduleName, closePopUp) => {
  const connectionNumber = getQueryArg( window.location.href, "connectionNumber");
  const tenantId = getQueryArg( window.location.href, "tenantId");
  const businessService = connectionNumber.includes("WS") ? "WS" : "SW";

  switch (moduleName) {
   
    case "BillAmendment":
      return (state, dispatch) => {
        const applyUrl = `/bill-amend/apply?connectionNumber=${connectionNumber}&tenantId=${tenantId}&businessService=${businessService}`;
        dispatch(setRoute(applyUrl));
      };
    }
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


export const onActionClick = (rowData) =>{
  switch(rowData[8]){
    case "PAY" : return "";
    case "DOWNLOAD RECEIPT" : ""
    case "GENERATE NEW RECEIPT" : ""
  }
}

export const getTextToLocalMapping = label => {
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
      return getLocaleLabels(
        "PAY",
        "BILL_GENIE_PAY",
        localisationLabels
      );
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
      case "BILL_GENIE_GROUP_SEARCH_HEADER" : 
          return getLocaleLabels(
            "Search Results for Group Bills",
            "BILL_GENIE_GROUP_SEARCH_HEADER",
            localisationLabels
          ); 
  }
};

export const getFetchBill = async(state, dispatch, action, queryObject) => {
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
  }
}

export const searchBill = async(state, dispatch, action, queryObject) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_search",
      "",
      queryObject
    );
    const billdetails=get(response,'Bill[0].billDetails',[]);
    set(response,'Bill[0].billDetails',billdetails.sort((x,y)=>y.fromPeriod-x.fromPeriod));
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
}

export const showApplyCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.cityPickerDialog", "props.open", !toggle)
  );
};

export const onDemandRevisionBasis = async (state, dispatch, isFromOk = true, check = false) => {
  let demandRevisionBasis = get(
    state.screenConfiguration.preparedFinalObject,
    "Amendment.amendmentReason", ""
  );
  let previousDemandRevBasisValue = get(
    state.screenConfiguration.preparedFinalObject,
    "AmendmentTemp.amendmentReason", ""
  );

  if (previousDemandRevBasisValue !== demandRevisionBasis && previousDemandRevBasisValue != "" && isFromOk && check) {
    dispatch(handleField("apply", "components.billAmdAlertDialog", "props.open", true));
  } else if (previousDemandRevBasisValue == demandRevisionBasis && isFromOk) {

  } else {
    let demandArray = [];
    switch (demandRevisionBasis) {
      case "COURT_CASE_SETTLEMENT":
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "visible",
            false
          )
        );

        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "required",
            true
          )
        );

        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "required",
            true
          )
        );

        break;
      case "ARREAR_WRITE_OFF":
      case "ONE_TIME_SETTLEMENT":
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "props.value",
            ""
          )
        );

        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "required",
            true
          )
        );

        break;
      case "DCB_CORRECTION":
      case "REMISSION_FOR_PROPERTY_TAX":
      case "OTHERS":
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.fromDate",
            "required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.toDate",
            "required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "props.required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "required",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "props.required",
            true
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.documentNo",
            "required",
            true
          )
        );
        break;
      default:
        demandArray = [false, false, false, false, false, false];
        break;
    }
  }
}

export const procedToNextStep = async (state, dispatch) => {
  const demandRevBasisValue = get( state.screenConfiguration.preparedFinalObject, "Amendment.amendmentReason", "");
  dispatch(prepareFinalObject("documentsUploadRedux", {}));
  dispatch(prepareFinalObject("documentsContract", []));
  dispatch(prepareFinalObject("AmendmentTemp.amendmentReason", demandRevBasisValue));
  dispatch(prepareFinalObject("AmendmentTemp.isPreviousDemandRevBasisValue", true));
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.demandRevisionBasis",
      "props.value",
      demandRevBasisValue
    )
  );
  onDemandRevisionBasis(state, dispatch, false);
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.billAmdAlertDialog.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.billAmdAlertDialog", "props.open", !toggle)
  );
}

export const cancelPopUp = async (state, dispatch) => {
  const previousDemandRevBasisValue = get( state.screenConfiguration.preparedFinalObject, "AmendmentTemp.amendmentReason", "");
  dispatch(prepareFinalObject("AmendmentTemp.isPreviousDemandRevBasisValue", false));
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children.demandRevisionBasis",
      "props.value",
      previousDemandRevBasisValue
    )
  );
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.billAmdAlertDialog.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.billAmdAlertDialog", "props.open", !toggle)
  );
}