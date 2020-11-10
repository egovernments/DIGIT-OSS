import React, { useEffect, useState } from "react";
import { ArrowDown } from "./svgindex";

const TextField = (props) => {
  const [value, setValue] = useState( props.selectedVal ? props.selectedVal : "");

  useEffect(() => {
    props.selectedVal ? setValue(props.selectedVal) : null;
  }, [props.selectedVal]);

  function inputChange(e) {
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }

  return <input type="text" value={value} onChange={inputChange} onClick={props.onClick} />;
};

const Dropdown = (props) => {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState( props.selected ? props.selected : null);
  const [filterVal, setFilterVal] = useState("");

  useEffect(()=>{
    setSelectedOption(props.selected)
  },[props.selected])

  function dropdownSwitch() {
    var current = dropdownStatus;
    setDropdownStatus(!current);
  }

  function dropdownOn() {
    setDropdownStatus(true);
  }

  function onSelect(selectedOption) {
    props.select(selectedOption)
    setSelectedOption(selectedOption);
    setDropdownStatus(false);
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  return (
    <div className="select-wrap">
      <div className={dropdownStatus ? "select-active" : "select"}>
        <TextField setFilter={setFilter} selectedVal={selectedOption} filterVal={filterVal} onClick={dropdownOn} />
        {/* <img src={ArrowDown} alt="Arrow Down"/> */}
        <ArrowDown onClick={dropdownSwitch} />
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px" onClick={dropdownSwitch}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg> */}
      </div>
      {dropdownStatus && (
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
      )}
    </div>
  );
};

export default Dropdown;
