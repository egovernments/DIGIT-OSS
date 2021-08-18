import React from "react";
import { RadioButtons } from "@egovernments/digit-ui-react-components";

export const configPTAssessProperty = ({ t, action, financialYears, selectedFinancialYear, setSelectedFinancialYear }) => {
  return {
    label: {
      heading: `ES_PT_ACTION_TITLE_${action}`,
      submit: `ES_PT_COMMON_${action}`,
      cancel: "ES_PT_COMMON_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: t("ES_PT_FINANCIAL_YEARS"),
            isMandatory: true,
            type: "radio",
            populators: (
              <RadioButtons options={financialYears} optionsKey="name" onSelect={setSelectedFinancialYear} selectedOption={selectedFinancialYear} />
            ),
          },
        ],
      },
    ],
  };
};
