import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectEmployeeCorrespondenceAddress = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const inputs = [
    {
      label: "HR_CORRESPONDENCE_ADDRESS_LABEL",
      type: "text",
      name: "correspondenceAddress",
      validation: {
        pattern: Digit.Utils.getPattern('Address'),
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
      {inputs?.map((input, index) => {
        let currentValue=formData && formData[config.key] && formData[config.key][input.name]||'';
        return(<React.Fragment key={index}>
          {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field">
              <TextInput
                key={input.name}
                value={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                onChange={(e) => setValue(e.target.value, input.name)}
                disable={false}
                defaultValue={undefined}
                {...input.validation}
              />
               {currentValue&&currentValue.length>0&&!currentValue.match(Digit.Utils.getPattern('Address'))&&<CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px'}}>{t("CORE_COMMON_APPLICANT_ADDRESS_INVALID")}</CardLabelError>}
            </div>
          </LabelFieldPair>
        </React.Fragment>
      )})}
    </div>
  );
};

export default SelectEmployeeCorrespondenceAddress;
