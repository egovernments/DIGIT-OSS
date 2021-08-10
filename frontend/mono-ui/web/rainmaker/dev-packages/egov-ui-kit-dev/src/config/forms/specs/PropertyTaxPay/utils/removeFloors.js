import { removeForm } from "egov-ui-kit/redux/form/actions";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import get from "lodash/get";

export const removeFormKey = (formKey, field, dispatch, state) => {
  let { form } = state;
  const floorCards =
    form &&
    Object.keys(form).filter((key, index) => {
      if (key.includes("customSelect") || key.includes("floorDetails")) {
        return key;
      }
    });
    const updateFloorCount=()=>{
      dispatch(setFieldProperty("plotDetails", "subUsageType", "value", null));
      dispatch(setFieldProperty("plotDetails", "occupancy", "value", null));
      dispatch(setFieldProperty("plotDetails", "annualRent", "hideField", true));
      const updateFloorValue=()=>{
        dispatch(setFieldProperty("plotDetails", "floorCount", "value", 1));
        dispatch(prepareFormData("Properties[0].propertyDetails[0].noOfFloors",1));
      }
      if (field.id==="typeOfBuilding" && get(state,"common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor")!=="RESIDENTIAL") {
        updateFloorValue();
      }
      else if(field.id==="typeOfUsage" && get(state,"common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor")!=="RESIDENTIAL") {
        updateFloorValue();
      }
    }

    if (field.id==="typeOfBuilding" && field.value==="SHAREDPROPERTY") {
      updateFloorCount();
    }

    else if(field.id==="typeOfUsage" && get(state,"common.prepareFormData.Properties[0].propertyDetails[0].propertySubType")==="SHAREDPROPERTY") {
      updateFloorCount();
    }

  if (floorCards.length > 0) {
    if (window.confirm("Are you sure you want delete the floors entered?")) {
      if (formKey === "basicInformation") {
        dispatch(setFieldProperty("plotDetails", "floorCount", "value", 0));
      }

      floorCards.forEach((floorFormKey,key) => {
            floorFormKey && dispatch(removeForm(floorFormKey));
      });


    }
  }
};
