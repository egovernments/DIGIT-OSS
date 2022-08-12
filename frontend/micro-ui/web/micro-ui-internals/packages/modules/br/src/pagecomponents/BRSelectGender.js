import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, RadioButtons } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const BRSelectGender = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();

  const inputs = [
    {
      label: "Gender",
      type: "text",
      name: "gender",
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
              <RadioButtons
                style={{ display: "flex", justifyContent: "space-between" }}
                options={[
                  {
                    code: "MALE",
                    name: "MALE",
                  },
                  {
                    code: "FEMALE",
                    name: "FEMALE",
                  },
                  {
                    code: "TRANSGENDER",
                    name: "TRANSGENDER",
                  },
                ]}
                // options={HRMenu}
                key={input.name}
                optionsKey="name"
                selectedOption={formData && formData[config.key] ? formData[config.key][input.name] : null}
                onSelect={(e) => setValue(e, input.name)}
                disable={false}
                defaultValue={undefined}
                t={t}
                {...input.validation}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BRSelectGender;
