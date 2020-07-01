import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import Select, { components } from "react-select";
import MenuItem from "material-ui/MenuItem";
import Label from "../../utils/translationNode";
import "./index.css";
import { connect } from "react-redux";
import filter from "lodash/filter";
import { getTranslatedLabel } from "../../utils/commons";

const floatingLabelStyle = {
  fontSize: "12px",
  color: "rgba(0, 0, 0, 0.6000000238418579)",
  fontWeight: 500,
  transform: "scale(1) translate(0px, -16px)",
  top: 30,
};

const floatingLabelBaseShrinkStyle = {
  fontSize: "12px",
  color: "rgba(0, 0, 0, 0.6000000238418579)",
  transform: "scale(1) translate(0px, -16px)",
  fontWeight: 500,
};

const hintBaseStyle = {
  fontSize: "16px",
  letterSpacing: "0.7px",
  color: "rgba(0, 0, 0, 0.3799999952316284)",
};

const requiredStyle = {
  color: "red",
};

const underlineFocusBaseStyle = {
  borderColor: "#e0e0e0",
};

const underlineDisabledStyle = {
  borderBottom: "1px solid #e0e0e0",
};
const customStyles = {
  container: (base, state) => ({
    ...base,
    borderBottom: "1px solid #e0e0e0",

    border: state.isFocused ? null : null,
    //boxShadow: state.isDisabled ? "none" : null,
   // backgroundColor: state.isDisabled ? "#e0e0e0" : null,
    cursor: state.isDisabled ? "none" : null,
    //pointerEvents: state.isDisabled ? "none" : null,
     opacity : state.isDisabled ? 0.5 : 1,


    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, padding 0.2s ease",
    "&:hover": {
     // boxShadow: "0 2px 4px 0 rgba(41, 56, 78, 0.1)"
     // boxShadow: "none"
     // borderBottom: "none"
      //borderBottom: "2px solid black",

    }
  }),
  control: (base, state) => ({
    ...base,

    //backgroundColor: state.isDisabled ? "#0000" : null,

    //background: "#bada55"
    font: "inherit",
    height: "100%",
    outline: "none",
    position: "relative",
    padding: "0px",
    width: "100%",
    border: "none",
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "rgba(0, 0, 0, 0.3)",
    cursor: "inherit",
    opacity: "1",
    //-webkit-tap-highlight-color: "rgba(0, 0, 0, 0)";
    boxSizing: "border-box",
  //background: "#bada55"
  }),
  valueContainer: (base, state) => ({
    ...base,
    //background: "pink"
  }),
  multiValue: (base, state) => ({
    ...base,
   // background: "lightYellow"
  }),
 indicatorSeparator: (base, state) => ({
    ...base,
    width: "0px !important"
  }),
  singleValue: (base, state) => ({
    ...base,
    marginLeft: "-7px"
  }),
  placeholder: (base, state) => ({
    ...base,
    marginLeft: "-7px"
  }),
/*   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(selectOptionColor)
    return {
      ...styles,
      backgroundColor: isDisabled
        ? "#0000"
        : isSelected ? color.css() : isFocused ? color.alpha(0.3).css() : null
    }
  },  */
};

class ReactSelectDropdown extends React.Component {
  

  /* state = {
    selectedOption: null,
  }
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  } */
  

  render()
  {
    //const { selectedOption } = this.state;


    let {
      className,
      menuInnerDivStyle,
      errorText,
      localePrefix,
      errorStyle = {},
      value,
      fullWidth = false,
      labelStyle,
      required,
      dropDownData,
      children,
      selected,
      onChange,
      menuStyle,
      id,
      style = {},
      floatingLabelText,
      underlineStyle,
      hintText,
      hintStyle,
      jsonPath,
      dataFetchConfig,
      errorMessage,
      toolTip,
      iconStyle,
      autoWidth,
      toolTipMessage,
      updateDependentFields,
      beforeFieldChange,
      disabled,
      ...rest
    } = this.props;

  

    const getTransformedLocale = (label) => {
      return label&&label.toUpperCase().replace(/[.:-\s\/]/g, "_");
    };

    const getDropdownLabel = (value) => {
      return typeof localePrefix === "string" ? (
        <Label label={`${getTransformedLocale(localePrefix)}_${getTransformedLocale(value)}`} />
      ) : typeof localePrefix === "object" ? (
        <Label label={`${getTransformedLocale(moduleName)}_${getTransformedLocale(masterName)}_${getTransformedLocale(value)}`} />
      ) : (
        value
      );
    }; 

  const renderSelectMenuItems = () => {
      return dropDownData.map((option, index) => {
        return (
          <MenuItem
            className="menu-class"
            key={index}
            value={option.value}
            primaryText={localePrefix ? getDropdownLabel(option.value) : option.label}
          />
        );
      });
    }; 

     let label = value? dropDownData.filter(
        item => item.value === value
      ):"";    

  const { moduleName, masterName } = localePrefix || "";
 
  return (
    <div style={{width: '100%', fontSize: "12px",
    fontWeight: "500"}}>
    {[
      floatingLabelText,
      required ? (
        <span key={`error-${className}`} style={requiredStyle}>
          {" "}
          *
        </span>
      ) : null,
    ]}

    <Select
     errorText={errorText}
     errorStyle={errorStyle}
     className={`dropdown ${className}`}
     id={id}
     required ={required}
     styles={customStyles}
     options={dropDownData}
     autoWidth={autoWidth}
     underlineDisabledStyle={underlineDisabledStyle}
     menuStyle={menuStyle}
     fullWidth={fullWidth}
     dropDownMenuProps={{
       targetOrigin: { horizontal: "left", vertical: "top" },
     }}
     labelStyle={labelStyle}
     onChange = {onChange}
     value={label}
     placeholder = {hintText}
    // inputValue = {result}
     isDisabled={disabled}
     isSearchable = "true"
     //defaultValue ={label}
     /*  floatingLabelShrinkStyle={floatingLabelBaseShrinkStyle}
     floatingLabelFixed={true}      
     floatingLabelStyle={floatingLabelStyle}
     iconStyle={ iconStyle ? iconStyle : { fill: "#484848" }}
     underlineStyle={{ ...underlineFocusBaseStyle, ...underlineStyle }}
     hintStyle={{ ...hintBaseStyle, ...hintStyle }} */
     /* {...rest} */
    >
    </Select>
    
    {errorText?<div style={{color:"red"}}> {errorText} <div style={{  borderBottom: "3px solid rgb(244, 67, 54)", marginTop: "-21px" }}> </div></div>:""} 
    

    {//renderSelectMenuItems()
    }
    </div> 
  );
}
};

ReactSelectDropdown.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.string,
};


const mapStateToProps = (state,) => {
  const { localizationLabels } = state.app;
  return {  localizationLabels  };
};

export default connect(
  mapStateToProps,
  null
)(ReactSelectDropdown);



