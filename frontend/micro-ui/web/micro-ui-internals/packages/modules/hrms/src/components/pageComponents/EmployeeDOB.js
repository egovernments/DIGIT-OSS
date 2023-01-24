import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, DatePicker } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { convertEpochToDate } from "../Utils/index";

const SelectDateofBirthEmployment = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const inputs = [
    {
      label: "HR_BIRTH_DATE_LABEL",
      type: "date",
      name: "dob",
      validation: {
        isRequired: true,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: true,
    },
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }
  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field">
              <DatePicker
                key={input.name}
                date={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                onChange={(e) => setValue(e, input.name)}
                disable={false}
                max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                defaultValue={undefined}
                {...input.validation}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectDateofBirthEmployment;
