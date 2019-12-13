// import { httpRequest } from "../../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import axios from "axios";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

import get from "lodash/get";
import set from "lodash/set";
import { validateFields } from "../utils";

export const fetchData = async (action, state, dispatch) => {
  const response = await getSearchResultsfromEDCR(action, state, dispatch);
  try {
    if (response && response.edcrDetail) {
      dispatch(prepareFinalObject("searchResults", response.edcrDetail));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.edcrDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const uuidv4 = () => {
  return require("uuid/v4")();
};

const moveToSuccess = (dispatch, edcrDetail) => {
  const applicationNo = edcrDetail.transactionNumber;

  const tenantId = edcrDetail.tenantId;

  const purpose = "apply";
  const status = edcrDetail.status === "Accepted" ? "success" : "rejected";
  dispatch(
    setRoute(
      `/edcrscrutiny/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`
    )
  );
};

const getSearchResultsfromEDCR = async (action, state, dispatch) => {
  try {
    let EDCRHost = process.env.REACT_APP_EDCR_API_HOST
      ? process.env.REACT_APP_EDCR_API_HOST
      : "https://egov-dcr-galaxy.egovernments.org";

    const response = await axios.post(
      `${EDCRHost}/edcr/rest/dcr/scrutinydetails?tenantId=pb.amritsar`,
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
          authToken: "",
          userInfo: {
            id: 1,
            tenantId: "generic"
          }
        }
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const scrutinizePlan = async (state, dispatch) => {
  try {
    dispatch(toggleSpinner());

    let edcrRequest = {
      transactionNumber: "",
      edcrNumber: "",
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
        userInfo: {
          id: ""
        }
      }
    };
    //generate trx no
    const transactionNumber = uuidv4();
    //
    let { screenConfiguration } = state;
    let { preparedFinalObject } = screenConfiguration;
    const tenantId = get(preparedFinalObject, "Scrutiny[0].tenantId");
    const name = get(preparedFinalObject, "Scrutiny[0].applicantName");
    const file = get(preparedFinalObject, "Scrutiny[0].buildingPlan[0]");

    edcrRequest = { ...edcrRequest, tenantId };
    edcrRequest = { ...edcrRequest, transactionNumber };
    set(edcrRequest, "RequestInfo.userInfo.name", name);
    var bodyFormData = new FormData();
    bodyFormData.append("edcrRequest", JSON.stringify(edcrRequest));
    bodyFormData.append("planFile", file);
    let EDCRHost = process.env.REACT_APP_EDCR_API_HOST
      ? process.env.REACT_APP_EDCR_API_HOST
      : "https://egov-dcr-galaxy.egovernments.org";

    let response = await axios({
      method: "post",
      url: `${EDCRHost}/edcr/rest/dcr/scrutinizeplan?tenantId=${tenantId}`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (response) {
      let { data } = response;
      if (data.edcrDetail) {
        dispatch(prepareFinalObject("edcrDetail", data.edcrDetail));
        dispatch(toggleSpinner());
        moveToSuccess(dispatch, data.edcrDetail[0]);
      }
    }
  } catch (e) {
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
    dispatch(toggleSpinner());
    console.log(e);
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
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.tenantId",
        "props.value",
        ""
      )
    );
  }

  dispatch(prepareFinalObject("Scrutiny[0].buildingPlan[0]", []));
  dispatch(prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux[0]", []));
};

export const validateForm = (state, dispatch) => {
  let isInputDataValid = validateFields(
    "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children",
    state,
    dispatch
  );

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
