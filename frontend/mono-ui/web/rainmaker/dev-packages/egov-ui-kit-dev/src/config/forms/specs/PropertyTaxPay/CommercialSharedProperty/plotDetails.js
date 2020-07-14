import { annualRent, subUsageType, measuringUnit, occupancy, beforeInitFormForPlot, superArea } from "../utils/reusableFields";
import { MDMS } from "egov-ui-kit/utils/endPoints";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";

const formConfig = {
  name: "plotDetails",
  fields: {
    usageType: {
      id: "assessment-usageType",
      jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryMinor",
      type: "textfield",
      floatingLabelText: "PT_FORM2_USAGE_TYPE",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      value: "PROPERTYTAX_BILLING_SLAB_COMMERCIAL",
      // value: "Commercial",
      required: true,
      disabled: true,
      numcols: 4,
      formName: "plotDetails",
    },
    ...subUsageType,
    ...occupancy,
    ...superArea,
    ...measuringUnit,
    ...annualRent,
  },
  isFormValid: false,
  ...beforeInitFormForPlot,
};

export default formConfig;
