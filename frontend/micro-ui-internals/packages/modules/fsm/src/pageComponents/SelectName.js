import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectName = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  // console.log("find errors here", errors)
  const editScreen = url.includes("/modify-application/");
  const inputs = [
    {
      label: "ES_NEW_APPLICATION_APPLICANT_NAME",
      type: "text",
      name: "applicantName",
      validation: {
        isRequired: true,
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: true,
    },
    {
      label: "ES_NEW_APPLICATION_APPLICANT_MOBILE_NO",
      type: "text",
      name: "mobileNumber",
      validation: {
        isRequired: true,
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
      },
      isMandatory: true,
    },
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
    console.log("find value here", value, input, formData);
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
              <TextInput
                key={input.name}
                value={formData && formData[config.key] ? formData[config.key][input.name] : null}
                onChange={(e) => setValue(e.target.value, input.name)}
                disable={editScreen}
                {...input.validation}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectName;
