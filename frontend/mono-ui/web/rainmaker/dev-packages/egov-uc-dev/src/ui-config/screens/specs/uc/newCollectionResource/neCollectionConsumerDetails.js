import {
    getCommonCard,
    getTextField,
    
    getCommonContainer,
    getPattern,
   
    getCommonTitle,
  } from "egov-ui-framework/ui-config/screens/specs/utils";

 

  export const newCollectionConsumerDetailsCard = getCommonCard(
      {
        header: getCommonTitle(
            {
              labelName: "Consumer Details",
              labelKey: "CONSUMERDETAILS"
            },
            {
              style: {
                marginBottom: 18
              }
            }
          ),
        ucConsumerContainer : getCommonContainer({
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
               // errorMessage: "Invalid Name.",
                jsonPath: "Challan[0].citizen.name"
              }),
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
                errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
                jsonPath: "Challan[0].citizen.mobileNumber"
              }),
              ConsumerHouseNo: getTextField({
                label: {
                  labelName: "Door/House No.",
                  labelKey: "UC_DOOR_NO_LABEL"
                },
                placeholder: {
                  labelName: "Enter Door/House No.",
                  labelKey: "UC_DOOR_NO_PLACEHOLDER"
                },
                pattern: getPattern("DoorHouseNo"),
                jsonPath: "Challan[0].address.doorNo"
              }),
              ConsumerBuilidingName: getTextField({
                label: {
                  labelName: "Building/Colony Name",
                  labelKey: "UC_BLDG_NAME_LABEL"
                },
                placeholder: {
                  labelName: "Enter Building/Colony Name",
                  labelKey: "UC_BLDG_NAME_PLACEHOLDER"
                },
                pattern: getPattern("BuildingStreet"),
                jsonPath: "Challan[0].address.buildingName"
              }),
              ConsumerStreetName: getTextField({
                label: {
                  labelName: "Street Name",
                  labelKey: "UC_SRT_NAME_LABEL"
                },
                placeholder: {
                  labelName: "Enter Street Name",
                  labelKey: "UC_SRT_NAME_PLACEHOLDER"
                },
                pattern: getPattern("BuildingStreet"),
                jsonPath: "Challan[0].address.street"
              }),         

              ConsumerLocMohalla: {
                uiFramework: "custom-containers",
                componentPath: "AutosuggestContainer",
                jsonPath: "Challan[0].address.locality.code",
                required: true,
                props: {
                  style: {
                    width: "100%",
                    cursor: "pointer"
                  },
                  className :"autocomplete-dropdown",
                  hasZindex:true,
                  label: {
                    labelName: "Mohalla",
                    labelKey: "UC_MOHALLA_LABEL"
                  },
                  placeholder: {
                    labelName: "Select Mohalla",
                    labelKey: "UC_MOHALLA_PLACEHOLDER"
                  },
                  jsonPath: "Challan[0].address.locality.code",
                  sourceJsonPath: "applyScreenMdmsData.tenant.localities",
                  labelsFromLocalisation: true,
                  suggestions: [],
                  fullwidth: true,
                  required: true,
                  inputLabelProps: {
                    shrink: true
                  }                 
                },              
                gridDefination: {
                  xs: 12,
                  sm: 6
                }
              },  
              ConsumerPinCode: getTextField({
                label: {
                  labelName: "Pincode",
                  labelKey: "UC_PINCODE_LABEL"
                },
                placeholder: {
                  labelName: "Enter Pincode",
                  labelKey: "UC_PINCODE_PLACEHOLDER"
                },
                pattern: getPattern("Pincode"),
                jsonPath: "Challan[0].address.pincode"
              }),              
        },        
        ) 
      },
      {
        style: {
          overflow: "visible"
        }
      }
  )