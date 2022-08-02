import { CloseSvg } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";

const MultipleChoice = ({ t, options = checkboxlist, updateOption, addOption, removeOption,createNewSurvey,isPartiallyEnabled,formDisabled }) => {
  return (
    <div className="options_checkboxes">
      {options.map((title, index) => (
        <RadioButtonOption key={index} index={index} title={title} updateOption={updateOption} removeOption={removeOption} />
      ))}
      <div>
        <button className="unstyled-button link" type="button" disabled={!createNewSurvey && formDisabled} onClick={() => addOption()}>
          {t("CS_COMMON_ADD_OPTION")}
        </button>
      </div>
    </div>
  );
};

export default MultipleChoice;

const RadioButtonOption = ({ index, title, updateOption, removeOption }) => {
  const [optionTitle, setOptionTitle] = useState(title);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
      updateOption({ value: optionTitle, id: index });
  }, [optionTitle]);

  return (
    <div className="optionradiobtnwrapper">
      <input type="radio" className="customradiobutton" />
      <input
        type="text"
        value={optionTitle}
        onChange={(ev) => setOptionTitle(ev.target.value)}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        className={isFocused ? "simple_editable-input" : "simple_readonly-input"}
      />
      <div className="pointer" onClick={() => removeOption(index)}>
        <CloseSvg />
      </div>
    </div>
  );
};
