import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions"; //returns action object
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import {
  convertEpochToDateCustom,
  loadFullCertDetails,
  loadHospitals,
} from "../utils";
import { addHospitalDialog } from "./addHospitalDialog";
import { newRegistrationForm } from "./newRegistrationCard";
import { confirmationDialog } from "./newRegistrationConfirmDialog";
import { footer } from "./newRegistrationFooter";
import "./index.css";
import { set } from "lodash";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "ACTION_TEST_BIRTH_CERTIFICATE",
});

export const showHideConfirmationPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["newRegistration"],
    "components.confirmationDialog.props.open",
    false
  );
  dispatch(
    handleField(
      "newRegistration",
      "components.confirmationDialog",
      "props.open",
      !toggle
    )
  );
};

export const showHideAddHospitalDialog = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["newRegistration"],
    "components.hospitalDialog.props.open",
    false
  );
  dispatch(
    handleField(
      "newRegistration",
      "components.hospitalDialog",
      "props.open",
      !toggle
    )
  );
};

const prepareEditScreenData = (action, state, dispatch, response) => {
  setTimeout(() => {
    if (response.BirthCertificate[0].dateofbirth) {
      dispatch(
        handleField(
          "newRegistration",
          "components.div2.children.details.children.cardContent.children.childInfo.children.cardContent.children.infoOfChild.children.dob",
          "props.value",
          convertEpochToDateCustom(response.BirthCertificate[0].dateofbirth)
        )
      );
    }
    if (response.BirthCertificate[0].dateofreport) {
      dispatch(
        handleField(
          "newRegistration",
          "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children.dateOfReporting",
          "props.value",
          convertEpochToDateCustom(response.BirthCertificate[0].dateofreport)
        )
      );
    }
    if (response.BirthCertificate[0].hospitalname) {
      dispatch(
        handleField(
          "newRegistration",
          "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children.hospitalName",
          "props.value",
          response.BirthCertificate[0].hospitalname
        )
      );
    }
  }, 1);
};

const newRegistration = {
  uiFramework: "material-ui",
  name: "newRegistration",
  beforeInitScreen: (action, state, dispatch) => {
    let userAction = getQueryArg(window.location.href, "action");
    let id = getQueryArg(window.location.href, "certificateId");
    let module = getQueryArg(window.location.href, "module");
    dispatch(
      prepareFinalObject("bnd",{}));
    loadHospitals(action, state, dispatch, "birth", getTenantId()).then(
      (response) => {
        if (
          response &&
          response.MdmsRes &&
          response.MdmsRes["birth-death-service"] &&
          response.MdmsRes["birth-death-service"].hospitalList
        ) {
          const hptList = response.MdmsRes["birth-death-service"].hospitalList;
          const newList = [
            ...hptList.filter((hos) => hos.active),
            {
              hospitalName: "Others",
            },
          ];
          for (let hospital of newList) {
            hospital.code = hospital.hospitalName;
            hospital.name = hospital.hospitalName;
          }
          dispatch(prepareFinalObject("bnd.allHospitals", newList));
        } else {
          dispatch(
            prepareFinalObject("bnd.allHospitals", [
              { code: "Others", name: "Others" },
            ])
          );
        }

        if (userAction == "EDIT" && id && module) {
          set(
            action.screenConfig,
            "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children.hospitalName.props.isDisabled",
            true
          );
          set(
            action.screenConfig,
            "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children.registrationNo.props.disabled",
            true
          );
          loadFullCertDetails(action, state, dispatch, {
            tenantId: getTenantId(),
            id: id,
            module: module,
          }).then((response) => {
            if (
              response &&
              response.BirthCertificate &&
              response.BirthCertificate.length > 0
            ) {
              dispatch(
                prepareFinalObject(
                  "bnd.birth.newRegistration",
                  response.BirthCertificate[0]
                )
              );
              dispatch(
                prepareFinalObject(
                  "bnd.birth.newRegistration.isLegacyRecord",
                  response.BirthCertificate[0].isLegacyRecord
                )
              );
              prepareEditScreenData(action, state, dispatch, response);
            }
          });
        } else {
          dispatch(
            prepareFinalObject("bnd.birth.newRegistration", {
              birthFatherInfo: {},
              birthMotherInfo: {},
              birthPresentaddr: {},
              birthPermaddr: {},
            })
          );
        }
      }
    );

    return action;
  },
  components: {
    div2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
          },
        },
        details: newRegistrationForm,
      },
    },
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css bnd-footer",
      },
      children: {
        details: footer,
      },
    },
    confirmationDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "sm",
        disableValidation: true,
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style",
            },
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: confirmationDialog,
          },
        },
      },
    },
    hospitalDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "sm",
        disableValidation: true,
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style",
            },
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: addHospitalDialog,
          },
        },
      },
    },
  },
};

export default newRegistration;
