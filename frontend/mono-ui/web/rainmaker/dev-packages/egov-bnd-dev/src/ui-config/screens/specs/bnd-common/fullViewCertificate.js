import {
  getCommonCardWithHeader,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions"; //returns action object
import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getDivider,
  getCommonCaption,
  getCommonSubHeader,
  getCommonParagraph,
  getCommonTitle,
  getStepperObject,
  getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists, loadFullCertDetails } from "./../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getFullBirthCertDetailsCard } from "./fullBirthCertDetailsCard";
import { getFullDeathCertDetailsCard } from "./fullDeathCertDetailsCard";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";

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
        labelKey: "CORE_COMMON_EDIT",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        let module = getQueryArg(window.location.href, "module");
        const newRegData = _.clone(
          get(
            state.screenConfiguration.preparedFinalObject,
            "bnd.viewFullCertDetails",
            []
          ),
          true
        );
        let id = newRegData["id"];
        let applyUrl = `/${module}-employee/newRegistration?action=EDIT&certificateId=${id}&module=${module}`;
        dispatch(setRoute(applyUrl));
      },
    },
    visible:
      ifUserRoleExists("BIRTH_APPLICATION_EDITOR") ||
      ifUserRoleExists("DEATH_APPLICATION_EDITOR"),
  },
});

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD",
});

const fullViewCertificate = {
  uiFramework: "material-ui",
  name: "fullViewCertificate",
  beforeInitScreen: (action, state, dispatch) => {
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let id = getQueryArg(window.location.href, "certificateId");
    let module = getQueryArg(window.location.href, "module");

    let data = { tenantId: tenantId, id: id, module: module };

    loadFullCertDetails(action, state, dispatch, data).then((response) => {
      //response = {BirthCertificate:[{"birthFatherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"birthMotherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"birthPresentaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"birthPermaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"registrationno":"test","hospitalname":"VAIJAYANTI HOSPITAL","dateofreportepoch":"2021-03-16","dateofbirthepoch":"2021-03-11","genderStr":"Male","firstname":"TEst","middlename":"TEst","lastname":"TEst","placeofbirth":"TEst","informantsname":"TEst","informantsaddress":"TEst","remarks":"asdf"}]};
      //response = {DeathCertificate:[{"deathFatherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"deathMotherInfo":{"firstname":"TEst","middlename":"TEst","lastname":"TEst","aadharno":"111111111111","emailid":"test@test.com","mobileno":"9444444444","education":"TEst","profession":"TEst","nationality":"TEst","religion":"TEst"},"deathPresentaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"deathPermaddr":{"buildingno":"TEst","houseno":"TEst","streetname":"TEst","locality":"TEst","tehsil":"TEst","district":"TEst","city":"TEst","state":"TEst","pinno":"512465","country":"TEst"},"registrationno":"test","hospitalname":"VAIJAYANTI HOSPITAL","dateofreportepoch":"2021-03-16","dateofdeathepoch":"2021-03-11","genderStr":"Male","firstname":"TEst","middlename":"TEst","lastname":"TEst","placeofdeath":"TEst","informantsname":"TEst","informantsaddress":"TEst","remarks":"asdf"}]};
      if (
        module == "birth" &&
        response &&
        response.BirthCertificate &&
        response.BirthCertificate.length > 0
      ) {
        dispatch(
          prepareFinalObject(
            "bnd.viewFullCertDetails",
            response.BirthCertificate[0]
          )
        );
      } else if (
        module == "death" &&
        response &&
        response.DeathCertificate &&
        response.DeathCertificate.length > 0
      ) {
        dispatch(
          prepareFinalObject(
            "bnd.viewFullCertDetails",
            response.DeathCertificate[0]
          )
        );
      }
    });

    return action;
  },

  components: {
    div1: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      visible: getQueryArg(window.location.href, "module") == "birth",
      props: {
        disableValidation: true,
      },
      children: {
        details: getFullBirthCertDetailsCard("bnd.viewFullCertDetails"),
      },
    },
    div2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      visible: getQueryArg(window.location.href, "module") == "death",
      props: {
        disableValidation: true,
      },
      children: {
        details: getFullDeathCertDetailsCard("bnd.viewFullCertDetails"),
      },
    },
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
      },
      children: {
        details: footer,
      },
    },
  },
};

export default fullViewCertificate;
