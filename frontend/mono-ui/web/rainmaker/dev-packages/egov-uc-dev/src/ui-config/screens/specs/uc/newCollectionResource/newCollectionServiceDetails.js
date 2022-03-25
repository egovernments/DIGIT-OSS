import commonConfig from "config/common.js";
import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle, getDateField, getPattern, getSelectField, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import get from "lodash/get";
import { setServiceCategory } from "../../utils";
const tenantId = getTenantId();

export const newCollectionServiceDetailsCard = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Service Details",
        labelKey: "SERVICEDETAILS",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),

    searchContainer: getCommonContainer(
      {
        City: {
          ...getSelectField({
            label: {
              labelName: "City",
              labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL",
            },
            localePrefix: {
              moduleName: "TENANT",
              masterName: "TENANTS",
            },
            optionLabel: "name",
            placeholder: {
              labelName: "Select City",
              labelKey: "TL_SELECT_CITY",
            },
            sourceJsonPath: "applyScreenMdmsData.tenant.citiesByModule",
            jsonPath: "Challan[0].tenantId",
            required: true,
            props: {
              required: true,
              disabled: true,
            },
          }),
          beforeFieldChange: async (action, state, dispatch) => {

            const citiesByModule = get(
              state,
              "common.citiesByModule.UC.tenants",
              []
            );
            if (!citiesByModule.find((item) => item.code === action.value)) {
              return action;
            }

            let requestBody = {
              MdmsCriteria: {
                tenantId: commonConfig.tenantId,
                moduleDetails: [
                  {
                    moduleName: "BillingService",
                    masterDetails: [
                      {
                        name: "BusinessService",
                        filter: "[?(@.type=='Adhoc')]",
                      },
                      {
                        name: "TaxHeadMaster",
                      },
                      {
                        name: "TaxPeriod",
                      },
                    ],
                  },
                ],
              },
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
                dispatch,
                state
              );
            } catch (e) {
              console.log(e);
            }

            return action;
          },
        },
        // helpPdfButton: {
        //   componentPath: "Button",
        //   jsonPath: "Challan[0].ucCollection.pdf",
        //   gridDefination: {
        //     xs: 12,
        //     sm: 6,
        //   },
        //   props: {
        //     //variant: "outlined",
        //     color: "primary",
        //     style: {
        //       minWidth: "180px",
        //       height: "48px",
        //       marginRight: "45",
        //       borderRadius: "inherit",
        //     },
        //   },

        //   onClickDefination: {
        //     action: "condition",
        //     callBack: (state, dispatch) => {
        //       downloadHelpFile(state, dispatch);
        //     },
        //   },
        //   children: {
        //     downloadButtonIcon: {
        //       uiFramework: "custom-atoms",
        //       componentPath: "Icon",
        //       props: {
        //         iconName: "cloud_download",
        //       },
        //     },
        //     downloadButtonLabel: getLabel({
        //       labelName: "Help ?",
        //       labelKey: "UC_HELP_FILE",
        //     }),
        //   },
        // },

        serviceCategory: {
          uiFramework: "custom-containers",
          componentPath: "AutosuggestContainer",
          jsonPath: "Challan[0].consumerType",
          gridDefination: {
            xs: 12,
            sm: 6,
          },
          required: true,
          props: {
            style: {
              width: "100%",
              cursor: "pointer",
            },
            className: "autocomplete-dropdown",
            label: {
              labelName: "Service Category",
              labelKey: "UC_SERVICE_CATEGORY_LABEL",
            },
            placeholder: {
              labelName: "Select service Category",
              labelKey: "UC_SERVICE_CATEGORY_PLACEHOLDER",
            },
            localePrefix: {
              masterName: "BusinessService",
              moduleName: "BillingService",
            },

            visible: true,
            jsonPath: "Challan[0].consumerType",
            sourceJsonPath: "applyScreenMdmsData.serviceCategories",
            labelsFromLocalisation: true,
            suggestions: [],
            fullwidth: true,
            inputLabelProps: {
              shrink: true,
            },
          },
          beforeFieldChange: async (action, state, dispatch) => {
            //Reset service type value, if any

            const editingMode = get(
              state.screenConfiguration,
              "preparedFinalObject.Challan[0].id",
              null
            );
            let selServiceType = null;
            if (editingMode != null) {
              selServiceType = get(
                state.screenConfiguration,
                "preparedFinalObject.Challan[0].businessService",
                null
              );
            }


            dispatch(
              handleField(
                "newCollection",
                "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
                "props.value",
                selServiceType
              )
            );


            //Set service type data and field if available.
            const serviceData = get(
              state.screenConfiguration,
              "preparedFinalObject.applyScreenMdmsData.nestedServiceData",
              { }
            );
            if (action.value) {

              let visibleFlag = false;
              if (
                serviceData[action.value] &&
                serviceData[action.value].child &&
                serviceData[action.value].child.length > 0
              ) {
                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.serviceTypes",
                    serviceData[action.value].child
                  )
                );
                visibleFlag = true;
              }
              dispatch(
                handleField(
                  "newCollection",
                  "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
                  "visible",
                  visibleFlag
                )
              );
            }
          },
        },

        serviceType: {
          uiFramework: "custom-containers",
          componentPath: "AutosuggestContainer",
          jsonPath: "Challan[0].businessService",
          gridDefination: {
            xs: 12,
            sm: 6,
          },
          required: true,
          props: {
            style: {
              width: "100%",
              cursor: "pointer",
            },
            className: "autocomplete-dropdown",
            label: {
              labelName: "Service Type",
              labelKey: "UC_SERVICE_TYPE_LABEL",
            },
            placeholder: {
              labelName: "Select service Type",
              labelKey: "UC_SERVICE_TYPE_PLACEHOLDER",
            },
            localePrefix: {
              masterName: "BusinessService",
              moduleName: "BillingService",
            },

            visible: true,
            jsonPath: "Challan[0].businessService",
            sourceJsonPath: "applyScreenMdmsData.serviceTypes",
            labelsFromLocalisation: true,
            suggestions: [],
            fullwidth: true,
            inputLabelProps: {
              shrink: true,
            },
          },
          beforeFieldChange: async (action, state, dispatch) => {

            if (action.value) {
              setTaxHeadFields(action, state, dispatch);
            }
          },
        },

        fromDate: getDateField({
          label: {
            labelName: "From Date",
            labelKey: "UC_FROM_DATE_LABEL",
          },
          placeholder: {
            labelName: "Enter from Date",
            labelKey: "UC_SELECT_FROM_DATE_PLACEHOLDER",
          },
          gridDefination: {
            xs: 12,
            sm: 6,
          },
          required: true,
          pattern: getPattern("Date"),
          jsonPath: "Challan[0].taxPeriodFrom",
          beforeFieldChange: async (action, state, dispatch) => {

            if (action.value) {
              dispatch(
                handleField(
                  "newCollection",
                  "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.toDate",
                  "props.disabled",
                  false
                )
              );
              dispatch(
                handleField(
                  "newCollection",
                  "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.toDate",
                  "props.inputProps.min",
                  action.value
                )
              );
            }
          },
        }),
        toDate: getDateField({
          label: {
            labelName: "To Date",
            labelKey: "UC_TO_DATE_LABEL",
          },
          placeholder: {
            labelName: "Enter to Date",
            labelKey: "UC_SELECT_TO_DATE_PLACEHOLDER",
          },
          gridDefination: {
            xs: 12,
            sm: 6,
          },
          required: true,
          props: {
            disabled: true,
          },
          pattern: getPattern("Date"),
          jsonPath: "Challan[0].taxPeriodTo",
        }),
      },
      {
        style: {
          overflow: "visible",
        },
      }
    ),
    commentsContainer: getCommonContainer({
      comments: getTextField({
        gridDefination: {
          xs: 12,
          sm: 6,
        },
        label: {
          labelName: "Comments",
          labelKey: "UC_COMMENT_LABEL",
        },
        placeholder: {
          labelName: "Enter Comment ",
          labelKey: "UC_COMMENT_PLACEHOLDER",
        },
        Required: false,
        jsonPath: "Challan[0].description",
      }),
    }),
  },
  {
    style: {
      overflow: "visible",
    },
  }
);

