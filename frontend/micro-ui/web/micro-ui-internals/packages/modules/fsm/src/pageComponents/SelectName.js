import React, { useEffect, useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, Dropdown } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectName = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const stateId = Digit.ULBService.getStateId();
  const { data: GenderData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "common-masters", "FSMGenderType");
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const [dropdownValue, setDropdownValue] = useState("");
  const [genderTypes, setGenderTypes] = useState([]);
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
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      isMandatory: true,
    },
    {
      label: "COMMON_APPLICANT_GENDER",
      type: "dropdown",
      name: "applicantGender",
      options: genderTypes,
      isMandatory: false,
    },
  ];

  useEffect(() => {
    if (!isLoading && GenderData) {
      setGenderTypes(GenderData);
    }
  }, [GenderData]);

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }

  function selectDropdown(value) {
    setDropdownValue(value);
    onSelect(config.key, { ...formData[config.key], applicantGender: value.code });
  }

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {input.type === "text" && (
            <React.Fragment>
              {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">
                  {t(input.label)}
                  {input.isMandatory ? " * " : null}
                </CardLabel>
                <div className="field" style={{display:"flex"}}>
                  {input.componentInFront ? input.componentInFront : null}
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
          )}
          {input.type === "dropdown" && (
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t(input.label)}
                {input.isMandatory ? " * " : null}
              </CardLabel>
              <div className="field">
                <Dropdown
                  option={input.options}
                  optionKey="i18nKey"
                  id="dropdown"
                  selected={formData && formData[config.key] ? input.options.find((data) => data.code === formData[config.key][input.name]) : null}
                  select={selectDropdown}
                  t={t}
                  disable={editScreen}
                  autoFocus={!editScreen}
                />
              </div>
            </LabelFieldPair>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectName;
