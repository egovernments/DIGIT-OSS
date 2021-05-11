import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getSelectField,
    getCommonContainer,
    getCommonParagraph,
    getPattern,
    getDateField,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const resetFields = (state, dispatch) => {
    dispatch(
        handleField(
            "search",
            "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children.city",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children.propertyid",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children.ownerMobNo",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children.consumerid",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children.oldConsumerid",
            "props.value",
            ""
        )
    );
};
export const citizenApplication = getCommonCard({
    subHeader: getCommonTitle({
        labelKey: "WS_SEARCH_CONNECTION_SUB_HEADER"
    }),
    subParagraph: getCommonParagraph({
        labelKey: "WS_HOME_SEARCH_CONN_RESULTS_DESC"
    }),
    cityPropertyAndMobNumContainer: getCommonContainer({
        city: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-wns",
            componentPath: "AutosuggestContainer",
            jsonPath: "searchScreen.tenantId",
            props: {
              className: "hr-generic-selectfield autocomplete-dropdown",
              label: {
                labelKey: "WS_PROP_DETAIL_CITY",
                labelName: "City"
              },
              placeholder: {
                labelKey: "WS_PROP_DETAIL_CITY_PLACEHOLDER",
                labelName: "Select City"
              },
              localePrefix: {
                moduleName: "TENANT",
                masterName: "TENANTS"
              },
              required: true,
              isClearable: true,
              labelsFromLocalisation: true,
              jsonPath: "searchScreen.tenantId",
              sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
            },
            required: true,
            gridDefination: { xs: 12, sm: 4 },
          },
        propertyid: getTextField({
            label: {
                labelKey: "WS_PROPERTY_ID_LABEL"
            },
            placeholder: {
                labelKey: "WS_PROPERTY_ID_PLACEHOLDER"
            },
            gridDefination: {
                xs: 12,
                sm: 4
            },
            required: false,
            pattern: /^[a-zA-Z0-9-]*$/i,
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "searchScreen.propertyId"
        }),
        ownerMobNo: getTextField({
            label: {
                labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
            },
            placeholder: {
                labelKey: "WS_OWN_DETAIL_MOBILE_NO_PLACEHOLDER"
            },
            gridDefination: {
                xs: 12,
                sm: 4
            },
            iconObj: {
                label: "+91 |",
                position: "start"
            },
            required: false,
            pattern: getPattern("MobileNo"),
            jsonPath: "searchScreen.mobileNumber",
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
        }),
        consumerid: getTextField({
            label: {
                labelKey: "WS_MYCONNECTIONS_CONSUMER_NO"
            },
            placeholder: {
                labelKey: "WS_SEARCH_CONNNECTION_CONSUMER_PLACEHOLDER"
            },
            gridDefination: {
                xs: 12,
                sm: 4
            },
            required: false,
            pattern: getPattern("consumerNo"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "searchScreen.connectionNumber"
        }),
        oldConsumerid: getTextField({
            label: {
                labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_LABEL"
            },
            placeholder: {
                labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_PLACEHOLDER"
            },
            gridDefination: {
                xs: 12,
                sm: 4
            },
            required: false,
            pattern: /^[a-zA-Z0-9-]*$/i,
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "searchScreen.oldConnectionNumber"
        }),        
    }),
    button: getCommonContainer({
        buttonContainer: getCommonContainer({
            resetButton: {
                componentPath: "Button",
                gridDefination: {
                    xs: 12,
                    sm: 6
                },
                props: {
                    variant: "outlined",
                    style: {
                        color: "rgba(0, 0, 0, 0.6000000238418579)",
                        borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
                        width: "220px",
                        height: "48px",
                        margin: "8px",
                        float: "right"
                    }
                },
                children: {
                    buttonLabel: getLabel({
                        labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON"
                    })
                },
                onClickDefination: {
                    action: "condition",
                    callBack: resetFields
                }
            },
            searchButton: {
                componentPath: "Button",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                },
                props: {
                    variant: "contained",
                    style: {
                        color: "white",
                        margin: "8px",
                        backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                        borderRadius: "2px",
                        width: "220px",
                        height: "48px"
                    }
                },
                children: {
                    buttonLabel: getLabel({
                        labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON"
                    })
                },
                onClickDefination: {
                    action: "condition",
                    callBack: searchApiCall
                }
            }
        })
    })
});