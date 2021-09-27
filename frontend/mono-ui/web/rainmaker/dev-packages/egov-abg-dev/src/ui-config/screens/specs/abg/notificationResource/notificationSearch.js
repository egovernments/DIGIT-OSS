import {
    getCommonCard,
    getTextField,
    getSelectField,
    getCommonContainer,
    getPattern,
    getLabel,
    getDateField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { searchApiCall } from "./functions";
  
    
  export const NotificationSearchCard = getCommonCard({
    searchContainer: getCommonContainer({
      usage: getSelectField({
        label: {
          labelName: "usage",
          labelKey: "ABG_USAGE_LABEL"
        },
        placeholder: {
          labelName: "Select Usage",
          labelKey: "ABG_USAGE_PLACEHOLDER"
        },
        required: true,
        visible: true,
        jsonPath: "searchScreen.usage",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        data: [
          {
            code: "Usage-1"
          },
          {
            code: "Usage-2"
          }
        ]
      }),
      locMohalla: getSelectField({
        label: {
          labelName: "Locality/Mohalla",
          labelKey: "ABG_LOCALITY/MOHALLA_LABEL"
        },
        placeholder: {
          labelName: "Select Locality/Mohalla",
          labelKey: "ABG_LOCALITY/MOHALLA_PLACEHOLDER"
        },
        required: true,
        jsonPath: "searchScreen.locMohalla",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        data: [
          {
            code: "Gandhi Nagar"
          },
          {
            code: "Kormangala road-1"
          }
        ]
      }),
      billAmount: getTextField({
        label: {
          labelName: "Bill Amount",
          labelKey: "ABG_BILL_AMOUNT_LABEL"
        },
        placeholder: {
          labelName: "Enter Bill Amount",
          labelKey: "ABG_BILL_AMOUNT_PLACEHOLDER"
        },
        required: true,
        jsonPath: "searchScreen.billAmount",
        gridDefination: {
          xs: 12,
          sm: 4
        
        },
      }),

      propertyUid: getSelectField({
        label: {
          labelName: "Property UID",
          labelKey: "ABG_PROPERTY_UID_LABEL"
        },
        placeholder: {
          labelName: "Select Property UID ",
          labelKey: "ABG_PROPERTY_UID_PLACEHOLDER"
        },
        required: true,
        jsonPath: "searchScreen.propertyUid",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        data: [
          {
            code: "12345"
          },
          {
            code: "132434"
          }
        ]
      }),

      date: getDateField({
        label: {
          labelName: "Date",
          labelKey: "ABG_DATE_LABEL"
        },
        placeholder: {
          labelName: "Select Date",
          labelKey: "ABG_DATE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "searchScreen.date"
      }),
    }),
  
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
        firstCont: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 4
          }
        },
        searchButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 4
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
              labelName: "SEND NOTIFICATION",
              labelKey: "ABG_NOTIFICATION_BUTTON"
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
            sm: 4
          }
        }
      })
    })
  });
  
 
  