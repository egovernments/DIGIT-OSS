import * as actionTypes from "../actionTypes";
import { resetForm } from "../actions";
import { authenticated, userProfileUpdated } from "egov-ui-kit/redux/auth/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { addQueryArg, mergeMDMSDataArray } from "egov-ui-kit/utils/commons";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { fetchComplaints } from "egov-ui-kit/redux/complaints/actions";
import { dataFetchComplete } from "egov-ui-kit/redux/mdms/actions";
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
      const { saveUrl } = action;
      const { editToast, createToast } = state.form[formKey];
      const mdmsToast = saveUrl.includes("_create") ? createToast : editToast;
      delete payload.ResponseInfo;
      const mdmsResponse = payload.MdmsRes;
      const newMdmsRow = mdmsResponse[moduleName][masterName][0];
      const currentMdmsData = state.mdms.data[moduleName][masterName];
      dispatch(
        dataFetchComplete({ MdmsRes: { [moduleName]: { [masterName]: mergeMDMSDataArray(currentMdmsData, newMdmsRow) } } }, moduleName, masterName)
      );
      if (mdmsToast && mdmsToast.length) {
        dispatch(toggleSnackbarAndSetText(true, { labelName: mdmsToast, labelKey: mdmsToast }, "success"));
      }
    }
    // for login/register flow
    if (formKey === "otp") {
      const previousRoute = get(state.app, "previousRoute", "");
      if (previousRoute.indexOf("smsLink=true") > 0) {
        redirectionRoute = previousRoute;
      } else {
        redirectionRoute = "/";
      }
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

    if (formKey === "employeeOTP") {
      if (payload && payload.responseInfo && payload.responseInfo.status && payload.responseInfo.status == 200)
        dispatch(
          toggleSnackbarAndSetText(
            true,
            {
              labelName: "Password changed successfully!",
              labelKey: "CS_COMMON_EMPLOYEEOTP_CHANGED_PASSWORD_SUCCESS",
            },
            "success"
          )
        );
    }

    if (formKey === "comment") {
      dispatch(fetchComplaints([{ key: "serviceRequestId", value: decodeURIComponent(window.location.href.split("/").pop()) }]));
    }

    if (formKey === "assignComplaint") {
      if (payload && payload.actionHistory && payload.actionHistory[0].actions[0].action === "assign") {
        dispatch(setRoute(`/complaint-assigned/${encodeURIComponent(payload.services[0].serviceRequestId)}`));
      } else if (payload && payload.actionHistory && payload.actionHistory[0].actions[0].action === "reassign") {
        dispatch(setRoute(`/complaint-reassigned/${encodeURIComponent(payload.services[0].serviceRequestId)}`));
      }
    }

    if (redirectionRoute && redirectionRoute.length) {
      redirectionRoute = idJsonPath ? addQueryArg(redirectionRoute, [{ key: "id", value: get(payload, idJsonPath) }]) : redirectionRoute;
      if (redirectionRoute && redirectionRoute.includes && redirectionRoute.includes('digit-ui')) {
        window.location.href = redirectionRoute.startsWith('/digit') ? redirectionRoute.split('&')[0] : `/${redirectionRoute.split('&')[0]}`;
        return;
      } else {
      dispatch(setRoute(redirectionRoute));
      }

    }
    if (toast && toast.length) {
      dispatch(toggleSnackbarAndSetText(true, { labelName: toast, labelKey: toast }, "success"));
    }
  } else {
    next(action);
  }
};

export default formSubmit;
