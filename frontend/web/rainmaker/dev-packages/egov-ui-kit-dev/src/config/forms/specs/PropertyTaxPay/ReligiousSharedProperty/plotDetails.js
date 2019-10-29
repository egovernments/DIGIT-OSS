import { MDMS } from "egov-ui-kit/utils/endPoints";
import { subUsageType, occupancy, measuringUnit, beforeInitFormForPlot, superArea } from "../utils/reusableFields";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";

const formConfig = {
  name: "plotDetails",
  fields: {
    usageType: {
      id: "assessment-usageType",
      jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryMinor",
      type: "textfield",
      floatingLabelText: "PT_FORM2_USAGE_TYPE",
      // value: "Religious",
      value: "PROPERTYTAX_BILLING_SLAB_RELIGIOUS",
      required: true,
      disabled: true,
      numcols: 4,
    },
    ...subUsageType,
    ...occupancy,
    ...superArea,
    ...measuringUnit,
    // ...annualRent,
  },
  isFormValid: false,
  ...beforeInitFormForPlot,
};

export default formConfig;
