import {
  getCommonCard,

  getCommonContainer,

  getDateField, getPattern, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { setServiceCategory } from "../../utils";

const tenantId = getTenantId();


const serviceTypeChange = (reqObj) => {
  let { state, value, dispatch } = reqObj;
  dispatch(prepareFinalObject('Demands[0].businessService', value));
  const demandId = get(
    state.screenConfiguration.preparedFinalObject,
    "Demands[0].id",
    null
  );


  if (!demandId && value) {
    const taxHeads = setTaxHeadFields(value, state, dispatch);
  }

}

const serviceCategoryChange = (reqObj) => {
  let { state, value, dispatch } = reqObj;
  dispatch(prepareFinalObject('Demands[0].consumerType', value));
  const demandId = get(
    state.screenConfiguration.preparedFinalObject,
    "Demands[0].id",
    null
  );
  resetTaxAmountFields(state, dispatch);
  const serviceData = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.nestedServiceData",
    {}
  );
  //Set tax head fields if there is no service type available
  if (!demandId && serviceData[value]) {
    const taxHeads = setTaxHeadFields(value, state, dispatch);
  }

}

export const newCollectionDetailsCard = getCommonCard(
  {
    searchContainer: getCommonContainer(
      {
        City: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-uc",
          componentPath: "AutosuggestContainer",
          props: {
            label: {
              labelName: "City",
              labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            },
            localePrefix: {
              moduleName: "TENANT",
              masterName: "TENANTS"
            },
            optionLabel: "name",
            placeholder: {
              labelName: "Select City",
              labelKey: "TL_SELECT_CITY"
            },
            required: true,
            value: tenantId,
            disabled: true,
            labelsFromLocalisation: true,
            isClearable: true,
            className: "autocomplete-dropdown",
            sourceJsonPath: "applyScreenMdmsData.tenant.citiesByModule",
          },
          jsonPath: "Demands[0].tenantId",
          gridDefination: {
            xs: 12,
            sm: 6
          },
          beforeFieldChange: async (action, state, dispatch) => {
            const citiesByModule = get(
              state,
              "common.citiesByModule.UC.tenants",
              []
            );
            if (!citiesByModule.find(item => item.code === action.value)) {
              return action;
            }
            let requestBody = {
              MdmsCriteria: {
                tenantId: action.value,
                moduleDetails: [
                  {
                    moduleName: "BillingService",
                    masterDetails: [
                      {
                        name: "BusinessService",
                        filter: "[?(@.type=='Adhoc')]"
                      },
                      {
                        name: "TaxHeadMaster"
                      },
                      {
                        name: "TaxPeriod"
                      }
                    ]
                  }
                ]
              }
            };
            try {
              let payload = null;
              payload = await httpRequest(
                "post",
                "/egov-mdms-service/v1/_search",
                "_search",
                [],
                requestBody
              );
              dispatch(
                prepareFinalObject(
                  "applyScreenMdmsData.BillingService",
                  payload.MdmsRes.BillingService
                )
              );
              setServiceCategory(
                get(payload, "MdmsRes.BillingService.BusinessService", []),
                dispatch
              );
            } catch (e) {
              console.log(e);
            }
            return action;
          }
        },
        dummyDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 6
          },
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            disabled: true
          }
        },
        ConsumerMobileNo: getTextField({
          label: {
            labelName: "Mobile No",
            labelKey: "UC_MOBILE_NO_LABEL"
          },
          placeholder: {
            labelName: "Enter Mobile No",
            labelKey: "UC_MOBILE_NO_PLACEHOLDER"
          },
          iconObj: {
            label: "+91 |",
            position: "start"
          },
          required: true,
          visible: true,
          pattern: getPattern("MobileNo"),
          errorMessage: "Invalid Mobile No.",
          jsonPath: "Demands[0].mobileNumber"
        }),
        ConsumerName: getTextField({
          label: {
            labelName: "Consumer Name",
            labelKey: "UC_CONS_NAME_LABEL"
          },
          placeholder: {
            labelName: "Enter Consumer Name",
            labelKey: "UC _CONS_NAME_LABEL_PLACEHOLDER"
          },

          required: true,
          visible: true,
          pattern: getPattern("Name"),
          errorMessage: "Invalid Name.",
          jsonPath: "Demands[0].consumerName"
        }),
        // serviceCategory: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-uc",
        //   componentPath: "AutosuggestContainer",
        //   jsonPath: "Demands[0].businessService",
        //   gridDefination: {
        //     xs: 12,
        //     sm: 6
        //   },
        //   required: true,
        //   props: {
        //     className: "autocomplete-dropdown",
        //     label: {
        //       labelName: "Service Category",
        //       labelKey: "UC_SERVICE_CATEGORY_LABEL"
        //     },
        //     placeholder: {
        //       labelName: "Select service Category",
        //       labelKey: "UC_SERVICE_CATEGORY_PLACEHOLDER"
        //     },
        //     localePrefix: {
        //       masterName: "BusinessService",
        //       moduleName: "BillingService"
        //     },
        //     required: true,
        //     visible: true,
        //     jsonPath: "Demands[0].businessService",
        //     sourceJsonPath: "applyScreenMdmsData.serviceCategories",
        //     labelsFromLocalisation: true,
        //   },
        //   beforeFieldChange: async (action, state, dispatch) => {
        //     //Reset service type value, if any
        //     if (get(state, 'screenConfiguration.preparedFinalObject.Demands[0].serviceType', null)) {
        //       dispatch(
        //         handleField(
        //           "newCollection",
        //           "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
        //           "props.value",
        //           null
        //         )
        //       );
        //     }
        //     //Set service type data and field if available.
        //     const serviceData = get(
        //       state.screenConfiguration,
        //       "preparedFinalObject.applyScreenMdmsData.nestedServiceData",
        //       {}
        //     );
        //     if (action.value) {
        //       if (
        //         serviceData[action.value] &&
        //         serviceData[action.value].child &&
        //         serviceData[action.value].child.length > 0
        //       ) {
        //         dispatch(
        //           prepareFinalObject(
        //             "applyScreenMdmsData.serviceTypes",
        //             serviceData[action.value].child
        //           )
        //         );
        //         dispatch(
        //           handleField(
        //             "newCollection",
        //             "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
        //             "visible",
        //             true
        //           )
        //         );
        //       } else {
        //         dispatch(
        //           handleField(
        //             "newCollection",
        //             "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
        //             "visible",
        //             false
        //           )
        //         );
        //         const demandId = get(
        //           state.screenConfiguration.preparedFinalObject,
        //           "Demands[0].id",
        //           null
        //         );
        //         //Set tax head fields if there is no service type available
        //         if (!demandId && serviceData[action.value]) {
        //           const taxHeads = setTaxHeadFields(action, state, dispatch);
        //         }
        //       }
        //     }
        //   }
        // },
        // serviceType: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-uc",
        //   componentPath: "AutosuggestContainer",
        //   props: {
        //     label: {
        //       labelName: "Service Type",
        //       labelKey: "UC_SERVICE_TYPE_LABEL"
        //     },
        //     localePrefix: {
        //       masterName: "BusinessService",
        //       moduleName: "BillingService"
        //     },
        //     placeholder: {
        //       labelName: "Select Service Type",
        //       labelKey: "UC_SERVICE_TYPE_PLACEHOLDER"
        //     },
        //     required: true,
        //     visible: false,
        //     labelsFromLocalisation: true,
        //     className: "autocomplete-dropdown",
        //     sourceJsonPath: "applyScreenMdmsData.serviceTypes",
        //   },
        //   required: true,
        //   jsonPath: "Demands[0].serviceType",
        //   gridDefination: {
        //     xs: 12,
        //     sm: 6
        //   },
        //   beforeFieldChange: async (action, state, dispatch) => {
        //     const demandId = get(
        //       state.screenConfiguration.preparedFinalObject,
        //       "Demands[0].id",
        //       null
        //     );
        //     if (!demandId && action.value) {
        //       const taxHeads = setTaxHeadFields(action, state, dispatch);
        //       console.log(taxHeads);
        //     }
        //   }
        // },

        dynamicMdmsServiceCategory: {
          uiFramework: "custom-containers",
          componentPath: "DynamicMdmsContainer",
          props: {
            dropdownFields: [
              {
                key: 'serviceCategory',
                fieldType: "autosuggest",
                callBack: serviceCategoryChange,
                className: "applicant-details-error autocomplete-dropdown",
                isRequired: false,
                requiredValue: true
              },
              {
                key: 'serviceType',
                callBack: serviceTypeChange,
                fieldType: "autosuggest",
                className: "applicant-details-error autocomplete-dropdown",
                isRequired: false,
                requiredValue: true
              }
            ],
            moduleName: "BillingService",
            masterName: "BusinessService",
            rootBlockSub: 'serviceCategories',
            filter: "[?(@.type=='Adhoc')]"
          }
        },
        fromDate: getDateField({
          label: {
            labelName: "From Date",
            labelKey: "UC_FROM_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter from Date",
            labelKey: "UC_SELECT_FROM_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: true,
          pattern: getPattern("Date"),
          jsonPath: "Demands[0].taxPeriodFrom"
        }),
        toDate: getDateField({
          label: {
            labelName: "To Date",
            labelKey: "UC_TO_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter to Date",
            labelKey: "UC_SELECT_TO_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: true,
          pattern: getPattern("Date"),
          jsonPath: "Demands[0].taxPeriodTo"
        }),
        dummyDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 6
          },
          visible: true,
          props: {
            disabled: true
          }
        }
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    commentsContainer: getCommonContainer({
      comments: getTextField({
        label: {
          labelName: "Comments",
          labelKey: "UC_COMMENT_LABEL"
        },
        placeholder: {
          labelName: "Enter Comment ",
          labelKey: "UC_COMMENT_PLACEHOLDER"
        },
        Required: false,
        jsonPath: "Demands[0].additionalDetails.comment"
      })
    })
  },
  {
    style: {
      overflow: "visible"
    }
  }
);

