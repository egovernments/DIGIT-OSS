import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowDown } from "./svgindex";

const TextField = (props) => {
  const [value, setValue] = useState(props.selectedVal ? props.selectedVal : "");

  useEffect(() => {
    props.selectedVal ? setValue(props.selectedVal) : setValue("");
  }, [props.selectedVal]);

  function inputChange(e) {
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }

  function broadcastToOpen() {
    props.dropdownDisplay(true);
  }

  function broadcastToClose() {
    props.dropdownDisplay(false);
  }

  return <input type="text" value={value} onChange={inputChange} onClick={props.onClick} onFocus={broadcastToOpen} onBlur={broadcastToClose} />;
};

const Dropdown = (props) => {
  const user_type = Digit.SessionStorage.get("userType");
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.selected ? props.selected : null);
  const [filterVal, setFilterVal] = useState("");

  console.log("%c 🏎️: props in dropdown ", "font-size:16px;background-color:#c239cc;color:white;", props.selected);

  useEffect(() => {
    setSelectedOption(props.selected);
  }, [props.selected]);

  function dropdownSwitch() {
    var current = dropdownStatus;
    setDropdownStatus(!current);
  }

  function dropdownOn(val) {
    const waitForOptions = () => setTimeout(() => setDropdownStatus(val), 200);

    const timerId = waitForOptions();

    return () => {
      clearTimeout(timerId);
    };
  }

  function onSelect(val) {
    //console.log(val, "curent", selectedOption, "old");
    if (val !== selectedOption) {
      // console.log(val,"is selected");
      props.select(val);
      setSelectedOption(val);
      setDropdownStatus(false);
    }
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  return (
    <div className={user_type === "employee" ? "employee-select-wrap" : "select-wrap"} style={{ ...props.style }}>
      {/* <div className={userType === "employee" ? "select-wrap-emp" : "select-wrap"} style={{ ...props.style }}> */}
      <div className={dropdownStatus ? "select-active" : "select"}>
        <TextField
          setFilter={setFilter}
          selectedVal={
            selectedOption
              ? props.t
                ? props.t(props.optionKey ? selectedOption[props.optionKey] : selectedOption)
                : props.optionKey
                ? selectedOption[props.optionKey]
                : selectedOption
              : null
          }
          filterVal={filterVal}
          // onClick={dropdownOn}
          dropdownDisplay={dropdownOn}
        />
        <ArrowDown onClick={dropdownSwitch} />
      </div>
      {console.log("dropdownStatus::::::::::::::>", dropdownStatus)}
      {dropdownStatus ? (
        props.optionKey ? (
          <div className="options-card">
            {props.option &&
              props.option
                .filter((option) => option[props.optionKey].toUpperCase().includes(filterVal.toUpperCase()))
                .map((option, index) => {
                  if (props.t) {
                    // console.log(props.t(option[props.optionKey]));
                  }
                  return (
                    <p key={index} onClick={() => onSelect(option)}>
                      {props.t ? props.t(option[props.optionKey]) : option[props.optionKey]}
                    </p>
                  );
                })}
          </div>
        ) : (
          <div className="options-card">
            {props.option
              .filter((option) => option.toUpperCase().includes(filterVal.toUpperCase()))
              .map((option, index) => {
                return (
                  <p key={index} onClick={() => onSelect(option)}>
                    {option}
                  </p>
                );
              })}
          </div>
        )
      ) : null}
    </div>
  );
};

Dropdown.propTypes = {
  selected: PropTypes.any,
  style: PropTypes.object,
  option: PropTypes.array,
  optionKey: PropTypes.any,
  select: PropTypes.func,
  t: PropTypes.func,
};

Dropdown.defaultProps = {};

export default Dropdown;
