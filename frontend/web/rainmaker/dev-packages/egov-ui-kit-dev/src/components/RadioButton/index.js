import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";

const selectedIconStyle = {
  fill: "fe7a51",
};

const RadioButtonUi = ({
  options,
  valueSelected,
  className,
  name,
  defaultValue,
  style = {},
  radioButtonItemStyle = {},
  labelItemStyle = {},
  labelStyle = {},
  selectedStyle = {},
  handleChange,
  checkedIcon,
  iconStyle,
  selectedLabelStyle,
  id,
  disabled,
  showFloatingLabelText = false,
  floatingLabelText
}) => {
  const renderRadioButtons = () => {
    return options.map((option, index) => {
      const { value, label } = option;
      return (
        <RadioButton
          key={index}
          id={id + "-" + index}
          style={value === valueSelected ? { ...radioButtonItemStyle, ...selectedStyle } : radioButtonItemStyle}
          value={value}
          label={label}
          labelStyle={value === valueSelected ? { ...labelStyle, ...selectedLabelStyle } : labelStyle}
          iconStyle={value === valueSelected ? { ...iconStyle, ...selectedIconStyle } : iconStyle}
          checkedIcon={checkedIcon}
          disabled={disabled}
        />
      );
    });
  };

  const styles = {
    labelStyle: {
      font: "12px",
      letterSpacing: 0.6,
      marginBottom: 5,
      marginTop: 14,
    },

  }

  const getRadioComponent = () => {
    if (showFloatingLabelText) {
      return <div>
        <Label label={floatingLabelText} fontSize={12} labelStyle={styles.labelStyle} bold={true} />

        <RadioButtonGroup
          valueSelected={valueSelected}
          name={name}
          className={`${className} RadioComp`}
          onChange={handleChange}
          defaultSelected={defaultValue}
          style={style}
        >
          {renderRadioButtons()}
        </RadioButtonGroup>
      </div>

    } else {
      return (<RadioButtonGroup
        valueSelected={valueSelected}
        name={name}
        className={`${className} RadioComp`}
        onChange={handleChange}
        defaultSelected={defaultValue}
        style={style}
      >
        {renderRadioButtons()}
      </RadioButtonGroup>)
    }
  }

  return (
    <div>
      {getRadioComponent()}
    </div>
  );
};

export default RadioButtonUi;