const resetTaxAmountFields = (state, dispatch) => {
  const noOfPreviousTaxHeads = get(
    state.screenConfiguration,
    "preparedFinalObject.Demands[0].demandDetails",
    []
  ).length;
  const taxFields = get(
    state.screenConfiguration,
    "screenConfig.newCollection.components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
    {}
  );
  const taxFieldKeys = Object.keys(taxFields).filter(item =>
    item.startsWith("taxheadField_")
  );
  if (noOfPreviousTaxHeads > 0) {
    for (let i = 0; i < taxFieldKeys.length; i++) {
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
          `${taxFieldKeys[i]}.props.value`,
          ""
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
          `${taxFieldKeys[i]}.visible`,
          false
        )
      );
    }
    dispatch(prepareFinalObject(`Demands[0].demandDetails`, []));
  }
}

const setTaxHeadFields = (value, state, dispatch) => {
  const serviceData = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.nestedServiceData",
    {}
  );
  const taxHeadMasters = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.BillingService.TaxHeadMaster",
    {}
  );
  const matchingTaxHeads = taxHeadMasters.filter(
    item => item.service === value
  );
  if (matchingTaxHeads && matchingTaxHeads.length > 0) {
    //Delete previous Tax Head fields
    const noOfPreviousTaxHeads = get(
      state.screenConfiguration,
      "preparedFinalObject.Demands[0].demandDetails",
      []
    ).length;
    const taxFields = get(
      state.screenConfiguration,
      "screenConfig.newCollection.components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
      {}
    );
    const taxFieldKeys = Object.keys(taxFields).filter(item =>
      item.startsWith("taxheadField_")
    );
    if (noOfPreviousTaxHeads > 0) {
      for (let i = 0; i < taxFieldKeys.length; i++) {
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
            `${taxFieldKeys[i]}.props.value`,
            ""
          )
        );
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
            `${taxFieldKeys[i]}.visible`,
            false
          )
        );
      }
      dispatch(prepareFinalObject(`Demands[0].demandDetails`, []));
    }
    //Show new tax head fields
    matchingTaxHeads.forEach((item, index) => {
      dispatch(
        prepareFinalObject(
          `Demands[0].demandDetails[${index}].taxHeadMasterCode`,
          item.code
        )
      );
      dispatch(
        prepareFinalObject(
          `Demands[0].demandDetails[${index}].collectionAmount`,
          0
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
          `taxheadField_${item.code.split(".").join("_")}`,
          getTextField({
            label: {
              labelName: "Tax Amount",
              labelKey: `${getTransformedLocale(item.code)}`
            },
            placeholder: {
              labelName: "Enter Tax Amount",
              labelKey: "UC_AMOUNT_TO_BE_COLLECTED_PLACEHOLDER"
            },
            componentJsonpath: `components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.taxheadField_${item.code
              .split(".")
              .join("_")}`,
            required: item.isRequired || false,
            pattern: /^[0-9]{0,8}$/i,
            errorMessage: "Invalid Amount",
            visible: true,
            // required: true,
            props: {
              // required: true
            },
            type:"number",
            jsonPath: `Demands[0].demandDetails[${index}].taxAmount`
          })
        )
      );
    });
    // dispatch(
    //   handleField(
    //     "newCollection",
    //     "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
    //     `comment`,
    //     getTextField({
    //       label: {
    //         labelName: "Comments",
    //         labelKey: "UC_COMMENT_LABEL"
    //       },
    //       placeholder: {
    //         labelName: "Enter Comment ",
    //         labelKey: "UC_COMMENT_PLACEHOLDER"
    //       },
    //       Required: false,
    //       jsonPath: "Demands[0].comment",
    //       componentJsonpath: `components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.comment`
    //     })
    //   )
    // );
  }
};

// const setServiceCategory = (businessServiceData, dispatch) => {
//   let nestedServiceData = {};
//   businessServiceData.forEach(item => {
//     if (item.code && item.code.indexOf(".") > 0) {
//       if (nestedServiceData[item.code.split(".")[0]]) {
//         let child = get(
//           nestedServiceData,
//           `${item.code.split(".")[0]}.child`,
//           []
//         );
//         child.push(item);
//         set(nestedServiceData, `${item.code.split(".")[0]}.child`, child);
//       } else {
//         set(
//           nestedServiceData,
//           `${item.code.split(".")[0]}.code`,
//           item.code.split(".")[0]
//         );
//         set(nestedServiceData, `${item.code.split(".")[0]}.child[0]`, item);
//       }
//     } else {
//       set(nestedServiceData, `${item.code}`, item);
//     }
//   });
//   dispatch(
//     prepareFinalObject(
//       "applyScreenMdmsData.nestedServiceData",
//       nestedServiceData
//     )
//   );
//   let serviceCategories = Object.values(nestedServiceData).filter(
//     item => item.code
//   );
//   dispatch(
//     prepareFinalObject(
//       "applyScreenMdmsData.serviceCategories",
//       serviceCategories
//     )
//   );
// };
