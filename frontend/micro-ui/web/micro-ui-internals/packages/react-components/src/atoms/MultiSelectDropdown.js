import React, { useEffect, useReducer, useRef, useState } from "react";
import { ArrowDown, CheckSvg } from "./svgindex";
import { useTranslation } from "react-i18next";

const MultiSelectDropdown = ({ options, optionsKey, selected = [], onSelect, defaultLabel = "", defaultUnit = "",BlockNumber=1,isOBPSMultiple=false,props={},isPropsNeeded=false,ServerStyle={}, isSurvey=false}) => {
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [optionIndex, setOptionIndex] = useState(-1);
  const dropdownRef = useRef();
  const { t } = useTranslation();

  function reducer(state, action){
    switch(action.type){
      case "ADD_TO_SELECTED_EVENT_QUEUE":
        return [...state, {[optionsKey]: action.payload?.[1]?.[optionsKey], propsData: action.payload} ] 
      case "REMOVE_FROM_SELECTED_EVENT_QUEUE":
        return state.filter( e => e?.[optionsKey] !== action.payload?.[1]?.[optionsKey]) 
      case "REPLACE_COMPLETE_STATE":
        return action.payload
      default:
        return state
    }
  }

  useEffect(() => {
    dispatch({type: "REPLACE_COMPLETE_STATE", payload: fnToSelectOptionThroughProvidedSelection(selected) })
  },[selected?.length, selected?.[0]?.code])

  function fnToSelectOptionThroughProvidedSelection(selected){
    return selected?.map( e => ({[optionsKey]: e?.[optionsKey], propsData: [null, e]}))
  }

  const [alreadyQueuedSelectedState, dispatch] = useReducer(reducer, selected, fnToSelectOptionThroughProvidedSelection)
  
  useEffect(()=> {
    if(!active){
      onSelect(alreadyQueuedSelectedState?.map( e => e.propsData), props)
    }
  },[active])


  function handleOutsideClickAndSubmitSimultaneously(){
    setActive(false)
  }

  Digit.Hooks.useClickOutside(dropdownRef, handleOutsideClickAndSubmitSimultaneously , active, {capture: true} );
  const filtOptns =
      searchQuery?.length > 0 ? options.filter((option) => t(option[optionsKey]&&typeof option[optionsKey]=="string" && option[optionsKey].toUpperCase()).toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) : options;
    
  function onSearch(e) {
    setSearchQuery(e.target.value);
  }

  function onSelectToAddToQueue(...props){
    const isChecked = arguments[0].target.checked
    isChecked ? dispatch({type: "ADD_TO_SELECTED_EVENT_QUEUE", payload: arguments }) : dispatch({type: "REMOVE_FROM_SELECTED_EVENT_QUEUE", payload: arguments })
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
      onSelectToAddToQueue(e,filtOptns[optionIndex]);
    } 
  }

  const MenuItem = ({ option, index }) => (
    <div key={index} style={isOBPSMultiple ? (index%2 !== 0 ?{background : "#EEEEEE"}:{}):{}}>
      <input
        type="checkbox"
        value={option[optionsKey]}
        checked={alreadyQueuedSelectedState.find((selectedOption) => selectedOption[optionsKey] === option[optionsKey]) ? true : false}
        onChange={(e) => isPropsNeeded?onSelectToAddToQueue(e, option,props):isOBPSMultiple?onSelectToAddToQueue(e, option,BlockNumber):onSelectToAddToQueue(e, option)}
        style={{minWidth: "24px", width: "100%"}}
      />
      <div className="custom-checkbox">
        <CheckSvg style={{innerWidth: "24px", width: "24px"}}/>
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
    return filteredOptions?.map((option, index) => <MenuItem option={option} key={index} index={index} />);
  };

  return (
    <div className="multi-select-dropdown-wrap" ref={dropdownRef}>
      <div className={`master${active ? `-active` : ``}`}>
        <input className="cursorPointer" type="text" onKeyDown={keyChange} onFocus={() => setActive(true)} value={searchQuery} onChange={onSearch} />
        <div className="label">
          <p>{alreadyQueuedSelectedState.length > 0 ? `${isSurvey? alreadyQueuedSelectedState?.filter((ob) => ob?.i18nKey !== undefined).length : alreadyQueuedSelectedState.length} ${defaultUnit}` : defaultLabel}</p>
          <ArrowDown />
        </div>
      </div>
      {active ? (
        <div className="server" id="jk-dropdown-unique" style={ServerStyle?ServerStyle:{}}>
          <Menu />
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelectDropdown;
