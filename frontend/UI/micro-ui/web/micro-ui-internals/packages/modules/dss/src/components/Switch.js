import React, { useContext ,Fragment} from "react";
import FilterContext from "./FilterContext";

const denominations = ["Cr", "Lac", "Unit"];

const Switch = ({ onSelect, t }) => {
  const { value } = useContext(FilterContext);
  return (
    <>
      <div className="mbsm">{t(`ES_DSS_DENOMINATION`)}</div>
      <div className="switch-wrapper">
        {denominations.map((label, idx) => (
          <div key={idx}>
            <input
              type="radio"
              id={label}
              className="radio-switch"
              name="unit"
              checked={label === value?.denomination}
              onClick={() => onSelect({ denomination: label })}
            />
            <label className="cursorPointer" htmlFor={label}>{t(Digit.Utils.locale.getTransformedLocale(`ES_DSS_${label}`))}</label>
          </div>
        ))}
      </div>
    </>
  );
};

export default Switch;
