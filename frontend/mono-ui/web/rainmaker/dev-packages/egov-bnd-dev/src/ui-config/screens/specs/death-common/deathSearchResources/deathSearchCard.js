import {
  getBreak, getCommonCaption, getCommonCard,
  getCommonContainer,
  getCommonHeader, getDateField, getDivider, getLabel,
  getPattern, getSelectField, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { loadHospitals } from "./../../utils";
import { disclaimerDialog } from "./disclaimerDialog";
import { searchApiCall } from "./function";
import "./index.css";

// const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
const resetFields = (state, dispatch) => {
  //const tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  //Clear advanced Search
  let componentPath =
    "components.div.children.deathSearchCard.children.cardContent.children.searchContainer2.children.details.children";
  for (var child in get(
    state,
    "screenConfiguration.screenConfig.getCertificate." + componentPath
  )) {
    dispatch(
      handleField(
        "getCertificate",
        componentPath + "." + child,
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        componentPath + "." + child,
        "props.helperText",
        ""
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        componentPath + "." + child,
        "props.error",
        false
      )
    );
  }

  //Clear Mandatory Search Attributes
  componentPath =
    "components.div.children.deathSearchCard.children.cardContent.children.searchContainerCommon.children";
  for (var child in get(
    state,
    "screenConfiguration.screenConfig.getCertificate." + componentPath
  )) {
    dispatch(
      handleField(
        "getCertificate",
        componentPath + "." + child,
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        componentPath + "." + child,
        "props.helperText",
        ""
      )
    );
    dispatch(
      handleField(
        "getCertificate",
        componentPath + "." + child,
        "props.error",
        false
      )
    );
  }
  if (!(process.env.REACT_APP_NAME === "Citizen")) {
    let tenantId = getTenantId();
    dispatch(prepareFinalObject("bnd.death.tenantId", tenantId));
  }
  dispatch(
    prepareFinalObject("bnd.death.deathSearchResponse", [])
  );
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.searchResults",
      "props.data",
      []
    )
  );
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.searchResults",
      "props.tableData",
      []
    )
  );
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.searchResults",
      "props.rows",
      0
    )
  );

  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.searchResults",
      "visible",
      false
    )
  );
};

const cbChanged = (action, state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject.bnd.death,
    "tenantId"
  );

  loadHospitals(action, state, dispatch, "death", tenantId).then((response) => {
    if(response && response.MdmsRes && response.MdmsRes["birth-death-service"] && response.MdmsRes["birth-death-service"].hospitalList)
    {
     const hptList= response.MdmsRes["birth-death-service"].hospitalList;
     const newList=[...hptList.filter(hos=>hos.active), {
      hospitalName : "Others"      }]
      for (let hospital of newList) {
        hospital.code = hospital.hospitalName;
        hospital.name = hospital.hospitalName;
      }
      dispatch(prepareFinalObject("bnd.allHospitals", newList));
    }else{
      dispatch(prepareFinalObject("bnd.allHospitals", [{code:"Others",name:"Others"}]));
    }
  });
};

const setVisibilityOptionsSet1 = (state, dispatch, visible) => {
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.deathSearchCard.children.cardContent.children.searchContainer1",
      "visible",
      visible
    )
  );
};

const setVisibilityOptionsSet2 = (state, dispatch, visible) => {
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.deathSearchCard.children.cardContent.children.searchContainer2",
      "visible",
      visible
    )
  );
};

export const showHideConfirmationPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["getCertificate"],
    "components.div.children.deathSearchCard.children.cardContent.children.disclaimerDialog.props.open",
    false
  );
  dispatch(
    handleField(
      "getCertificate",
      "components.div.children.deathSearchCard.children.cardContent.children.disclaimerDialog",
      "props.open",
      !toggle
    )
  );
};

