import {
  getCommonCard,


  getCommonContainer,
  getLabel, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
// import { generateMultipleBill } from "../../utils/receiptPdf";
import { searchApiCall } from "./functions";

// const wsBillinData = [
//   {
//     code: "JAN 2018 - MAR 2018",
//     label: "Jan 2018 - Mar 2018"
//   },
//   {
//     code: "APRIL 2018 - JUL 2018",
//     label: "April 2018 - Jul 2018"
//   },
//   {
//     code: "AUG 2018 - NOV 2018",
//     label: "Aug 2018 - Nov 2018"
//   }
// ]

const tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;
export const resetFields = (state, dispatch) => {
  // dispatch(
  //   handleField(
  //     "groupBills",
  //     "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.billingPeriod",
  //     "props.value",
  //     ""
  //   )
  // );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.ulb",
      "props.value",
      tenantId
    )
  );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.consumerId",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.locMohalla",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.locMohalla",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.locMohalla",
      "props.helperText",
      ""
    )
  );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.serviceCategory",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.serviceCategory",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.serviceCategory",
      "props.helperText",
      ""
    )
  );
};

export const abgSearchCard = getCommonCard({
  searchContainer: getCommonContainer(
    {
      ulb: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-abg",
        componentPath: "AutosuggestContainer",
        props: {
          label: {
            labelName: "ULB",
            labelKey: "ABG_ULB_LABEL"
          },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: {
            labelName: "Select ULB",
            labelKey: "ABG_ULB_PLACEHOLDER"
          },
          required: true,
          value: tenantId,
          disabled: true,
          isClearable: true,
          labelsFromLocalisation: true,
          className:"autocomplete-dropdown",
          jsonPath: "searchCriteria.tenantId",
          sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
        },
        required: true,
        jsonPath: "searchCriteria.tenantId",
        disabled: false,
        gridDefination: {
          xs: 12,
          sm: 4
        }
      },
      serviceCategory: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-abg",
        componentPath: "AutosuggestContainer",
        props: {
          label: {
            labelName: "Service Category",
            labelKey: "ABG_SERVICE_CATEGORY_LABEL"
          },
          placeholder: {
            labelName: "Select Service Category",
            labelKey: "ABG_SERVICE_CATEGORY_PLACEHOLDER"
          },
          required: true,
          localePrefix : {
            moduleName : "BillingService",
            masterName : "BusinessService"
          },
          labelsFromLocalisation: true,
          isClearable: true,
          className:"autocomplete-dropdown",
          jsonPath: "searchCriteria.businesService",
          sourceJsonPath: "searchScreenMdmsData.BillingService.BusinessService",
        },
        required: true,
        jsonPath: "searchCriteria.businesService",
        gridDefination: {
          xs: 12,
          sm: 4
        },

        // beforeFieldChange :(action, state, dispatch) => {
        //   if(action.value === "WS"){
        //     dispatch(
        //       handleField(
        //         "groupBills",
        //         "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.billingPeriod",
        //         "props.data",
        //         wsBillinData
        //       )
        //     );
        //   }else if(action.value === "PT"){
        //     dispatch(
        //       handleField(
        //         "groupBills",
        //         "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children.billingPeriod",
        //         "props.sourceJsonPath",
        //         "searchScreenMdmsData.egf-master.FinancialYear"
        //       )
        //     );
        //   }

        // }
      },
      // billingPeriod: getSelectField({
      //   label: {
      //     labelName: "Financial Year",
      //     labelKey: "ABG_BILLING_PERIOD_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Select Financial Year",
      //     labelKey: "ABG_BILLING_PERIOD_PLACEHOLDER"
      //   },
      //   required: true,
      //   visible: true,
      //   jsonPath: "searchCriteria.billingPeriod",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   },
      //   visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      // }),
      locMohalla: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-abg",
        componentPath: "AutosuggestContainer",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        jsonPath: "searchCriteria.locality",
        required: true,
        props: {
          className: "autocomplete-dropdown",
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
          required: true,
          isClearable:true,
        }
      },
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
        jsonPath: "searchCriteria.consumerCode"
      }),
      // status: getSelectField({
      //   label: {
      //     labelName: "Status",
      //     labelKey: "ABG_STATUS_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Enter Status",
      //     labelKey: "ABG_STATUS_PLACEHOLDER"
      //   },
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   },
      //   data : [
      //     {
      //       code: "ACTIVE",
      //       label: "BILL_GENIE_ACTIVE_LABEL"
      //     },
      //     {
      //       code: "INACTIVE",
      //       label: "BILL_GENIE_PAID_LABEL"
      //     },
      //     {
      //       code: "PAID",
      //       label: "BILL_GENIE_INACTIVE_LABEL"
      //     }
      //   ],
      //   required: false,
      //   jsonPath: "searchCriteria.status"
      // })
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
      textAlign: "right",
      display: "flex",
      justifyContent : "flex-end"
    }
  },
  children: {
    mergeButton: {
      uiFramework: "custom-molecules",
      componentPath: "DownloadPrintButton",
      visible: false,
      props: {
        data: {
          label: { labelName: "MERGE & DOWNLOAD", labelKey: "ABG_GROUP_BILLS_MERGE_AND_DOWNLOAD_BUTTON" },
          rightIcon: "arrow_drop_down",
          props: { 
            variant: "outlined", 
            style: { 
              height: "60px", 
              backgroundColor: "#FE7A51",
              color: "#ffffff", 
              // marginRight: 10,
              // width: "368px"
              // width: "329px",
              minWidth: "260px",
              maxWidth: "415px",
              width: "100%",
              menuListStyle: {
                minWidth: "260px",
                maxWidth: "415px",
                width: "92%",
                zIndex:100
              }
            } },
          menu: []
        }
      }
    },
    // mergeButton: {
    //   componentPath: "Button",
    //   visible: false,
    //   props: {
    //     variant: "contained",
    //     color: "primary",
    //     style: {
    //       color: "white",
    //       borderRadius: "2px",
    //       width: "250px",
    //       height: "48px"
    //     }
    //   },
    //   children: {
    //     buttonLabel: getLabel({
    //       labelName: "MERGE & DOWNLOAD",
    //       labelKey: "ABG_GROUP_BILLS_MERGE_AND_DOWNLOAD_BUTTON"
    //     })
    //   },
    //   onClickDefination: {
    //     action: "condition",
    //     callBack: generateMultipleBill
    //   },
    //   visible: false
    // }
  }
};
