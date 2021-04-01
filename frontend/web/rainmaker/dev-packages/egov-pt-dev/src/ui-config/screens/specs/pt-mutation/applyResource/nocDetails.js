import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults
} from "../../../../../ui-utils/commons";

const loadProvisionalNocData = async (state, dispatch) => {
  let fireNOCNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].provisionFireNOCNumber",
    ""
  );


  if (!fireNOCNumber.match(getPattern("FireNOCNo"))) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Incorrect FireNOC Number!",
          labelKey: "ERR_FIRENOC_NUMBER_INCORRECT"
        },
        "error"
      )
    );
    return;
  }

  let response = await getSearchResults([
    { key: "fireNOCNumber", value: fireNOCNumber }
  ]);

  response = furnishNocResponse(response);

  dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));

  // Set no of buildings radiobutton and eventually the cards
  let noOfBuildings =
    get(response, "FireNOCs[0].fireNOCDetails.noOfBuildings", "SINGLE") ===
    "MULTIPLE"
      ? "MULTIPLE"
      : "SINGLE";
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingRadioGroup",
      "props.value",
      noOfBuildings
    )
  );

  // Set noc type radiobutton to NEW
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocRadioGroup",
      "props.value",
      "NEW"
    )
  );

  // Set provisional fire noc number
  dispatch(
    prepareFinalObject(
      "FireNOCs[0].provisionFireNOCNumber",
      get(response, "FireNOCs[0].fireNOCNumber", "")
    )
  );

  // Set fire noc id to null
  dispatch(prepareFinalObject("FireNOCs[0].id", undefined));
};

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "NOC Details",
      labelKey: "NOC_NEW_NOC_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
    nocRadioGroup: {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 12
      },
      jsonPath: "FireNOCs[0].fireNOCDetails.fireNOCType",
      type: "array",
      props: {
        required: true,
        label: { name: "NOC Type", key: "NOC_TYPE_LABEL" },
        buttons: [
          {
            labelName: "New",
            labelKey: "NOC_TYPE_NEW_RADIOBUTTON",
            value: "NEW"
          },
          {
            label: "Provisional",
            labelKey: "NOC_TYPE_PROVISIONAL_RADIOBUTTON",
            value: "PROVISIONAL"
          }
        ],
        jsonPath: "FireNOCs[0].fireNOCDetails.fireNOCType",
        defaultValue: "PROVISIONAL"
      },
      type: "array",
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "PROVISIONAL") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber",
              "props.style",
              { visibility: "hidden" }
            )
          );
        } else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber",
              "props.style",
              {}
            )
          );
        }
      }
    },
    provisionalNocNumber: {
      ...getTextField({
        label: {
          labelName: "Provisional fire NoC number",
          labelKey: "NOC_PROVISIONAL_FIRE_NOC_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Provisional fire NoC number",
          labelKey: "NOC_PROVISIONAL_FIRE_NOC_NO_PLACEHOLDER"
        },
        pattern: getPattern("FireNOCNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        // required: true,
        // pattern: getPattern("MobileNo"),
        jsonPath: "FireNOCs[0].provisionFireNOCNumber",
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch, fieldInfo) => {
              loadProvisionalNocData(state, dispatch);
            }
          }
        }
        // title: {
        //   value: "Please search owner profile linked to the mobile no.",
        //   key: "TL_MOBILE_NO_TOOLTIP_MESSAGE"
        // },
        // infoIcon: "info_circle"
      })
    }
  })
});
