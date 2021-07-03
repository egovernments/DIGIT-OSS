import React from "react";
import Label from "egov-ui-kit/utils/translationNode";

const formConfig = {
  name: "additionalRebate",
  fields: {
    adhocPenalty: {
      id: "adhocPenalty",
      type: "number",
      floatingLabelText: "PT_ADDITIONAL_CHARGES",
      hintText: "PT_ENTER_AMOUNT",
      required: false,
      fullWidth: true,
      jsonPath: "Properties[0].propertyDetails[0].adhocPenalty",
    },
    adhocPenaltyReason: {
      id: "adhocPenaltyReason",
      type: "singleValueList",
      dropDownData: [
        { label: <Label label="PT_PENDING_DUES_FROM_EARLIER" />, value: "Pending dues from earlier" },
        { label: <Label label="PT_MISCALCULATION_DUES" />, value: "Miscalculation of earlier assessment" },
        { label: <Label label="PT_ONE_TIME_PENALTY" />, value: "One time Penalty" },
        { label: <Label label="PROPERTYTAX_BILLING_SLAB_OTHERS" />, value: "Others" },
      ],
      floatingLabelText: "PT_REASON_FOR_CHARGES",
      hintText: "ES_CREATECOMPLAINT_SELECT_PLACEHOLDER",
      required: false,
      fullWidth: true,
      jsonPath: "Properties[0].propertyDetails[0].adhocPenaltyReason",
    },
    adhocExemption: {
      id: "adhocExemption",
      type: "number",
      floatingLabelText: "PT_ADDITIONAL_REBATE",
      hintText: "PT_ENTER_AMOUNT",
      required: false,
      fullWidth: true,
      jsonPath: "Properties[0].propertyDetails[0].adhocExemption",
    },
    adhocExemptionReason: {
      id: "adhocExemptionReason",
      type: "singleValueList",
      floatingLabelText: "PT_REASON_FOR_REBATE",
      hintText: "ES_CREATECOMPLAINT_SELECT_PLACEHOLDER",
      dropDownData: [
        { label: <Label label="PT_REBATE_OPTION1" />, value: "Advanced paid by citizen earlier" },
        { label: <Label label="PT_REBATE_OPTION2" />, value: "Rebate provided by commissioner/EO" },
        { label: <Label label="PT_REBATE_OPTION3" />, value: "Additional amount charged from the citizen" },
        { label: <Label label="PROPERTYTAX_BILLING_SLAB_OTHERS" />, value: "Others" },
      ],
      required: false,
      fullWidth: true,
      jsonPath: "Properties[0].propertyDetails[0].adhocExemptionReason",
    },
    otherExemptionReason: {
      id: "adhocExemption",
      type: "textField",
      floatingLabelText: "PT_DESCRIPTION_FLOATING_LABEL",
      hintText: "PT_DESCRIPTION_HINT_TEXT",
      required: false,
      fullWidth: true,
      jsonPath: "Properties[0].propertyDetails[0].adhocExemptionReason",
    },
    otherPenaltyReason: {
      id: "adhocExemption",
      type: "textField",
      floatingLabelText: "PT_DESCRIPTION_FLOATING_LABEL",
      hintText: "PT_DESCRIPTION_HINT_TEXT",
      required: false,
      fullWidth: true,
      jsonPath: "Properties[0].propertyDetails[0].adhocPenaltyReason",
    },
  },
  action: "",
  saveUrl: "",
  redirectionRoute: "",
};

export default formConfig;