const setTaxHeadFields = (action, state, dispatch) => {
  const taxHeadMasters = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.BillingService.TaxHeadMaster",
    { }
  );
  const matchingTaxHeads = taxHeadMasters.filter(
    (item) => item.service === action.value
  );
  if (matchingTaxHeads && matchingTaxHeads.length > 0) {
    //Delete previous Tax Head fields
    const noOfPreviousTaxHeads = get(
      state.screenConfiguration,
      "preparedFinalObject.Challan[0].amount",
      []
    ).length;
    const taxFields = get(
      state.screenConfiguration,
      "screenConfig.newCollection.components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children",
      { }
    );
    const taxFieldKeys = Object.keys(taxFields).filter((item) =>
      item.startsWith("taxheadField_")
    );
    const editingMode = get(
      state.screenConfiguration,
      "preparedFinalObject.Challan[0].id",
      null
    );
    if (noOfPreviousTaxHeads > 0) {
      for (let i = 0; i < taxFieldKeys.length; i++) {
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children",
            `${taxFieldKeys[i]}.props.value`,
            ""
          )
        );
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children",
            `${taxFieldKeys[i]}.visible`,
            false
          )
        );
      }
      if (editingMode == null) {
        dispatch(prepareFinalObject(`Challan[0].amount`, []));
      }
    }

    //Show new tax head fields
    matchingTaxHeads.forEach((item, index) => {

      dispatch(
        prepareFinalObject(`Challan[0].amount[${index}].taxHeadCode`, item.code)
      );
      let prevCollection = get(
        state.screenConfiguration,
        "preparedFinalObject.ChallanTaxHeads",
        []
      );
      let colAmount = get(find(prevCollection, { "taxHeadCode": item.code }), "amount", "");
      dispatch(
        prepareFinalObject(`Challan[0].amount[${index}].amount`, colAmount)
      );


      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children",
          `taxheadField_${item.code.split(".").join("_")}`,
          getTextField({
            label: {
              labelName: "Tax Amount",
              labelKey: `${getTransformedLocale(item.code)}`,
            },
            placeholder: {
              labelName: "Enter Tax Amount",
              labelKey: "UC_AMOUNT_TO_BE_COLLECTED_PLACEHOLDER",
            },
            componentJsonpath: `components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.taxheadField_${item.code
              .split(".")
              .join("_")}`,
            required: item.isRequired || false,
            pattern: getPattern("DecimalNumber"),
            //errorMessage: "Invalid Amount",
            visible: item.code.endsWith('_ROUNDOFF') ? false : true,
            // required: true,
            props: {
              // required: true
              //visible:item.code.endsWith('_ROUNDOFF')? false: true,
              type: "text"
            },
            jsonPath: `Challan[0].amount[${index}].amount`,
          })
        )
      );
    });
  }
};
