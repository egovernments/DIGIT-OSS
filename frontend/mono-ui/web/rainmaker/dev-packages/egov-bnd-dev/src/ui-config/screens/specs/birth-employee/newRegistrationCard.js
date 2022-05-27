import {
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonParagraph,
  getCommonSubHeader,
  getCommonTitle,
  getDateField,
  getPattern,
  getSelectField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { patterns } from "../utils/constants";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const getPersonDetailsForm = (type) => {
  return getCommonContainer({
    firstName: getTextField({
      label: {
        labelName: "First Name",
        labelKey: "BND_FIRSTNAME_LABEL",
      },
      placeholder: {
        labelName: "First Name",
        labelKey: "BND_FIRSTNAME_LABEL",
      },
      required: true,
      visible: true,
      pattern: patterns["name"],
      jsonPath: `bnd.birth.newRegistration.${type}.firstname`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    middlename: getTextField({
      label: {
        labelName: "Middle Name",
        labelKey: "BND_MIDDLENAME_LABEL",
      },
      placeholder: {
        labelName: "Middle Name",
        labelKey: "BND_MIDDLENAME_LABEL",
      },
      required: false,
      visible: true,
      pattern: patterns["name"],
      jsonPath: `bnd.birth.newRegistration.${type}.middlename`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    lastname: getTextField({
      label: {
        labelName: "Last Name",
        labelKey: "BND_LASTNAME_LABEL",
      },
      placeholder: {
        labelName: "Last Name",
        labelKey: "BND_LASTNAME_LABEL",
      },
      required: true,
      visible: true,
      pattern: patterns["name"],
      jsonPath: `bnd.birth.newRegistration.${type}.lastname`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    aadharNo: getTextField({
      label: {
        labelName: "Aadhar No",
        labelKey: "BND_AADHAR_NO",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "Aadhar No",
        labelKey: "BND_AADHAR_NO",
      },
      required: false,
      pattern: getPattern("AadharNo"),
      jsonPath: `bnd.birth.newRegistration.${type}.aadharno`,
      // iconObj: {
      //   iconName: "search",
      //   position: "end",
      //   color: "#FE7A51",
      //   onClickDefination: {
      //     action: "condition",
      //     callBack: (state, dispatch, fieldInfo) => {
      //       alert("hey")
      //       //getDetailsForOwner(state, dispatch, fieldInfo); //useme
      //     }
      //   }
      // },
      title: {
        value: "Please search owner profile linked to the mobile no.",
        key: "BND_AADHAR_NO",
      },
      //infoIcon: "info_circle",
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    emailId: getTextField({
      label: {
        labelName: "emailId",
        labelKey: "BND_EMAIL_ID",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "emailId",
        labelKey: "BND_EMAIL_ID",
      },
      required: false,
      pattern: getPattern("Email"),
      jsonPath: `bnd.birth.newRegistration.${type}.emailid`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    mobNo: getTextField({
      label: {
        labelName: "Mobile No.",
        labelKey: "CORE_COMMON_MOBILE_NUMBER",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "Enter Mobile No.",
        labelKey: "CORE_COMMON_MOBILE_NUMBER",
      },
      required: false,
      pattern: getPattern("MobileNo"),
      jsonPath: `bnd.birth.newRegistration.${type}.mobileno`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    education: getTextField({
      label: {
        labelName: "Education",
        labelKey: "BND_EDUCATION",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "Education",
        labelKey: "BND_EDUCATION",
      },
      required: false,
      pattern: patterns["commonPattern"],
      jsonPath: `bnd.birth.newRegistration.${type}.education`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    profession: getTextField({
      label: {
        labelName: "Profession",
        labelKey: "BND_PROFESSION",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "Profession",
        labelKey: "BND_PROFESSION",
      },
      required: false,
      pattern: patterns["commonPattern"],
      jsonPath: `bnd.birth.newRegistration.${type}.proffession`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    nationality: getTextField({
      label: {
        labelName: "nationality",
        labelKey: "BND_NATIONALITY",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "nationality",
        labelKey: "BND_NATIONALITY",
      },
      required: true,
      pattern: patterns["commonPattern"],
      jsonPath: `bnd.birth.newRegistration.${type}.nationality`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    religion: getTextField({
      label: {
        labelName: "religion",
        labelKey: "BND_RELIGION",
      },
      props: {
        className: "applicant-details-error",
      },
      placeholder: {
        labelName: "religion",
        labelKey: "BND_RELIGION",
      },
      required: false,
      pattern: patterns["commonPattern"],
      jsonPath: `bnd.birth.newRegistration.${type}.religion`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
  });
};

export const getAddressForm = (type, mandatory = false) => {
  return getCommonContainer({
    buildingNo: getTextField({
      label: {
        labelName: "buildingno",
        labelKey: "BND_BUILDINGNO_LABEL",
      },
      placeholder: {
        labelName: "buildingno",
        labelKey: "BND_BUILDINGNO_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressBig"],
      jsonPath: `bnd.birth.newRegistration.${type}.buildingno`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    houseNo: getTextField({
      label: {
        labelName: "houseno",
        labelKey: "BND_HOUSENO_LABEL",
      },
      placeholder: {
        labelName: "houseno",
        labelKey: "BND_HOUSENO_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressBig"],
      jsonPath: `bnd.birth.newRegistration.${type}.houseno`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    streetname: getTextField({
      label: {
        labelName: "streetname",
        labelKey: "BND_STREETNAME_LABEL",
      },
      placeholder: {
        labelName: "streetname",
        labelKey: "BND_STREETNAME_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressBig"],
      jsonPath: `bnd.birth.newRegistration.${type}.streetname`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    locality: getTextField({
      label: {
        labelName: "locality",
        labelKey: "BND_LOCALITY_LABEL",
      },
      placeholder: {
        labelName: "locality",
        labelKey: "BND_LOCALITY_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressBig"],
      jsonPath: `bnd.birth.newRegistration.${type}.locality`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    tehsil: getTextField({
      label: {
        labelName: "tehsil",
        labelKey: "BND_TEHSIL_LABEL",
      },
      placeholder: {
        labelName: "tehsil",
        labelKey: "BND_TEHSIL_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressTehsil"],
      jsonPath: `bnd.birth.newRegistration.${type}.tehsil`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    district: getTextField({
      label: {
        labelName: "district",
        labelKey: "BND_DISTRICT_LABEL",
      },
      placeholder: {
        labelName: "district",
        labelKey: "BND_DISTRICT_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressSmall"],
      jsonPath: `bnd.birth.newRegistration.${type}.district`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    city: getTextField({
      label: {
        labelName: "city",
        labelKey: "BND_CITY_LABEL",
      },
      placeholder: {
        labelName: "city",
        labelKey: "BND_CITY_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressSmall"],
      jsonPath: `bnd.birth.newRegistration.${type}.city`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    state: getTextField({
      label: {
        labelName: "state",
        labelKey: "BND_STATE_LABEL",
      },
      placeholder: {
        labelName: "city",
        labelKey: "BND_STATE_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressSmall"],
      jsonPath: `bnd.birth.newRegistration.${type}.state`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    pinno: getTextField({
      label: {
        labelName: "pinno",
        labelKey: "BND_PINNO_LABEL",
      },
      placeholder: {
        labelName: "pinno",
        labelKey: "BND_PINNO_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: getPattern("Pincode"),
      jsonPath: `bnd.birth.newRegistration.${type}.pinno`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
    country: getTextField({
      label: {
        labelName: "country",
        labelKey: "BND_COUNTRY_LABEL",
      },
      placeholder: {
        labelName: "country",
        labelKey: "BND_COUNTRY_LABEL",
      },
      required: mandatory,
      visible: true,
      pattern: patterns["addressSmall"],
      jsonPath: `bnd.birth.newRegistration.${type}.country`,
      gridDefination: {
        xs: 12,
        sm: 4,
      },
    }),
  });
};
export const getcheckboxvalue = (state, dispatch) => {
  let checkBoxState = get(
    state.screenConfiguration.preparedFinalObject,
    "bnd.birth.newRegistration.checkboxforaddress"
  );
  if (checkBoxState) {
    let birthpresentmaddr = get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthPresentaddr"
    );
    for (var key in birthpresentmaddr)
      dispatch(
        prepareFinalObject(
          `bnd.birth.newRegistration.birthPermaddr.${key}`,
          get(
            state.screenConfiguration.preparedFinalObject,
            `bnd.birth.newRegistration.birthPresentaddr.${key}`
          )
        )
      );
    dispatch(
      handleField(
        "newRegistration",
        "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "newRegistration",
        "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.header",
        "visible",
        false
      )
    );
    const presentAddrConfig = get(
      state.screenConfiguration.screenConfig.newRegistration,
      "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children"
    );
    for (var key in presentAddrConfig) {
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children.${key}`,
          "required",
          false
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children.${key}`,
          "props.required",
          false
        )
      );
    }
    const addrConfig = get(
      state.screenConfiguration.screenConfig.newRegistration,
      "components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.addrTimeOfBirth.children"
    );
    for (var key in addrConfig) {
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.addrTimeOfBirth.children.${key}`,
          "required",
          true
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.addrTimeOfBirth.children.${key}`,
          "props.required",
          true
        )
      );
    }
    dispatch(
      handleField(
        "newRegistration",
        "components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.header.children.key",
        "props.labelKey",
        "BND_BIRTH_ADDR_PERM"
      )
    );
  } else {
    let birthpermaddr = get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.birth.newRegistration.birthPermaddr"
    );
    for (var key in birthpermaddr)
      dispatch(
        prepareFinalObject(`bnd.birth.newRegistration.birthPermaddr.${key}`, "")
      );
    const presentAddrConfig = get(
      state.screenConfiguration.screenConfig.newRegistration,
      "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children"
    );
    for (var key in presentAddrConfig) {
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children.${key}`,
          "required",
          true
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children.${key}`,
          "props.required",
          true
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children.${key}`,
          "props.value",
          ""
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents.children.${key}`,
          "props.error",
          false
        )
      );
    }
    const addrConfig = get(
      state.screenConfiguration.screenConfig.newRegistration,
      "components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.addrTimeOfBirth.children"
    );
    for (var key in addrConfig) {
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.addrTimeOfBirth.children.${key}`,
          "required",
          false
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.addrTimeOfBirth.children.${key}`,
          "props.required",
          false
        )
      );
    }
    dispatch(
      handleField(
        "newRegistration",
        "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.permAddressofParents",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "newRegistration",
        "components.div2.children.details.children.cardContent.children.permAddressofParents.children.cardContent.children.header",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "newRegistration",
        "components.div2.children.details.children.cardContent.children.addrTimeOfBirth.children.cardContent.children.header.children.key",
        "props.labelKey",
        "BND_PRESENT_ADDR_DURING_BIRTH"
      )
    );
  }
};

export const newRegistrationForm = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "New Registration",
      labelKey:
        getQueryArg(window.location.href, "action") === "EDIT"
          ? "BND_EDIT_REGISTRATION"
          : "BND_NEW_REGISTRATION",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
  subText: getCommonParagraph({
    labelName: "(*) marked items are mandatory",
    labelKey: "BND_NEW_REGISTRATION_SUBTEXT",
  }),
  checkBox: {
    required: true,
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bnd",
    componentPath: "Checkbox",
    props: {
      label: {
        labelKey: "BND_IS_LEGACY_RECORD",
        labelName: "BND_IS_LEGACY_RECORD",
      },
      jsonPath: "bnd.birth.newRegistration.isLegacyRecord",
    },
  },
  registrationInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_REGISTRATION",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    registrationInfoCont: getCommonContainer({
      registrationNo: getTextField({
        label: {
          labelName: "RegistrationNo",
          labelKey: "BND_REG_NO_LABEL",
        },
        placeholder: {
          labelName: "Registration No",
          labelKey: "BND_REG_NO_LABEL",
        },
        required: true,
        visible: true,
        pattern: patterns["registrationNo"],
        jsonPath: "bnd.birth.newRegistration.registrationno",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
      hospitalName: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bnd",
        componentPath: "AutosuggestContainer",
        jsonPath: "bnd.birth.newRegistration.hospitalname",
        sourceJsonPath: "bnd.allHospitals",
        visible: true,
        autoSelect: true,
        props: {
          autoSelect: true,
          //isClearable:true,
          className: "autocomplete-dropdown",
          suggestions: [],
          disabled: false, //getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
          label: {
            labelName: "Select Hospital",
            labelKey: "BND_HOSPITALNAME_LABEL",
          },
          placeholder: {
            labelName: "Select Hospital",
            labelKey: "BND_HOSPITALNAME_LABEL_PLACEHOLDER",
          },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS",
          },
          labelsFromLocalisation: false,
          required: false,
          jsonPath: "bnd.birth.hosptialId",
          sourceJsonPath: "bnd.allHospitals",
          inputLabelProps: {
            shrink: true,
          },
          onClickHandler: (action, state, dispatch) => {},
        },
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        beforeFieldChange: (action, state, dispatch) => {},
        afterFieldChange: (action, state, dispatch) => {},
      },

      dateOfReporting: getDateField({
        label: { labelName: "DOB", labelKey: "BND_DOR" },
        placeholder: {
          labelName: "Date of Reporting",
          labelKey: "BND_DOR_PLACEHOLDER",
        },
        jsonPath: "bnd.birth.newRegistration.dateofreportepoch",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        required: true,
        props: {
          inputProps: {
            max: getTodaysDateInYMD(),
          },
        },
      }),
    }),
  }),
  childInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_INFO_OF_CHILD",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    infoOfChild: getCommonContainer({
      dob: getDateField({
        label: { labelName: "DOB", labelKey: "BND_BIRTH_DOB" },
        placeholder: {
          labelName: "Date of Birth",
          labelKey: "BND_BIRTH_DOB",
        },
        jsonPath: "bnd.birth.newRegistration.dateofbirthepoch",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        required: true,
        props: {
          inputProps: {
            max: getTodaysDateInYMD(),
          },
        },
      }),
      gender: getSelectField({
        label: {
          labelName: "Select Gender",
          labelKey: "BND_GENDER",
        },
        placeholder: {
          labelName: "Select Gender",
          labelKey: "BND_GENDER_PLACEHOLDER",
        },
        required: true,
        localePrefix: {
          moduleName: "BIRTH",
          masterName: "GENDER",
        },
        data: [
          {
            code: "Male",
            label: "Male",
          },
          {
            code: "Female",
            label: "Female",
          },
          {
            code: "Others",
            label: "Others",
          },
        ],
        props: {
          disabled: false,
        },
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "bnd.birth.newRegistration.genderStr",
        autoSelect: true,
        visible: true,
        beforeFieldChange: (action, state, dispatch) => {},
        afterFieldChange: (action, state, dispatch) => {},
      }),
      firstName: getTextField({
        label: {
          labelName: "First Name",
          labelKey: "BND_FIRSTNAME_LABEL",
        },
        placeholder: {
          labelName: "First Name",
          labelKey: "BND_FIRSTNAME_LABEL",
        },
        required: false,
        visible: true,
        pattern: patterns["name"],
        jsonPath: "bnd.birth.newRegistration.firstname",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
      middlename: getTextField({
        label: {
          labelName: "Middle Name",
          labelKey: "BND_MIDDLENAME_LABEL",
        },
        placeholder: {
          labelName: "Middle Name",
          labelKey: "BND_MIDDLENAME_LABEL",
        },
        required: false,
        visible: true,
        pattern: patterns["name"],
        jsonPath: "bnd.birth.newRegistration.middlename",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
      lastname: getTextField({
        label: {
          labelName: "Last Name",
          labelKey: "BND_LASTNAME_LABEL",
        },
        placeholder: {
          labelName: "Last Name",
          labelKey: "BND_LASTNAME_LABEL",
        },
        required: false,
        visible: true,
        pattern: patterns["name"],
        jsonPath: "bnd.birth.newRegistration.lastname",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
    }),
  }),
  placeInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_BIRTH_PLACE",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    placeOfBirth: getCommonContainer({
      firstName: getTextField({
        label: {
          labelName: "Place of Birth",
          labelKey: "BND_BIRTH_PLACE",
        },
        placeholder: {
          labelName: "Place of Birth",
          labelKey: "BND_BIRTH_PLACE",
        },
        required: true,
        visible: true,
        pattern: patterns["addressBig"],
        jsonPath: "bnd.birth.newRegistration.placeofbirth",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
    }),
  }),
  fathersInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_FATHERS_INFO",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    fathersInfo: getPersonDetailsForm("birthFatherInfo"),
  }),
  mothersInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_MOTHERS_INFO",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    mothersInfo: getPersonDetailsForm("birthMotherInfo"),
  }),
  addrTimeOfBirth: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_PRESENT_ADDR_DURING_BIRTH",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    addrTimeOfBirth: getAddressForm("birthPresentaddr"),
  }),

  permAddressofParents: getCommonGrayCard({
    checkBoxforaddress: {
      required: true,
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bnd",
      componentPath: "Checkbox",
      props: {
        label: {
          labelKey: "PRESENT_TO_PERM_ADDR_SWITCH_BIRTH",
          labelName: "PRESENT_TO_PERM_ADDR_SWITCH_BIRTH",
        },
        jsonPath: "bnd.birth.newRegistration.checkboxforaddress",
        callBack: (state, dispatch) => {
          getcheckboxvalue(state, dispatch);
        },
      },
    },
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_BIRTH_ADDR_PERM",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    permAddressofParents: getAddressForm("birthPermaddr", true),
  }),
  informantsInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_INFORMANTS_INFO",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    informantInfo: getCommonContainer({
      informantName: getTextField({
        label: {
          labelName: "informants name",
          labelKey: "CORE_COMMON_NAME",
        },
        placeholder: {
          labelName: "informants name",
          labelKey: "CORE_COMMON_NAME",
        },
        required: false,
        visible: true,
        pattern: patterns["name"],
        jsonPath: "bnd.birth.newRegistration.informantsname",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
      informantsAddress: getTextField({
        label: {
          labelName: "informants address",
          labelKey: "BND_ADDRESS",
        },
        placeholder: {
          labelName: "informants address",
          labelKey: "BND_ADDRESS",
        },
        required: false,
        visible: true,
        pattern: patterns["addressBig"],
        jsonPath: "bnd.birth.newRegistration.informantsaddress",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
    }),
  }),
  remarks: getTextField({
    label: {
      labelName: "remarks",
      labelKey: "BND_REMARKS_LABEL",
    },
    placeholder: {
      labelName: "remarks",
      labelKey: "BND_REMARKS_LABEL",
    },
    required: false,
    visible: true,
    pattern: patterns["remarks"],
    jsonPath: "bnd.birth.newRegistration.remarks",
    gridDefination: {
      xs: 12,
      sm: 4,
    },
  }),
});
