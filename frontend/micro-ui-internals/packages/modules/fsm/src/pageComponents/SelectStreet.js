import React from "react";
import { FormStep, TextInput, LabelFieldPair, CardLabel } from "@egovernments/digit-ui-react-components";

const SelectStreet = ({ t, config, onSelect, userType, formData }) => {
  const onSkip = () => onSelect();
  const onChange = (e) => {
    const value = e?.target?.value;
    const key = e?.target?.id;
    onSelect(config.key, { ...formData[config.key], [key]: value });
  };
  const inputs = [
    {
      label: "CS_FILE_APPLICATION_PROPERTY_LOCATION_STREET_NAME_LABEL",
      type: "text",
      name: "street",
      validation: {
        pattern: "[a-zA-Z0-9 ]{1,255}",
        maxlength: 256,
        title: t("CORE_COMMON_STREET_INVALID"),
      },
    },
    {
      label: "CS_FILE_APPLICATION_PROPERTY_LOCATION_DOOR_NO_LABEL",
      type: "text",
      name: "doorNo",
      validation: {
        pattern: "([A-z0-9À-ž@#$&()\\-`.+,/s ]){1,63}",
        maxlength: 256,
        title: t("CORE_COMMON_DOOR_INVALID"),
      },
    },
  ];
  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">
            {t(input.label)}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <div className="field">
            <TextInput
              id={input.name}
              key={input.name}
              value={formData && formData.address ? formData.address[input.name] : null}
              onChange={onChange}
              {...input.validation}
            />
          </div>
        </LabelFieldPair>
      );
    });
  }
  return (
    <FormStep
      config={{ ...config, inputs }}
      _defaultValues={{ street: formData?.address.street, doorNo: formData?.address.doorNo }}
      onSelect={(data) => onSelect(config.key, data)}
      onSkip={onSkip}
      t={t}
    />
  );
};

export default SelectStreet;
