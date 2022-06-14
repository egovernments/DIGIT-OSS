import {
  convertDateToEpoch,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  toggleSnackbar,
  toggleSpinner,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import _ from "lodash";
import get from "lodash/get";
import { validateFields, validateTimeZone } from "../utils";
import { showHideConfirmationPopup } from "./newRegistration";

const checkIfFormIsValid = async (state, dispatch) => {
  let isFormValid = true;

  const newRegistration = validateFields(
    "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children",
    state,
    dispatch,
    "newRegistration"
  );

  const placeOfBirth = validateFields(
    "components.div2.children.details.children.cardContent.children.placeInfo.children.cardContent.children.placeOfBirth.children",
    state,
    dispatch,
    "newRegistration"
  );

  const childsInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.childInfo.children.cardContent.children.infoOfChild.children",
    state,
    dispatch,
    "newRegistration"
  );

  const fathersInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.fathersInfo.children.cardContent.children.fathersInfo.children",
    state,
    dispatch,
    "newRegistration"
  );

  const mothersInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.mothersInfo.children.cardContent.children.mothersInfo.children",
    state,
    dispatch,
    "newRegistration"
  );

  const permAddr = validateFields(
    "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children",
    state,
    dispatch,
    "newRegistration"
  );
  const addrField = validateFields(
    "components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.addrTimeOfBirth.children",
    state,
    dispatch,
    "newRegistration"
  );

  const addrTimeOfBirth = validateFields(
    "components.div2.children.details.children.cardContent.children.informantsInfo.children.cardContent.children.informantInfo.children",
    state,
    dispatch,
    "newRegistration"
  );

  if (!validateTimeZone()) {
    return;
  }

  if (
    !(
      newRegistration &&
      permAddr &&
      placeOfBirth &&
      childsInfo &&
      fathersInfo &&
      mothersInfo &&
      addrField &&
      addrTimeOfBirth
    )
  ) {
    isFormValid = false;
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields.",
          labelKey: "BND_FILL_REQUIRED_FIELDS",
        },
        "info"
      )
    );
    return;
  }
  let dateofreport = get(
    state.screenConfiguration.preparedFinalObject,
    "bnd.birth.newRegistration.dateofreportepoch"
  );
  let dateofbirth = get(
    state.screenConfiguration.preparedFinalObject,
    "bnd.birth.newRegistration.dateofbirthepoch"
  );
  if (dateofreport < dateofbirth) {
    isFormValid = false;
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "",
          labelKey: "BND_DOR_SHNT_ABOVE_DEATHDATE",
        },
        "info"
      )
    );
    return;
  }
  if (
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.firstname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.middlename"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.lastname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthFatherInfo.firstname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthFatherInfo.middlename"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthFatherInfo.lastname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthMotherInfo.firstname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthMotherInfo.middlename"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthMotherInfo.lastname"
    )
  ) {
    isFormValid = false;
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName:
            "Please enter child's name or father's name or mother's name",
          labelKey: "BND_ENTER_ANYONE_NAME",
        },
        "info"
      )
    );
    return;
  }

  if (isFormValid) {
    showHideConfirmationPopup(state, dispatch);
  }
};

const callBackSubmit = async (state, dispatch) => {
  checkIfFormIsValid(state, dispatch);
};

export const postData = async (state, dispatch) => {
  try {
    dispatch(toggleSpinner());

    const newRegData = _.clone(
      get(
        state.screenConfiguration.preparedFinalObject,
        "bnd.birth.newRegistration",
        []
      ),
      true
    );
    if (newRegData["checkboxforaddress"]) {
      newRegData["birthPermaddr"] = { ...newRegData["birthPresentaddr"] };
    }
    newRegData["tenantid"] = getTenantId();
    newRegData["excelrowindex"] = -1;
    newRegData["counter"] = newRegData["isLegacyRecord"] ? 1 : 0;

    if (newRegData["dateofreportepoch"] != null)
      newRegData["dateofreportepoch"] =
        convertDateToEpoch(newRegData["dateofreportepoch"]) / 1000;
    if (newRegData["dateofbirthepoch"] != null)
      newRegData["dateofbirthepoch"] =
        convertDateToEpoch(newRegData["dateofbirthepoch"]) / 1000;

    let payload = {
      birthCerts: [newRegData],
    };
    let actionmode =
      getQueryArg(window.location.href, "action") == "EDIT"
        ? "updatebirthimport"
        : "savebirthimport";
    payload = await httpRequest(
      "post",
      `birth-death-services/common/${actionmode}`,
      `${actionmode}`,
      [],
      payload
    );

    if (payload) {
      if (payload.errorRowMap && Object.keys(payload.errorRowMap).length > 0) {
        let errorString = "";
        for (var key in payload.errorRowMap) {
          errorString += key + " ";
        }
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "API Error",
              labelKey: payload.serviceError,
            },
            "info"
          )
        );
      } else {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "",
              labelKey: "BND_SUCCESS",
            },
            "success"
          )
        );
        let userAction = getQueryArg(window.location.href, "action");
        if (userAction == "EDIT") {
          setTimeout(
            () =>
              (window.location.href = "/employee/birth-common/getCertificate"),
            2000
          );
        } else {
          setTimeout(() => location.reload(), 2000);
        }
      }
    } else {
      // dispatch(
      //   setRoute(
      //     `/lams-citizen/acknowledgement?applicationNumber=${applicationNumber}&status=${status}&purpose=${purpose}`
      //   )
      // );
    }
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "API Error",
          labelKey: "BND_SESSION_EXPIRED",
        },
        "info"
      )
    );
  }
  dispatch(toggleSpinner());
};

const getCommonApplyFooter = (children) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
    },
    children,
  };
};

export const footer = getCommonApplyFooter({
  resetButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px",
      },
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "BND_COMMON_NEW",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        location.reload();
      },
    },
    visible: getQueryArg(window.location.href, "action") != "EDIT",
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className: "submit-btn leaseApplicationSubmitButton",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "inherit",
      },
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey:
          getQueryArg(window.location.href, "action") == "EDIT"
            ? "CORE_COMMON_UPDATE"
            : "CORE_COMMON_SUBMIT",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackSubmit,
    },
    //visible: (getQueryArg(window.location.href, "action")!="VIEW"),
  },
});
