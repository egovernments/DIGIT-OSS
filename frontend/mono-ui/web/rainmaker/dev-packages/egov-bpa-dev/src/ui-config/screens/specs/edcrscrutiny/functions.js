// import { httpRequest } from "../../../../../ui-utils";
import axios from "axios";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api.js";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { edcrHttpRequest } from "../../../../ui-utils/api";
import { getBpaSearchResults } from "../../../../ui-utils/commons";
import { convertDateToEpoch, getLicenseDetails, validateFields } from "../utils";
const userTenant = getTenantId();
const userUUid = get(JSON.parse(getUserInfo()), "uuid");
export const fetchData = async (
  action,
  state,
  dispatch,
  fromMyApplicationPage = false
) => {
  dispatch(prepareFinalObject("searchResults", []));
  dispatch(prepareFinalObject("myApplicationsCount", 0));

  const response = await getSearchResultsfromEDCR(action, state, dispatch);
  try {
    if (response && response.edcrDetail) {
      dispatch(prepareFinalObject("searchResults", response.edcrDetail));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.edcrDetail.length)
      );
      const myApplicationsCount = response.edcrDetail.length;
      if (fromMyApplicationPage) {
        dispatch(
          handleField(
            "my-applications",
            "components.div.children.header.children.key",
            "props.dynamicArray",
            myApplicationsCount ? [myApplicationsCount] : [0]
          )
        );
      }
    }
  } catch (error) {
  }
};


export const fetchDataForStakeHolder = async (
  action,
  state,
  dispatch,
  fromMyApplicationPage = false
) => {
  dispatch(prepareFinalObject("searchResults", []));
  dispatch(prepareFinalObject("myApplicationsCount", 0));

  const response = await getSearchResultsfromEDCR(action, state, dispatch);
  try {
    if (response && response.edcrDetail && response.edcrDetail.length > 0) {
      dispatch(prepareFinalObject("searchResults", response.edcrDetail));
      dispatch(prepareFinalObject("myApplicationsCount", response.edcrDetail.length));

      let searchConvertedArray = [];
      response.edcrDetail.forEach(element => {
        let planReportUrl = element.planReport;
        let dxfFileurl = element.dxfFile;
        let planReportUrlValue, dxfFileurlValue;
        planReportUrlValue = (!planReportUrl.includes("https") && window.location.href.includes("https")) ? planReportUrl.replace(/http/g, "https") : planReportUrl;
        dxfFileurlValue = (!dxfFileurl.includes("https") && window.location.href.includes("https")) ? dxfFileurl.replace(/http/g, "https") : dxfFileurl;
        searchConvertedArray.push({
          ["EDCR_COMMON_TABLE_APPL_NO"]: element.applicationNumber || "-",
          ["EDCR_COMMON_TABLE_SCRUTINY_NO"]: (element.edcrNumber === "null" ? "NA" : element.edcrNumber) || "NA",
          ["EDCR_COMMON_TABLE_CITY_LABEL"]: (element.tenantId).split('.')[1] || "-",
          ["EDCR_COMMON_TABLE_APPL_NAME"]: element.planDetail.planInformation.applicantName || "-",
          ["EDCR_COMMON_TABLE_COL_STATUS"]: element.status || "-",
          ["EDCR_DOWNLOAD_REPORT"]: getLocaleLabels("DOWNLOAD SCRUTINY REPORT", "EDCR_DOWNLOAD_REPORT"),
          ["EDCR_DOWNLOAD_BUILDING_PLAN"]: getLocaleLabels("DOWNLOAD BUILDING PLAN(DXF)", "EDCR_DOWNLOAD_BUILDING_PLAN"),
          ["EDCR_DOWNLOAD_REPORT1"]: planReportUrlValue, //element.planReport,
          ["EDCR_DOWNLOAD_BUILDING_PLAN1"]: dxfFileurlValue //element.dxfFile,
        })
      });

      dispatch(
        handleField(
          "my-applications-stakeholder",
          "components.div.children.applicationsCard",
          "props.data",
          searchConvertedArray
        ));
      dispatch(
        handleField(
          "my-applications-stakeholder",
          "components.div.children.applicationsCard",
          "props.rows",
          searchConvertedArray.length
        )
      );
    }
  } catch (error) {
  }
};

export const uuidv4 = () => {
  return require("uuid/v4")();
};

