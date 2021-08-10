import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getTextField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { addComponentJsonpath } from "egov-ui-framework/ui-utils/commons";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import "./index.css";

const showComponent = (
  dispatch,
  componentJsonPath,
  display,
  oldStyle = {}
) => {
  let displayProps = display ?
    {
      ...oldStyle,
      display: 'block'
    } :
    {
      ...oldStyle,
      display: "none"
    };
  dispatch(
    handleField(
      "register-property",
      componentJsonPath,
      "props.style",
      displayProps
    )
  );
};
const institutionTypeInformation = () => {
  return getCommonGrayCard(
    {
      institutionTypeDetailsContainer: getCommonContainer({

        privateInstitutionNameDetails: getTextField({
          label: {
            labelName: "Institution Name",
            labelKey: "PT_COMMON_INSTITUTION_NAME"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Institution Name",
            labelKey: "PT_COMMON_INSTITUTION_NAME_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Name"),
          jsonPath: "Property.institution.name"
        }),
        privateInstitutionTypeDetails: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-pt",
          componentPath: "AutosuggestContainer",
          jsonPath: "Property.institution.type",//db sake
          required: true,
          props: {
            style: {
              width: "100%",
              cursor: "pointer"
            },
            label: {
              labelName: "Institution Type",
              labelKey: "PT_COMMON_INSTITUTION_TYPE"
            },
            placeholder: {
              labelName: "Enter Institution Type",
              labelKey: "PT_COMMON_INSTITUTION_TYPE_PLACEHOLDER"
            },
            jsonPath: "Property.institution.type",
            localePrefix: {
              moduleName: "common-masters",
              masterName: "OwnerShipCategory"
            },
            required: true,
            sourceJsonPath: "applyScreenMdmsData.common-masters.Institutions",
            labelsFromLocalisation: true,
            suggestions: [],
            fullwidth: true,
            isClearable: true,
            inputLabelProps: {
              shrink: true
            },
    
          },
          gridDefination: {
            xs: 12,
            sm: 6,
          },
        },
      }),
    })
};
const institutionInformation = () => {
  return getCommonGrayCard(
    {
      header: getCommonTitle(
        {
          labelName: "Details of Authorised Person",
          labelKey: "PT_COMMON_AUTHORISED_PERSON_DETAILS"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),

      institutionDetailsContainer: getCommonContainer({
        authorisedPersonName: getTextField({
          label: {
            labelName: "Name",
            labelKey: "PT_COMMON_AUTHORISED_PERSON_NAME"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Name",
            labelKey: "PT_COMMON_AUTHORISED_PERSON_NAME_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Name"),
          jsonPath: "Property.owners[0].name"
        }),

        authorisedDesignationValue: getTextField({
          label: {
            labelName: "Designation",
            labelKey: "PT_COMMON_AUTHORISED_PERSON_DESIGNATION"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Designation",
            labelKey: "PT_COMMON_AUTHORISED_PERSON_DESIGNATION_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Name"),
          jsonPath: "Property.institution.designation"
        }),
        authorisedMobile: getTextField({
          label: {
            labelName: "Mobile",
            labelKey: "PT_COMMON_AUTHORISED_MOBILE"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Mobile",
            labelKey: "PT_COMMON_AUTHORISED_MOBILE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("MobileNo"),
          jsonPath: "Property.owners[0].mobileNumber"
        }),
        authorisedLandline: getTextField({
          label: {
            labelName: "Landline",
            labelKey: "PT_COMMON_AUTHORISED_LANDLINE"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Landline",
            labelKey: "PT_COMMON_AUTHORISED_LANDLINE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Landline"),
          jsonPath: "Property.institution.landlineNumber"
        }),
        authorisedAddress: getTextField({
          label: {
            labelName: "Correspondence Address",
            labelKey: "PT_COMMON_AUTHORISED_CORRESPONDENCE_ADDRESS"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Correspondence Address",
            labelKey: "PT_COMMON_AUTHORISED_ADDRESS_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Address"),
          jsonPath: "Property.owners[0].correspondenceAddress"
        }),
        sameAsPropertyAddress: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-pt",
          componentPath: "CheckboxContainerPTCommon",
          gridDefination: { xs: 12, sm: 12, md: 12 },
          props: {
            labelKey: "PT_COMMON_SAME_AS_PROPERTY_ADDRESS",
            jsonPath: "Property.owners[0].sameAsPropertyAddress",
            required: false,
            destinationJsonPath: "correspondenceAddress"
          },
          required:false,
          type: "array",
          jsonPath: "Property.owners[0].sameAsPropertyAddress"
        },
      })
    })
};
const commonApplicantInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle(
      {
        labelName: "Details of Authorised Person",
        labelKey: "PT_COMMON_OWNER_INFORMATION"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    applicantCard: getCommonContainer({
      mobileNumber: getTextField({
        label: {
          labelName: "Mobile No.",
          labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Mobile No.",
          labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_PLACEHOLDER"
        },
        required: true,
        props: {
          className: "applicant-details-error"
        },
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Property.owners[0].mobileNumber",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      applicantName: getTextField({
        label: {
          labelName: "Name",
          labelKey: "PT_COMMON_APPLICANT_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Name",
          labelKey: "PT_COMMON_APPLICANT_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "Property.owners[0].name",
        props: {
          className: "applicant-details-error"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      genderRadioGroup: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath: "Property.owners[0].gender",
        props: {
          label: { name: "Gender", key: "PT_COMMON_GENDER_LABEL" },
          className: "applicant-details-error",
          buttons: [
            {
              labelName: "Male",
              labelKey: "PT_COMMON_GENDER_MALE",
              value: "MALE"
            },
            {
              labelName: "FEMALE",
              labelKey: "PT_COMMON_GENDER_FEMALE",
              value: "FEMALE"
            },
            {
              labelName: "Transgender",
              labelKey: "PT_COMMON_GENDER_TRANSGENDER",
              value: "TRANSGENDER"
            }
          ],
          jsonPath: "Property.owners[0].gender",
          required: true,
          errorMessage: "Required",
        },
        required: true,
        type: "array"
      },
      guardianName: getTextField({
        label: {
          labelName: "Father/Husband's Name",
          labelKey: "PT_COMMON_FATHER_OR_HUSBAND_NAME"
        },
        placeholder: {
          labelName: "Enter Father/Husband's Name",
          labelKey: "PT_COMMON_ENTER_FATHER_OR_HUSBAND_NAME"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "Property.owners[0].fatherOrHusbandName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),
      relationshipWithGuardian: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pt",
        componentPath: "AutosuggestContainer",
        jsonPath: "Property.owners[0].relationship",//db sake
        required: true,
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          label: {
            labelName: "Relationship with Guardian",
            labelKey: "PT_COMMON_APPLICANT_RELATIONSHIP_LABEL"
          },
          placeholder: {
            labelName: "Select Relationship with Guardian",
            labelKey: "PT_COMMON_APPLICANT_RELATIONSHIP_PLACEHOLDER"
          },
          required: true,
          jsonPath: "Property.owners[0].relationship",
          data: [{ code: "FATHER" }, { code: "HUSBAND" }],
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerType"
          },
          labelsFromLocalisation: true,
          suggestions: [],
          fullwidth: true,
          isClearable: true,
          inputLabelProps: {
            shrink: true
          },
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
      },
      specialApplicantCategory: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pt",
        componentPath: "AutosuggestContainer",
        jsonPath: "Property.owners[0].ownerType",
        required: true,
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          className: "hr-generic-selectfield autocomplete-dropdown",
          label: {
            labelName: "Special Applicant Category",
            labelKey: "PT_COMMON_SPECIAL_APPLICANT_CATEGORY_LABEL"
          },
          placeholder: {
            labelName: "Select Special Applicant Category",
            labelKey: "PT_COMMON_SPECIAL_APPLICANT_CATEGORY_PLACEHOLDER"
          },
          jsonPath: "Property.owners[0].ownerType",
          required: true,
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerType"
          },
          sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
          labelsFromLocalisation: true,
          suggestions: [],
          fullwidth: true,
          isClearable: true,
          inputLabelProps: {
            shrink: true
          },
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
      },
      applicantAddress: getTextField({
        label: {
          labelName: "Correspondence Address",
          labelKey: "PT_COMMON_CORRESPONDENCE_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Correspondence Address",
          labelKey: "PT_COMMON_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        required: true,
        errorMessage: "Invalid Address",
        jsonPath: "Property.owners[0].permanentAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),
      sameAsPropertyAddress: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pt",
        componentPath: "CheckboxContainerPTCommon",
        gridDefination: { xs: 12, sm: 12, md: 12 },
        props: {
          labelKey: "PT_COMMON_SAME_AS_PROPERTY_ADDRESS",
          jsonPath: "Property.owners[0].sameAsPropertyAddress",
          required: false,
          destinationJsonPath: "permanentAddress"
        },
        type: "array",
        jsonPath: "Property.owners[0].sameAsPropertyAddress"
      },
    })
  });
};


export const propertyOwnershipDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Transferee Details",
      labelKey: "PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  applicantTypeContainer: getCommonContainer({
    applicantTypeSelection: getCommonContainer({
      applicantType: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pt",
        componentPath: "AutosuggestContainer",
        jsonPath: "Property.ownershipCategory",
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          className: "hr-generic-selectfield autocomplete-dropdown",
          label: {
            labelName: "Ownership Type",
            labelKey: "PT_COMMON_OWNERSHIP_TYPE"
          },
          placeholder: {
            labelName: "Select Ownership Type",
            labelKey: "PT_COMMON_SELECT_OWNERSHIP_TYPE"
          },
          jsonPath: "Property.ownershipCategory",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerShipCategory"
          },
          required: true,
          sourceJsonPath: "OwnershipCategory",
          required: true,
          isClearable: true,
          labelsFromLocalisation: true,
          inputLabelProps: {
            shrink: true
          },
        },
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        beforeFieldChange: (action, state, dispatch) => {

          let path = "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.children.institutionType.children.cardContent.children.institutionTypeDetailsContainer.children.privateInstitutionTypeDetails";


          let applicantType = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.Institutions",
            []
          );
          let applicantSubType = applicantType
            .filter(
              item => item
                .active &&
                item
                  .parent
                  .startsWith(action.value)
            );
          dispatch(
            handleField(
              "register-property",
              path,
              "props.data",
              applicantSubType
            )
          );

          let singleApplicantContainerJsonPath =
            "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer";
          let multipleApplicantContainerJsonPath =
            "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer"
          let institutionContainerJsonPath =
            "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";
          let institutionTypeContainerJsonPath = "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";

          if (action.value.includes("SINGLEOWNER")) {
            showComponent(
              dispatch,
              singleApplicantContainerJsonPath,
              true,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${singleApplicantContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              multipleApplicantContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${multipleApplicantContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              institutionContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${institutionContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              institutionTypeContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${institutionTypeContainerJsonPath}.props.style`
              )
            );

          } else if (action.value.includes("INSTITUTIONAL")) {
            dispatch(
              handleField(
                "register-property",
                path,
                "required",
                false
              )
            );

            dispatch(
              handleField(
                "register-property",
                path,
                "props.value",
                ''
              )
            );
            set(state.screenConfiguration.preparedFinalObject,"Property.institution.type", "");
            dispatch(
                prepareFinalObject(
                  "Property.institution.type",
                  ""
                )
              )
            showComponent(
              dispatch,
              singleApplicantContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${singleApplicantContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              multipleApplicantContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${multipleApplicantContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              institutionContainerJsonPath,
              true,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${institutionContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              institutionTypeContainerJsonPath,
              true,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${institutionTypeContainerJsonPath}.props.style`
              )
            );
          }
          else if (action.value.includes("MULTIPLEOWNERS")) {
            showComponent(
              dispatch,
              singleApplicantContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${singleApplicantContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              multipleApplicantContainerJsonPath,
              true,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${multipleApplicantContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              institutionContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${institutionContainerJsonPath}.props.style`
              )
            );
            showComponent(
              dispatch,
              institutionTypeContainerJsonPath,
              false,
              get(
                state,
                `screenConfiguration.screenConfig.register-property.${institutionTypeContainerJsonPath}.props.style`
              )
            );

            addItemInMultiselect(state, dispatch);
          }
        },
      },
    }),
    singleApplicantContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        individualApplicantInfo: commonApplicantInformation()
      }
    },
    multipleApplicantContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          display: "none"
        }
      },
      children: {
        multipleApplicantInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonApplicantInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Applicant",
              labelKey: "PT_COMMON_ADD_APPLICANT_LABEL"
            },
            sourceJsonPath:
              "Property.owners",
            prefixSourceJsonPath:
              "children.cardContent.children.applicantCard.children"
          },
          type: "array"
        }
      }
    },
    institutionContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          display: "none",
          width: "100%"
        }
      },
      children: {
        institutionType: institutionTypeInformation(),
        institutionInfo: institutionInformation()
      }
    }
  })
});



export const addItemInMultiselect = (state, dispatch, dynamicInput = {}) => {
  const {
    screenKey = "register-property",
    sourceJsonPath = "Property.owners",
    prefixSourceJsonPath = "children.cardContent.children.applicantCard.children",
    componentJsonpath = "components.div.children.formwizardFirstStep.children.propertyOwnershipDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo",
  } = dynamicInput;
  const screenConfig = get(state, "screenConfiguration.screenConfig", {});
  const scheama = get(screenConfig, `${screenKey}.${componentJsonpath}.props.scheama`, {});
  const items = get(screenConfig, `${screenKey}.${componentJsonpath}.props.items`, []);
  const itemsLength = items.length;

  if (sourceJsonPath) {
    let multiItemContent = get(scheama, prefixSourceJsonPath, {});
    for (var variable in multiItemContent) {
      if (
        multiItemContent.hasOwnProperty(variable) &&
        multiItemContent[variable].props &&
        multiItemContent[variable].props.jsonPath
      ) {
        let prefixJP = multiItemContent[variable].props.jsonPathUpdatePrefix
          ? multiItemContent[variable].props.jsonPathUpdatePrefix
          : sourceJsonPath;
        let splitedJsonPath = multiItemContent[variable].props.jsonPath.split(
          prefixJP
        );
        if (splitedJsonPath.length > 1) {
          let propertyName = splitedJsonPath[1].split("]");
          if (propertyName.length > 1) {
            multiItemContent[
              variable
            ].jsonPath = `${prefixJP}[${itemsLength}]${propertyName[1]}`;
            multiItemContent[
              variable
            ].props.jsonPath = `${prefixJP}[${itemsLength}]${
              propertyName[1]
              }`;
            multiItemContent[variable].index = itemsLength;
          }
        }
      }
    }

    set(scheama, prefixSourceJsonPath, multiItemContent);
  }
  items[itemsLength] = cloneDeep(
    addComponentJsonpath(
      { [`item${itemsLength}`]: scheama },
      `${componentJsonpath}.props.items[${itemsLength}]`
    )
  );
  dispatch(handleField(screenKey, componentJsonpath, `props.items`, items));

}