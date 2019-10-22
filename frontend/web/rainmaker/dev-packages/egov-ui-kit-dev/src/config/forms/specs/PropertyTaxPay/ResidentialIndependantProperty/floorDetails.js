import { MDMS } from "egov-ui-kit/utils/endPoints";
import { subUsageType, occupancy,innerDimensions, roomArea,balconyArea,garageArea,bathroomArea,coveredArea,builtArea, beforeInitForm, annualRent } from "../utils/reusableFields";
const formConfig = {
  name: "floorDetails",
  fields: {
    usageType: {
      id: "assessment-usageType",
      jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryMinor",
      type: "textfield",
      floatingLabelText: "PT_FORM2_USAGE_TYPE",
      // value: "Residential",
      value: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL",
      required: true,
      numcols: 4,
      disabled: true,
    },
    ...subUsageType,
    ...occupancy,
    ...innerDimensions,
    ...roomArea,
    ...balconyArea,
    ...garageArea,
    ...bathroomArea,
    ...coveredArea,
    ...builtArea,
    ...annualRent,
  },
  isFormValid: false,
  ...beforeInitForm,
};

export default formConfig;
