import {
    getCommonContainer,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { showHideAdhocPopup} from "../utils";
  import get from "lodash/get";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import "./index.css";
 
  const resetFields = (state, dispatch) => {
    showHideAdhocPopup(state,dispatch,"search");
    // dispatch(
    //   handleField(
    //     "propertySearch",
    //     "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
    //     "props.value",
    //     ""
    //   )
    // );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
        "props.value",
        ""
      )
    );
  };
  
  const assessProperty =(state,dispatch)=>{
      const selectedYear=get(state.screenConfiguration.preparedFinalObject,"ReceiptTemp[0].financialYear");
      if(!selectedYear){
        alert("Please Select a Financial Year");
    }
    else{
        dispatch(setRoute(`/property-tax/assessment-form?FY=${selectedYear}&type=new`));
    }
  }


  export const financialYearPopup = getCommonContainer({

    yearDetailsContainer: getCommonContainer({
      yearRadioGroup: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        jsonPath: "ReceiptTemp[0].financialYear",
        type: "array",
        props: {
          required: true,
          label: { name: "Select Financial Year", key: "SELECT_FINANCIAL_YEAR"}, 
          buttons: [
            {
              labelName: "2019-20",
              labelKey: "YEAR_2019_20",
              value: "2019-20"
            },
            {
                labelName: "2018-19",
                labelKey: "YEAR_2018_19",
                value: "2018-19"
              },
              {
                labelName: "2017-18",
                labelKey: "YEAR_2017_18",
                value: "2017-18"
              },
              {
                labelName: "2016-17",
                labelKey: "YEAR_2016_17",
                value: "2016-17"
              },
              {
                labelName: "2015-16",
                labelKey: "YEAR_2015_16",
                value: "2015-16"
              },
          ],
          jsonPath: "ReceiptTemp[0].financialYear",
        },
        

        beforeFieldChange: (action, state, dispatch) => {
        }
      },
      button: getCommonContainer({
        buttonContainer: getCommonContainer({
          resetButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 6
              // align: "center"
            },
            props: {
              variant: "text",
              style: {
                color: "#FE7A51",
                border: "1px solid rgb(255, 255, 255)",
              //  borderColor: "#FE7A51",
              //  width: "50px",
              //  height: "48px",
              //  margin: "8px",
              //  float: "right"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Cancel",
                labelKey: "PT_CANCEL_BUTTON"
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
              sm: 6
              // align: "center"
            },
            props: {
              variant: "text",
              style: {
                // color: "white",
               // margin: "8px",
               border: "1px solid rgb(255, 255, 255)",
                backgroundColor: "#FFF",
                color: "#FE7A51",
               // borderRadius: "2px",
               // width: "50px",
               // height: "48px"
               //float:"right"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Ok",
                labelKey: "PT_OK_BUTTON"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: assessProperty
            }
          }
        })
      }),
    }),
  });
  