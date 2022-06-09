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

  const placeOfdeath = validateFields(
    "components.div2.children.details.children.cardContent.children.placeInfo.children.cardContent.children.placeOfdeath.children",
    state,
    dispatch,
    "newRegistration"
  );

  const childsInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.deceasedInfo.children.cardContent.children.infoOfDeceased.children",
    state,
    dispatch,
    "newRegistration"
  );

  const spouseInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.spouseInfo.children.cardContent.children.spouseInfo.children",
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
  const placeInfo = validateFields(
    "components.div2.children.details.children.cardContent.children.placeInfo.children.cardContent.children.deathInfo.children",
    state,
    dispatch,
    "newRegistration"
  );
  const addrTimeOfdeath = validateFields(
    "components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.addrTimeOfdeath.children",
    state,
    dispatch,
    "newRegistration"
  );
  const informantsInfo = validateFields(
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
      placeInfo &&
      placeOfdeath &&
      spouseInfo &&
      childsInfo &&
      fathersInfo &&
      mothersInfo &&
      addrTimeOfdeath
    )
  ) {
    isFormValid = false;
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName:
            "Please fill all mandatory fields / Invalid field values !",
          labelKey: "BND_MANDATORY_DETAILS_REQUIRED",
        },
        "info"
      )
    );
    return;
  }
  let dateofreport = get(
    state.screenConfiguration.preparedFinalObject,
    "bnd.death.newRegistration.dateofreportepoch"
  );
  let dateofdeath = get(
    state.screenConfiguration.preparedFinalObject,
    "bnd.death.newRegistration.dateofdeathepoch"
  );
  if (dateofreport < dateofdeath) {
    isFormValid = false;
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Date of Registration should not be before Date of Death",
          labelKey: "BND_ERROR_DOBINVALID",
        },
        "info"
      )
    );
    return;
  }

  if (
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.firstname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.middlename"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.lastname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathFatherInfo.firstname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathFatherInfo.middlename"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathFatherInfo.lastname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathMotherInfo.firstname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathMotherInfo.middlename"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathMotherInfo.lastname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathSpouseInfo.firstname"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathSpouseInfo.middlename"
    ) &&
    !get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathSpouseInfo.lastname"
    )
  ) {
    isFormValid = false;
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName:
            "Please enter deceased's name or father's name or mother's name or spouse's name",
          labelKey: "ERR_FATHER_MOTHER_DECEASED_NAME",
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
        "bnd.death.newRegistration",
        []
      ),
      true
    );
    if (newRegData["checkboxforaddress"]) {
      newRegData["deathPermaddr"] = { ...newRegData["deathPresentaddr"] };
    }
    newRegData["tenantid"] = getTenantId();
    newRegData["excelrowindex"] = -1;
    newRegData["counter"] = newRegData["isLegacyRecord"] ? 1 : 0;

    if (newRegData["dateofreportepoch"] != null)
      newRegData["dateofreportepoch"] =
        convertDateToEpoch(newRegData["dateofreportepoch"]) / 1000;
    if (newRegData["dateofdeathepoch"] != null)
      newRegData["dateofdeathepoch"] =
        convertDateToEpoch(newRegData["dateofdeathepoch"]) / 1000;

    let payload = {
      deathCerts: [newRegData],
    };
    let actionmode =
      getQueryArg(window.location.href, "action") == "EDIT"
        ? "updatedeathimport"
        : "savedeathimport";
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
              (window.location.href = "/employee/death-common/getCertificate"),
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
        backgroundColor: "white",
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