const moveToSuccess = (state, dispatch, edcrDetail, isOCApp) => {
  const applicationNo = edcrDetail.transactionNumber;

  const tenantId = edcrDetail.tenantId;
  const edcrNumber = get(edcrDetail, "edcrNumber");

  const purpose = isOCApp ? "ocapply" : "apply";
  let status = edcrDetail.status === "Accepted" ? "success" : "rejected";
  if (edcrDetail.status == "Aborted") {
    status = "aborted";
  }
  // let url = `/edcrscrutiny/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`;
  if (isOCApp) {
    let ocApplyPath = get(
      state.screenConfiguration,
      "screenConfig.acknowledgement.components.div.children.gotoHomeFooter.children.ocCreateApp.onClickDefination.path", ""
    );
    if (ocApplyPath) {
      dispatch(
        handleField(
          "acknowledgement",
          "components.div.children.gotoHomeFooter.children.ocCreateApp",
          "onClickDefination.path",
          `/oc-bpa/apply?tenantId=${tenantId}&edcrNumber=${edcrNumber}`
        )
      );
    }
  } else {
    let ocApplyPath = get(
      state.screenConfiguration,
      "screenConfig.acknowledgement.components.div.children.gotoHomeFooter.children.bpaCreateApp.onClickDefination.path", ""
    );
    if (ocApplyPath) {
      dispatch(
        handleField(
          "acknowledgement",
          "components.div.children.gotoHomeFooter.children.bpaCreateApp",
          "onClickDefination.path",
          `/egov-bpa/apply?tenantId=${tenantId}&edcrNumber=${edcrNumber}`
        )
      );
    }
  }
  let url = `/edcrscrutiny/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}&edcrNumber=${edcrNumber}`;
  dispatch(
    setRoute(
      url
    )
  );
};

