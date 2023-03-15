import React, { useRef, useState } from "react";
import { ArrowDown, CheckSvg } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const MultiSelect = ({ options, optionsKey, selected = [], onSelect, defaultLabel = "", defaultUnit = "",BlockNumber=1,isOBPSMultiple=false}) => {
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [optionIndex, setOptionIndex] = useState(-1);
  const dropdownRef = useRef();
  const { t } = useTranslation();
  Digit.Hooks.useClickOutside(dropdownRef, () => setActive(false), active);
  const filtOptns =
      searchQuery?.length > 0 ? options.filter((option) => t(option[optionsKey]&&typeof option[optionsKey]=="string" && option[optionsKey].toUpperCase()).toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) : options;
    
  function onSearch(e) {
    setSearchQuery(e.target.value);
  }

/* Custom function to scroll and select in the dropdowns while using key up and down */
    const keyChange = (e) => {
    if (e.key == "ArrowDown") {
      setOptionIndex(state =>state+1== filtOptns.length?0:state+1);
      if(optionIndex+1== filtOptns.length){
        e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollTo?.(0,0)
      }else{
        optionIndex>2&& e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollBy?.(0,45)
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      setOptionIndex(state =>  state!==0? state - 1: filtOptns.length-1);
      if(optionIndex===0){
        e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollTo?.(100000,100000)
      }else{
        optionIndex>2&&e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollBy?.(0,-45)
     }
      e.preventDefault();
    }else if(e.key=="Enter"){
      onSelect(e,filtOptns[optionIndex]);
    } 
  }

  const MenuItem = ({ option, index }) => (
    <div key={index}>
      <input
        type="checkbox"
        value={option[optionsKey]}
        checked={selected.find((selectedOption) => selectedOption[optionsKey] === option[optionsKey]) ? true : false}
        onChange={(e) => isOBPSMultiple?onSelect(e, option,BlockNumber):onSelect(e, option)}
        
      />
      <div className="custom-checkbox">
        <CheckSvg />
      </div>
      <p className="label" style={index === optionIndex ? {
                    opacity: 1,
                    backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))"
                  } : { }} >{t(option[optionsKey]&&typeof option[optionsKey]=="string" && option[optionsKey])}</p>
    </div>
  );

  const Menu = () => {
    const filteredOptions =
      searchQuery?.length > 0 ? options.filter((option) => t(option[optionsKey]&&typeof option[optionsKey]=="string" && option[optionsKey].toUpperCase()).toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) : options;
    return filteredOptions.map((option, index) => <MenuItem option={option} key={index} index={index} />);
  };

  return (
    <div className="multi-select-dropdown-wrap" ref={dropdownRef}>
      <div className={`master${active ? `-active` : ``}`}>
        <input className="cursorPointer" type="text" onKeyDown={keyChange} onFocus={() => setActive(true)} value={searchQuery} onChange={onSearch} />
        <div className="label">
          <p>{selected.length > 0 ? `${selected.length} ${defaultUnit}` : defaultLabel}</p>
          <ArrowDown />
        </div>
      </div>
      {active ? (
        <div className="server" id="jk-dropdown-unique">
          <Menu />
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelect;