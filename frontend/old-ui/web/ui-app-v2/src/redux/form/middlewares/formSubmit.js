import * as actionTypes from "../actionTypes";
import { resetForm } from "../actions";
import { authenticated, userProfileUpdated } from "redux/auth/actions";
import { toggleSnackbarAndSetText } from "redux/app/actions";
import { addQueryArg, mergeMDMSDataArray } from "utils/commons";
import { setRoute } from "redux/app/actions";
import { fetchComplaints } from "redux/complaints/actions";
import { dataFetchComplete } from "redux/mdms/actions";
import get from "lodash/get";

const formSubmit = (store) => (next) => (action) => {
  const { type, formKey, payload, form } = action;
  const dispatch = store.dispatch;

  if (type == actionTypes.SUBMIT_FORM_COMPLETE) {
    // complete the form submit complete action
    next(action);
    const state = store.getState();
    let { redirectionRoute, idJsonPath, toast } = state.form[formKey];

    //for Mdms Screens
    if (formKey.includes("MDMS")) {
      const { moduleName, masterName } = state.mdms;
      delete payload.ResponseInfo;
      const mdmsResponse = payload.MdmsRes;
      const newMdmsRow = mdmsResponse[moduleName][masterName][0];
      const currentMdmsData = state.mdms.data[moduleName][masterName];
      dispatch(
        dataFetchComplete({ MdmsRes: { [moduleName]: { [masterName]: mergeMDMSDataArray(currentMdmsData, newMdmsRow) } } }, moduleName, masterName)
      );
    }

    // for login/register flow
    if (formKey === "otp") {
      redirectionRoute = "/citizen";
      delete payload.ResponseInfo;
      dispatch(authenticated(payload));
    }
    //employee login authenticated
    if (formKey === "employeeLogin") {
      delete payload.ResponseInfo;
      dispatch(authenticated(payload));
    }

    // for profile update
    if (formKey === "profile") {
      delete payload.responseInfo;
      dispatch(userProfileUpdated(payload));
    }

    // use a flag reset true or false
    if (
      formKey !== "login" &&
      formKey !== "register" &&
      formKey !== "profile" &&
      formKey !== "employeeLogin" &&
      formKey !== "profileEmployee" &&
      formKey !== "employeeForgotPasswd"
    ) {
      dispatch(resetForm(formKey));
    }

    if (formKey === "comment") {
      dispatch(fetchComplaints([{ key: "serviceRequestId", value: decodeURIComponent(window.location.href.split("/").pop()) }]));
    }

    if (formKey === "assignComplaint") {
      if (payload && payload.actionHistory && payload.actionHistory[0].actions[0].action === "assign") {
        dispatch(setRoute(`/employee/complaint-assigned/${encodeURIComponent(payload.services[0].serviceRequestId)}`));
      } else if (payload && payload.actionHistory && payload.actionHistory[0].actions[0].action === "reassign") {
        dispatch(setRoute(`/employee/complaint-reassigned/${encodeURIComponent(payload.services[0].serviceRequestId)}`));
      }
    }

    if (redirectionRoute && redirectionRoute.length) {
      redirectionRoute = idJsonPath ? addQueryArg(redirectionRoute, [{ key: "id", value: get(payload, idJsonPath) }]) : redirectionRoute;
      dispatch(setRoute(redirectionRoute));
    }

    if (toast && toast.length) {
      dispatch(toggleSnackbarAndSetText(true, toast, false));
    }
  } else {
    next(action);
  }
};

export default formSubmit;
