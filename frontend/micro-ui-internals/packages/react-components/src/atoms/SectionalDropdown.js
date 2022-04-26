import React, { useEffect, useState } from "react";
import { ArrowDown } from "./svgindex";

const TextField = (props) => {
  const [value, setValue] = useState(props.selectedVal ? props.selectedVal : "");

  useEffect(() => {
    props.selectedVal ? setValue(props.selectedVal) : null;
  }, [props.selectedVal]);

  function inputChange(e) {
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }

  return <input type="text" value={value} onChange={inputChange} onClick={props.onClick} />;
};

const SectionalDropdown = (props) => {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.selected ? props.selected : null);
  const [filterVal, setFilterVal] = useState("");

  useEffect(() => {
    setSelectedOption(props.selected);
  }, [props.selected]);

  function dropdownSwitch() {
    var current = dropdownStatus;
    setDropdownStatus(!current);
  }

  function dropdownOn() {
    setDropdownStatus(true);
  }

  function onSelect(selectedOption) {
    props.select(selectedOption);
    setSelectedOption(selectedOption);
    setDropdownStatus(false);
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  return (
    <div className="sect-dropdown-wrap" style={{ ...props.style }}>
      <div className="sect-dropdown-input-wrap">
        <TextField
          setFilter={setFilter}
          selectedVal={
            selectedOption
              ? props.t
                ? props.t(props.displayKey ? selectedOption[props.displayKey] : selectedOption)
                : props.displayKey
                ? selectedOption[props.displayKey]
                : selectedOption
              : null
          }
          filterVal={filterVal}
          onClick={dropdownOn}
        />
        <ArrowDown onClick={dropdownSwitch} />
      </div>
      {dropdownStatus ? (
        <div className="sect-dropdown-card">
          {props.menuData
            .filter((subMenu) => subMenu.options.filter((option) => option[props.displayKey].toUpperCase().includes(filterVal.toUpperCase())))
            .map((subMenu, index) => {
              return (
                <React.Fragment key={index}>
                  <h1>{subMenu.heading}</h1>
                  {subMenu.options.map((option, index) => {
                    return (
                      <p key={index} onClick={() => onSelect(option)}>
                        {props.t ? props.t(option[props.displayKey]) : option[props.displayKey]}
                      </p>
                    );
                  })}
                </React.Fragment>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default SectionalDropdown;