const getSearchResultsfromEDCR = async (action, state, dispatch) => {
  try {
    let EDCRHost = "";
    const authToken = getAccessToken();
    const response = await axios.post(
      `${EDCRHost}/edcr/rest/dcr/scrutinydetails?tenantId=${getTenantId()}`,
      {
        RequestInfo: {
          apiId: "1",
          ver: "1",
          ts: "01-01-2017 01:01:01",
          action: "create",
          did: "jh",
          key: "",
          msgId: "gfcfc",
          correlationId: "wefiuweiuff897",
          authToken: authToken,
          userInfo: {
            id: userUUid,
            tenantId: userTenant
          }
        }
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getSearchResultsfromEDCRWithApplcationNo = async (
  applicationNumber,
  tenantId
) => {
  try {
    let EDCRHost = "";
    const authToken = getAccessToken();
    const response = await axios.post(
      `${EDCRHost}/edcr/rest/dcr/scrutinydetails?tenantId=${tenantId}&transactionNumber=${applicationNumber}`,
      {
        RequestInfo: {
          apiId: "1",
          ver: "1",
          ts: "01-01-2017 01:01:01",
          action: "create",
          did: "jh",
          key: "",
          msgId: "gfcfc",
          correlationId: "wefiuweiuff897",
          authToken: authToken,
          userInfo: {
            id: userUUid,
            tenantId: userTenant
          }
        }
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    return null;
  }
};

const scrutinizePlan = async (state, dispatch) => {
  try {
    dispatch(toggleSpinner());

    let { screenConfiguration } = state;
    let { preparedFinalObject } = screenConfiguration;
    let isOCApp = window.location.href.includes("ocapply");
    let tenantId = get(preparedFinalObject, "Scrutiny[0].tenantId");
    let appliactionType = isOCApp ? "BUILDING_OC_PLAN_SCRUTINY" : "BUILDING_PLAN_SCRUTINY";
    let applicationSubType = "NEW_CONSTRUCTION";

    let userInfo = { id: userUUid, tenantId: userTenant }, edcrNumber = "";

    if (isOCApp) {
      userInfo = { id: userUUid, tenantId: tenantId },
        edcrNumber = get(state.screenConfiguration.preparedFinalObject, "bpaDetails.edcrNumber");
    }
    else { userInfo = { id: userUUid, tenantId: userTenant } }

    let edcrRequest = {
      transactionNumber: "",
      edcrNumber: edcrNumber,
      planFile: null,
      tenantId: "",
      RequestInfo: {
        apiId: "",
        ver: "",
        ts: "",
        action: "",
        did: "",
        authToken: "",
        key: "",
        msgId: "",
        correlationId: "",
        userInfo: userInfo
      }
    };
    //generate trx no
    const transactionNumber = uuidv4();
    //
    const applicantName = get(preparedFinalObject, "Scrutiny[0].applicantName");
    const file = get(preparedFinalObject, "Scrutiny[0].buildingPlan[0]");
    const permitNumber = get(preparedFinalObject, "Scrutiny[0].permitNumber");
    const permitDate = get(preparedFinalObject, "bpaDetails.approvalDate");
    const comparisonEdcrNumber = get(preparedFinalObject, "bpaDetails.edcrNumber");

    edcrRequest = { ...edcrRequest, tenantId };
    edcrRequest = { ...edcrRequest, transactionNumber };
    edcrRequest = { ...edcrRequest, applicantName };
    edcrRequest = { ...edcrRequest, appliactionType };
    edcrRequest = { ...edcrRequest, applicationSubType };

    let url = `/edcr/rest/dcr/scrutinize?tenantId=${tenantId}`;
    if (isOCApp) {
      edcrRequest = { ...edcrRequest, permitDate };
      edcrRequest = { ...edcrRequest, permitNumber };
      edcrRequest = { ...edcrRequest, comparisonEdcrNumber };
    }

    var bodyFormData = new FormData();
    bodyFormData.append("edcrRequest", JSON.stringify(edcrRequest));
    bodyFormData.append("planFile", file);
    const authToken = getAccessToken();

    let response = await axios({
      method: "post",
      url: url,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data", "auth-token": authToken }
    });
    if (response) {
      let { data } = response;
      if (data.edcrDetail) {
        dispatch(prepareFinalObject("edcrDetail", data.edcrDetail));
        dispatch(toggleSpinner());
        moveToSuccess(state, dispatch, data.edcrDetail[0], isOCApp);
      }
    }
  } catch (e) {
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
    dispatch(toggleSpinner());
  }
};

export const resetFields = (state, dispatch) => {
  let filedata = get(
    state.screenConfiguration.preparedFinalObject,
    "Scrutiny[0].buildingPlan[0]"
  );

  if (typeof filedata === "object" && !Array.isArray(filedata)) {
    window.location.reload();
  } else {
    dispatch(
      handleField(
        "apply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.applicantName",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.dropdown",
        "props.value",
        { name: "", code: "" }
      )
    );
  }
  dispatch(prepareFinalObject("Scrutiny[0].buildingPlan[0]", []));
  dispatch(prepareFinalObject("Scrutiny[0].tenantId", ""));
  dispatch(prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux[0]", []));
};

export const validateForm = (state, dispatch) => {
  let screenKey = window.location.href.includes("ocapply") ? "ocapply" : "apply";
  let isInputDataValid = validateFields(
    "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children",
    state,
    dispatch,
    screenKey
  );

  if (screenKey == "ocapply") {
    let applicantName = get(
      state.screenConfiguration.preparedFinalObject,
      "Scrutiny[0].applicantName", ""
    )
    if (!applicantName) {
      let errorMessage = {
        labelName: "Please fill date and permit number and click on search",
        labelKey: "ERR_FILL_MANDATORY_FIELDS_PERMIT_SEARCH"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
  }

  let filedata = get(
    state.screenConfiguration.preparedFinalObject,
    "Scrutiny[0].buildingPlan[0]"
  );
  let isDocValid = false;
  isDocValid =
    filedata && typeof filedata === "object" && !Array.isArray(filedata);

  return isDocValid && isInputDataValid;
};

export const submitFields = async (state, dispatch) => {
  if (validateForm(state, dispatch)) {
    let a = await scrutinizePlan(state, dispatch);
  } else {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};

export const getMdmsData = async () => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
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
  }
};

export const fetchMDMSData = async (action, state, dispatch) => {
  const mdmsRes = await getMdmsData(dispatch);
  let TenantList = [];
  if (mdmsRes && mdmsRes.MdmsRes && mdmsRes.MdmsRes.tenant) {
    mdmsRes.MdmsRes.tenant.citymodule.forEach(element => {
      if (element.code === "BPAREG") {
        element.tenants.forEach(tenant => {
          TenantList.push({ code: tenant.code, name: tenant.code });
        });
      }
    });
  }
  dispatch(prepareFinalObject("applyScreenMdmsData.tenantData", TenantList));
};

export const fetchMDMSOCData = async (action, state, dispatch) => {
  const mdmsRes = await getMdmsDataForOc(dispatch);
  if (mdmsRes && mdmsRes.MdmsRes) {
    let tenants = mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "BPAAPPLY") return true;
    });
    mdmsRes.MdmsRes.tenantData = tenants.tenants;
    dispatch(prepareFinalObject("applyScreenMdmsData", mdmsRes.MdmsRes));
  }
};

export const getMdmsDataForOc = async () => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "citymodule" }]
        },
        {
          moduleName: "BPA",
          masterDetails: [{ name: "ServiceType" }]
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
  }
};

const visibleHiddenSearchFields = async (state, dispatch, isTrue) => {
  if (isTrue) {
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.buttonContainer",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.ocScrutinyDetailsContainer",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.dummyDiv2",
        "visible",
        true
      )
    );
  } else {
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.buttonContainer",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.ocScrutinyDetailsContainer",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.dummyDiv2",
        "visible",
        false
      )
    );
  }
}

