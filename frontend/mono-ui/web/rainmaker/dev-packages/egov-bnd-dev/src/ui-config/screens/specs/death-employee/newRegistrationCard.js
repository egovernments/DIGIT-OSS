import {
  getCommonCard,
  getCommonTitle,
  getSelectField,
  getCommonParagraph,
  getPattern,
  getTextField,
  getDateField,
  getCommonCaption,
  getCommonSubHeader,
  getCommonGrayCard,
  getCommonContainer,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { patterns } from "../utils/constants";
import { showHideAddHospitalDialog } from "./newRegistration";
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
      jsonPath: `bnd.death.newRegistration.${type}.firstname`,
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
      jsonPath: `bnd.death.newRegistration.${type}.middlename`,
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
      jsonPath: `bnd.death.newRegistration.${type}.lastname`,
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
      jsonPath: `bnd.death.newRegistration.${type}.aadharno`,
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
      jsonPath: `bnd.death.newRegistration.${type}.emailid`,
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
      jsonPath: `bnd.death.newRegistration.${type}.mobileno`,
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
      jsonPath: `bnd.death.newRegistration.${type}.buildingno`,
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
      jsonPath: `bnd.death.newRegistration.${type}.houseno`,
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
      jsonPath: `bnd.death.newRegistration.${type}.streetname`,
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
      jsonPath: `bnd.death.newRegistration.${type}.locality`,
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
      jsonPath: `bnd.death.newRegistration.${type}.tehsil`,
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
      jsonPath: `bnd.death.newRegistration.${type}.district`,
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
      jsonPath: `bnd.death.newRegistration.${type}.city`,
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
      jsonPath: `bnd.death.newRegistration.${type}.state`,
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
      jsonPath: `bnd.death.newRegistration.${type}.pinno`,
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
      jsonPath: `bnd.death.newRegistration.${type}.country`,
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
    "bnd.death.newRegistration.checkboxforaddress"
  );
  if (checkBoxState) {
    let deathpresentmaddr = get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathPresentaddr"
    );
    for (var key in deathpresentmaddr)
      dispatch(
        prepareFinalObject(
          `bnd.death.newRegistration.deathPermaddr.${key}`,
          get(
            state.screenConfiguration.preparedFinalObject,
            `bnd.death.newRegistration.deathPresentaddr.${key}`
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
      "components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.addrTimeOfdeath.children"
    );
    for (var key in addrConfig) {
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.addrTimeOfdeath.children.${key}`,
          "required",
          true
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.addrTimeOfdeath.children.${key}`,
          "props.required",
          true
        )
      );
    }
    dispatch(
      handleField(
        "newRegistration",
        "components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.header.children.key",
        "props.labelKey",
        "BND_DEATH_ADDR_PERM"
      )
    );
  } else {
    let deathpermaddr = get(
      state.screenConfiguration.preparedFinalObject,
      "bnd.death.newRegistration.deathPermaddr"
    );
    for (var key in deathpermaddr)
      dispatch(
        prepareFinalObject(`bnd.death.newRegistration.deathPermaddr.${key}`, "")
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
      "components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.addrTimeOfdeath.children"
    );
    for (var key in addrConfig) {
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.addrTimeOfdeath.children.${key}`,
          "required",
          false
        )
      );
      dispatch(
        handleField(
          "newRegistration",
          `components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.addrTimeOfdeath.children.${key}`,
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
        "components.div2.children.details.children.cardContent.children.addrTimeOfdeath.children.cardContent.children.header.children.key",
        "props.labelKey",
        "BND_PRESENT_ADDR_DURING_DEATH"
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
      jsonPath: "bnd.death.newRegistration.isLegacyRecord",
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
        jsonPath: "bnd.death.newRegistration.registrationno",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
      hospitalName: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bnd",
        componentPath: "AutosuggestContainer",
        jsonPath: "bnd.death.newRegistration.hospitalname",
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
          jsonPath: "bnd.death.hosptialId",
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
        label: { labelName: "DOB", labelKey: "BND_DEATH_DOR" },
        placeholder: {
          labelName: "Date of Reporting",
          labelKey: "BND_DEATH_DOR_PLACEHOLDER",
        },
        jsonPath: "bnd.death.newRegistration.dateofreportepoch",
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
  deceasedInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_INFO_OF_DECEASED",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    infoOfDeceased: getCommonContainer({
      dob: getDateField({
        label: { labelName: "DOB", labelKey: "BND_DEATH_DOB" },
        placeholder: {
          labelName: "Date of Death",
          labelKey: "BND_DEATH_DOB",
        },
        jsonPath: "bnd.death.newRegistration.dateofdeathepoch",
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
          moduleName: "COMMON",
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
            code: "Transgender",
            label: "Transgender",
          },
        ],
        props: {
          disabled: false,
        },
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "bnd.death.newRegistration.genderStr",
        autoSelect: true,
        visible: true,
        beforeFieldChange: (action, state, dispatch) => {},
        afterFieldChange: (action, state, dispatch) => {},
      }),
      age: getTextField({
        label: {
          labelName: "Age",
          labelKey: "BND_AGE",
        },
        placeholder: {
          labelName: "Age",
          labelKey: "BND_AGE_PLACEHOLDER",
        },
        required: true,
        visible: true,
        pattern: patterns["age"],
        jsonPath: "bnd.death.newRegistration.age",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
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
        required: true,
        visible: true,
        pattern: patterns["name"],
        jsonPath: "bnd.death.newRegistration.firstname",
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
        jsonPath: "bnd.death.newRegistration.middlename",
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
        jsonPath: "bnd.death.newRegistration.lastname",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
      eidNo: getTextField({
        label: {
          labelName: "Eid No",
          labelKey: "BND_EIDNO",
        },
        props: {
          className: "applicant-details-error",
        },
        placeholder: {
          labelName: "Eid No",
          labelKey: "BND_EIDNO",
        },
        required: false,
        pattern: patterns["eidno"],
        jsonPath: `bnd.death.newRegistration.eidno`,
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
        jsonPath: `bnd.death.newRegistration.aadharno`,
        title: {
          value: "Please search owner profile linked to the mobile no.",
          key: "BND_AADHAR_NO",
        },
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
        jsonPath: `bnd.death.newRegistration.nationality`,
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
        jsonPath: `bnd.death.newRegistration.religion`,
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
        labelKey: "BND_DEATH_INFO",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    deathInfo: getCommonContainer({
      placeOfdeath: getTextField({
        label: {
          labelName: "Place of Death",
          labelKey: "BND_DEATH_PLACE",
        },
        placeholder: {
          labelName: "Place of Death",
          labelKey: "BND_DEATH_PLACE",
        },
        required: true,
        visible: true,
        pattern: patterns["addressBig"],
        jsonPath: "bnd.death.newRegistration.placeofdeath",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
      icdCode: getTextField({
        label: {
          labelName: "",
          labelKey: "BND_ICDCODE",
        },
        placeholder: {
          labelName: "",
          labelKey: "BND_ICDCODE",
        },
        required: false,
        visible: true,
        pattern: patterns["icdcode"],
        jsonPath: "bnd.death.newRegistration.icdcode",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      }),
    }),
  }),
  spouseInfo: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_SPOUSES_INFO",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    spouseInfo: getPersonDetailsForm("deathSpouseInfo"),
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
    fathersInfo: getPersonDetailsForm("deathFatherInfo"),
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
    mothersInfo: getPersonDetailsForm("deathMotherInfo"),
  }),
  addrTimeOfdeath: getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_PRESENT_ADDR_DURING_DEATH",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    addrTimeOfdeath: getAddressForm("deathPresentaddr"),
  }),
  permAddressofParents: getCommonGrayCard({
    checkBoxforaddress: {
      required: true,
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bnd",
      componentPath: "Checkbox",
      props: {
        label: {
          labelKey: "PRESENT_TO_PERM_ADDR_SWITCH_DEATH",
          labelName: "PRESENT_TO_PERM_ADDR_SWITCH_DEATH",
        },
        jsonPath: "bnd.death.newRegistration.checkboxforaddress",
        callBack: (state, dispatch) => {
          getcheckboxvalue(state, dispatch);
        },
      },
    },
    header: getCommonSubHeader(
      {
        labelName: "",
        labelKey: "BND_DEATH_ADDR_PERM",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    permAddressofParents: getAddressForm("deathPermaddr", true),
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
        jsonPath: "bnd.death.newRegistration.informantsname",
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
        jsonPath: "bnd.death.newRegistration.informantsaddress",
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
    jsonPath: "bnd.death.newRegistration.remarks",
    gridDefination: {
      xs: 12,
      sm: 4,
    },
  }),
});