export const searchSetCommon = getCommonContainer({
  cantonmentSelect: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bnd",
    componentPath: "AutosuggestContainer",
    jsonPath: "bnd.death.tenantId",
    sourceJsonPath: "bnd.allTenants",
    visible: true,
    autoSelect: false,
    props: {
      autoSelect: false,
      isDisabled: false,
      isClearable: true,
      className: "autocomplete-dropdown",
      suggestions: [],
      disabled: false, //getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
      label: {
        labelName: "Select Cantonment",
        labelKey: "BND_APPL_CANT",
      },
      placeholder: {
        labelName: "Select Cantonment",
        labelKey: "BND_APPL_CANT_PLACEHOLDER",
      },
      localePrefix: {
        moduleName: "TENANT",
        masterName: "TENANTS",
      },
      labelsFromLocalisation: true,
      required: true,
      jsonPath: "bnd.death.tenantId",
      sourceJsonPath: "bnd.allTenants",
      inputLabelProps: {
        shrink: true,
      },
      onClickHandler: (action, state, dispatch) => {
      },
    },
    gridDefination: {
      xs: 12,
      sm: 4,
    },
    required: true,
    beforeFieldChange: (action, state, dispatch) => {},
    afterFieldChange: (action, state, dispatch) => {
      cbChanged(action, state, dispatch);
    },
  },
  dob: getDateField({
    label: { labelName: "DOB", labelKey: "BND_DEATH_DOB" },
    placeholder: {
      labelName: "Date of Death",
      labelKey: "BND_DEATH_DOB_PLACEHOLDER",
    },
    jsonPath: "bnd.death.dob",
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
    visible: process.env.REACT_APP_NAME === "Citizen" ? true : false,
  }),
  fromdate: getDateField({
    label: { labelName: "DOD", labelKey: "BND_DEATH_FROM_DATE" },
    placeholder: {
      labelName: "FromDate of Search",
      labelKey: "BND_DEATH_DOB_PLACEHOLDER",
    },
    jsonPath: "bnd.death.fromdate",
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
    visible: process.env.REACT_APP_NAME === "Employee" ? true : false,
  }),
  todate: getDateField({
    label: { labelName: "DOD", labelKey: "BND_DEATH_TO_DATE" },
    placeholder: {
      labelName: "ToDate of Search",
      labelKey: "BND_DEATH_DOB_PLACEHOLDER",
    },
    jsonPath: "bnd.death.todate",
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
    visible: process.env.REACT_APP_NAME === "Employee" ? true : false,
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
      moduleName: "BND",
      masterName: "GENDER",
    },
    data: [
      {
        code: "1",
        label: "MALE",
      },
      {
        code: "2",
        label: "FEMALE",
      },
      {
        code: "3",
        label: "TRANSGENDER",
      },
    ],
    props: {
      disabled: false,
    },
    gridDefination: {
      xs: 12,
      sm: 4,
    },
    jsonPath: "bnd.death.gender",
    autoSelect: true,
    visible: true,
    beforeFieldChange: (action, state, dispatch) => {},
    afterFieldChange: (action, state, dispatch) => {},
  })
});

export const searchSet1 = getCommonContainer({
  // registrationNo: getTextField({
  //   label: {
  //     labelName: "Registration No",
  //     labelKey: "BND_REG_NO_LABEL"
  //   },
  //   placeholder: {
  //     labelName: "Registration No",
  //     labelKey: "BND_REG_NO_LABEL"
  //   },
  //   required:true,
  //   visible: true,
  //   jsonPath: "bnd.death.registrationNo",
  //   gridDefination: {
  //     xs: 12,
  //     sm: 4
  //   }
  // }),
  clickHereLink: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bnd",
    componentPath: "LinkButton",
    props: {
      disableValidation: true,
      url: "teat",
      labelKey: "BND_DONT_KNOW_REGNO_MSG",
      onClickDefination: {
        callBack: (state, dispatch) => {
          setVisibilityOptionsSet1(state, dispatch, false);
          setVisibilityOptionsSet2(state, dispatch, true);
        },
      },
    },
    gridDefination: { xs: 12, sm: 4, md: 4 },
  },
});