export const getBuildingDetails = async (state, dispatch, fieldInfo) => {
  let permitNum = get(
    state.screenConfiguration.preparedFinalObject,
    `Scrutiny[0].permitNumber`,
    ""
  );
  let permitDate = get(
    state.screenConfiguration.preparedFinalObject,
    `Scrutiny[0].permitDate`,
    ""
  );
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    `Scrutiny[0].tenantId`,
    ""
  );
  if (!permitDate || !permitNum || !tenantId) {
    let errorMessage = {
      labelName: "Please fill all date, permit number and city then click on search",
      labelKey: "ERR_FILL_MANDATORY_FIELDS_PERMIT_SEARCH"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }

  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "approvalNo", value: permitNum },
    { key: "permitDate", value: convertDateToEpoch(permitDate) }
  ];
  const response = await getBpaSearchResults(queryObject);

  if (get(response, "BPA[0].edcrNumber") == undefined) {
    visibleHiddenSearchFields(state, dispatch, false);
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "No Records Found",
          labelKey: "BPA_NO_REC_FOUND_LABEL"
        },
        "error"
      )
    );
    return;
  }

  const dateFromApi = new Date(get(response, "BPA[0].approvalDate"));
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  let date = `${year}-${month}-${day}`;
  if (permitNum === get(response, "BPA[0].approvalNo") && date === permitDate) {

    let edcrRes = await edcrHttpRequest(
      "post",
      "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + get(response, "BPA[0].edcrNumber") + "&tenantId=" + tenantId,
      "search", []
    );

    let SHLicenseDetails = await getLicenseDetails(state, dispatch);

    if (get(edcrRes, "edcrDetail[0]") && SHLicenseDetails) {
      visibleHiddenSearchFields(state, dispatch, true);
    } else {
      visibleHiddenSearchFields(state, dispatch, false);
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "No Records Found",
            labelKey: "BPA_NO_REC_FOUND_LABEL"
          },
          "error"
        )
      );
      return;
    }
    set(response, "BPA[0].serviceType", "NEW_CONSTRUCTION")
    let primaryOwnerArray = get(response, "BPA[0].landInfo.owners").filter(owr => owr && owr.isPrimaryOwner && owr.isPrimaryOwner == true);
    dispatch(prepareFinalObject(`Scrutiny[0].applicantName`, primaryOwnerArray.length && primaryOwnerArray[0].name));
    dispatch(prepareFinalObject(`bpaDetails`, get(response, "BPA[0]")));
    dispatch(prepareFinalObject(`scrutinyDetails`, edcrRes.edcrDetail[0]));
    dispatch(prepareFinalObject(`bpaDetails.appliedBy`, SHLicenseDetails));
  } else {
    let errorMessage = {
      labelName: "Please select approval date",
      labelKey: "ERR_FILL_EDCR_PERMIT_INCORRECT_DATE"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
};

export const resetOCFields = (state, dispatch) => {
  const applicantName = get(
    state.screenConfiguration.preparedFinalObject,
    "Scrutiny[0].applicantName"
  );
  let filedata = get(
    state.screenConfiguration.preparedFinalObject,
    "Scrutiny[0].buildingPlan[0]"
  );

  if (applicantName || (typeof filedata === "object" && !Array.isArray(filedata))) {
    window.location.reload();
  }

  dispatch(
    handleField(
      "ocapply",
      "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.buildingPermitDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "ocapply",
      "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.buildingPermitNum",
      "props.value",
      ""
    )
  );
  dispatch(prepareFinalObject("Scrutiny[0].buildingPlan[0]", []));
  dispatch(prepareFinalObject("Scrutiny[0].permitDate", ""));
  dispatch(prepareFinalObject("Scrutiny[0].permitNumber", ""));
  dispatch(prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux[0]", []));
}