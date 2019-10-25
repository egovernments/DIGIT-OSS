import {
  getCommonCard,
  getTextField,
  getSelectField,
  getCommonContainer,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";
import { generateMultipleBill } from "../../utils/receiptPdf";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const tenantId = getTenantId();
const resetFields = (state, dispatch) => {
  // dispatch(
  //   handleField(
  //     "groupBills",
  //     "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.locMohalla",
  //     "props.value",
  //     ""
  //   )
  // );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.financialYear",
      "props.value",
      ""
    )
  );
  // dispatch(
  //   handleField(
  //     "groupBills",
  //     "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.serviceCategory",
  //     "props.value",
  //     ""
  //   )
  // );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.consumerId",
      "props.value",
      ""
    )
  );
};

export const abgSearchCard = getCommonCard({
  searchContainer: getCommonContainer(
    {
      ulb: getSelectField({
        label: {
          labelName: "ULB",
          labelKey: "ABG_ULB_LABEL"
        },
        labelPrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        optionLabel: "name",
        placeholder: {
          labelName: "Select ULB",
          labelKey: "ABG_ULB_PLACEHOLDER"
        },
        sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
        jsonPath: "searchCriteria.tenantId",
        required: true,
        disabled: false,
        props: {
          value: tenantId,
          disabled: true
        },
        gridDefination: {
          xs: 12,
          sm: 4
        }
      }),
      locMohalla: {
        uiFramework: "custom-containers",
        componentPath: "AutosuggestContainer",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        jsonPath: "searchCriteria.locality",
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          label: {
            labelName: "Location/Mohalla",
            labelKey: "ABG_LOCMOHALLA_LABEL"
          },
          placeholder: {
            labelName: "Select Location/Mohalla",
            labelKey: "ABG_LOCMOHALLA_PLACEHOLDER"
          },
          jsonPath: "searchCriteria.locality",
          sourceJsonPath: "searchScreenMdmsData.localities",
          labelsFromLocalisation: true,
          suggestions: [],
          visible: true,
          fullwidth: true,
          required: false,
          inputLabelProps: {
            shrink: true
          }
        }
      },
      financialYear: getSelectField({
        label: {
          labelName: "Financial Year",
          labelKey: "ABG_FINANCIAL_YEAR_LABEL"
        },
        placeholder: {
          labelName: "Select Financial Year",
          labelKey: "ABG_FINANCIAL_YEAR_PLACEHOLDER"
        },
        required: true,
        visible: true,
        jsonPath: "searchCriteria.financialYear",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
        sourceJsonPath: "searchScreenMdmsData.egf-master.FinancialYear"
      }),
      serviceCategory: getSelectField({
        label: {
          labelName: "Service Category",
          labelKey: "ABG_SERVICE_CATEGORY_LABEL"
        },
        placeholder: {
          labelName: "Select Service Category",
          labelKey: "ABG_SERVICE_CATEGORY_PLACEHOLDER"
        },
        required: true,
        jsonPath: "searchCriteria.businesService",
        props: {
          disabled: true,
          value: "PT" //Hardcoded!!
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
        sourceJsonPath: "searchScreenMdmsData.BillingService.BusinessService"
      }),
      consumerId: getTextField({
        label: {
          labelName: "Consumer ID",
          labelKey: "ABG_CONSUMER_ID_LABEL"
        },
        placeholder: {
          labelName: "Enter Consumer ID",
          labelKey: "ABG_CONSUMER_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4
        },
        required: false,
        // pattern: getPattern("PropertyID"),
        // errorMessage: "Invalid Property ID",
        jsonPath: "searchCriteria.consumerCode"
      })
    },
    {
      style: {
        overflow: "visible"
      }
    }
  ),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 3
        }
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            border: "#FE7A51 solid 1px",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "RESET",
            labelKey: "ABG_RESET_BUTTON"
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
          sm: 3
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "#FE7A51",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "ABG_GROUP_BILL_SEARCH_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
      lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 3
        }
      }
    })
  })
});

export const mergeDownloadButton = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  props: {
    className: "abg-button-container",
    style: {
      textAlign: "right"
    }
  },
  children: {
    mergeButton: {
      componentPath: "Button",
      visible: false,
      props: {
        variant: "contained",
        color: "primary",
        style: {
          color: "white",
          borderRadius: "2px",
          width: "250px",
          height: "48px"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "MERGE & DOWNLOAD",
          labelKey: "ABG_GROUP_BILLS_MERGE_AND_DOWNLOAD_BUTTON"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: generateMultipleBill
      }
    }
  }
};