export const searchSet2 = getCommonContainer({
  nameOfPerson: getTextField({
    label: {
      labelName: "Name",
      labelKey: "BND_PERSON_NAME_LABEL",
    },
    placeholder: {
      labelName: "Name",
      labelKey: "BND_PERSON_NAME_PLACEHOLDER",
    },
    required: false,
    visible: true,
    jsonPath: "bnd.death.name",
    gridDefination: {
      xs: 12,
      sm: 4,
    },
  }),
  spouseName: getTextField({
    label: {
      labelName: "Spouse Name",
      labelKey: "BND_SPOUSE_NAME_LABEL",
    },
    placeholder: {
      labelName: "Name",
      labelKey: "BND_SPOUSE_NAME_PLACEHOLDER",
    },
    required: false,
    visible: true,
    jsonPath: "bnd.death.spouseName",
    gridDefination: {
      xs: 12,
      sm: 4,
    },
  }),
  hospital: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bnd",
    componentPath: "AutosuggestContainer",
    jsonPath: "bnd.death.hosptialId",
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
        labelKey: "BND_DEATH_APPL_HOSP",
      },
      placeholder: {
        labelName: "Select Hospital",
        labelKey: "BND_DEATH_APPL_HOSP_PLACEHOLDER",
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
      onClickHandler: (action, state, dispatch) => {
      },
    },
    gridDefination: {
      xs: 12,
      sm: 4,
    },
    beforeFieldChange: (action, state, dispatch) => {},
    afterFieldChange: (action, state, dispatch) => {},
  },
  registrationNo: getTextField({
    label: {
      labelName: "Registration No",
      labelKey: "BND_REG_NO_LABEL",
    },
    placeholder: {
      labelName: "Registration No",
      labelKey: "BND_REG_NO_LABEL",
    },
    required: false,
    visible: true,
    jsonPath: "bnd.death.registrationNo",
    gridDefination: {
      xs: 12,
      sm: 4,
    },
  }),
  fathersName: getTextField({
    label: {
      labelName: "Father's Name",
      labelKey: "BND_FATHERS_NAME_LABEL",
    },
    placeholder: {
      labelName: "Father's Name",
      labelKey: "BND_FATHERS_NAME_PLACEHOLDER",
    },
    required: false,
    visible: true,
    jsonPath: "bnd.death.fathersName",
    gridDefination: {
      xs: 12,
      sm: 4,
    },
  }),
  mothersName: getTextField({
    label: {
      labelName: "Mother's Name",
      labelKey: "BND_MOTHERS_NAME_LABEL",
    },
    placeholder: {
      labelName: "Mother's Name",
      labelKey: "BND_MOTHERS_NAME_PLACEHOLDER",
    },
    required: false,
    visible: true,
    jsonPath: "bnd.death.mothersName",
    gridDefination: {
      xs: 12,
      sm: 4,
    },
  }),
  // clickHereLink: {
  //   uiFramework: "custom-atoms-local",
  //   moduleName: "egov-bnd",
  //   componentPath: "LinkButton",
  //   props: {
  //     disableValidation:true,
  //     url: "teat" ,
  //     labelKey:"BND_DONT_KNOW_DETAILS_MSG",
  //     onClickDefination: {
  //       callBack: (state, dispatch) => {
  //         setVisibilityOptionsSet1(state,dispatch,true);
  //         setVisibilityOptionsSet2(state,dispatch,false);
  //       }
  //     },
  //   },
  //   gridDefination: { xs: 12, sm: 4, md: 4 }
  // },
});

export const buttonContainer = getCommonContainer({
  firstCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 3,
    },
  },
  resetButton: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 3,
      // align: "center"
    },
    props: {
      variant: "outlined",
      style: {
        color: "#696969",
        // backgroundColor: "#FE7A51",
        border: "#696969 solid 1px",
        borderRadius: "2px",
        width: window.innerWidth > 480 ? "80%" : "100%",
        height: "48px",
      },
    },
    children: {
      buttonLabel: getLabel({
        labelName: "RESET",
        labelKey: "BND_RESET_BUTTON",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: resetFields,
    },
  },
  searchButton: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 3,
      // align: "center"
    },
    props: {
      variant: "contained",
      style: {
        color: "white",
        backgroundColor: "#696969",
        borderRadius: "2px",
        width: window.innerWidth > 480 ? "80%" : "100%",
        height: "48px",
      },
    },
    children: {
      buttonLabel: getLabel({
        labelName: "SEARCH",
        labelKey: "BND_SEARCH_BUTTON",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        searchApiCall(state, dispatch);
      },
    },
  },
  lastCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 3,
    },
  },
});

export const deathSearchCard = getCommonCard({
  header: getCommonHeader({
    labelName: "Search Bill",
    labelKey: "BND_SEARCH_REGISTRY",
  }),
  // subheader: getCommonSubHeader({
  //   labelName: "Provide at least one parameter to search for an application",
  //   labelKey: "ABG_SEARCH_BILL_COMMON_SUB_HEADER"
  // }),

  break1: getBreak(),
  searchContainerCommon: searchSetCommon,
  //break1: getBreak(),
  divider1: getDivider(),
  searchContainer1: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {},
    children: {
      details: searchSet1,
    },
    visible: false,
  },
  importantNote2: getCommonCaption(
    {
      labelName: "Imp Note",
      labelKey: "BND_SELECTION_NOTE",
    },
    {
      disableValidation: true,
      style: {
        color: "#ff8100",
        fontSize: "16px",
      },
    }
  ),
  break2: getBreak(),
  searchContainer2: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {},
    children: {
      details: searchSet2,
    },
    visible: true,
  },
  buttonContainer: buttonContainer,
  disclaimerDialog: {
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
          popup: disclaimerDialog,
        },
      },
    },
  },
});
