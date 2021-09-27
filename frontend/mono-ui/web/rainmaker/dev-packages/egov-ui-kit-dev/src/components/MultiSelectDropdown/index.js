import React from "react";
import PropTypes from "prop-types";
import { Input, Checkbox, ListItemText } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import Label from "../../utils/translationNode";
import { connect } from "react-redux";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

const floatingLabelStyle = {
  fontSize: "12px",
  color: "rgba(0, 0, 0, 0.6000000238418579)",
  fontWeight: 500,
  transform: "scale(1) translate(0px, -16px)",
  top: 30,
};

const requiredStyle = {
  color: "red",
};

const styles = theme => ({
  icon : {
    right :"-22px"
  }
});


class MultiSelectDropDown extends React.Component {
  renderSelectMenuItems = (dropDownData, value) => {
    const {localizationLabels} = this.props
    return dropDownData.map((option, index) => {
      return (
        <MenuItem
          style={{color:"black!important"}}
          className="menu-class"
          key={option.label}
          value={option.value}
          primaryText={ <Label label={value} />}
          >
          <Checkbox checked={value.indexOf(option.value) > -1} style={{color:'rgb(254, 122, 81)'}}/>
          <ListItemText primary={ <Label label={option.label} color="rgba(0,0,0,0.87)" /> }/>
        </MenuItem>
      );
    });
  };


  render(){
    const { className,
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
      prefix,
      autoWidth,
      updateDependentFields,
      beforeFieldChange,
      localizationLabels,
      classes,
      ...rest
    } = this.props
    return (
      <span>
       <span style={floatingLabelStyle}> {floatingLabelText}</span>
      <Select
        multiple
        errorText={errorText}
        errorStyle={errorStyle}
        className={`dropdown ${className}`}
        id={id}
        style={style}
        menuStyle={menuStyle}
        fullWidth={fullWidth}
        labelStyle={labelStyle}
        onChange={onChange}
        selected="Select"
        value={value}
        hintText={hintText}
        floatingLabelFixed={true}
        floatingLabelText={[
          floatingLabelText,
          required ? (
            <span key={`error-${className}`} style={requiredStyle}>
              {" "}
              *
            </span>
          ) : null,
        ]}
        floatingLabelStyle={floatingLabelStyle}
        {...rest}
        input={<Input id="select-multiple-checkbox" />}
        renderValue={selected => selected.map((item=>{
          return prefix ? getLocaleLabels(item,`${prefix}${item}`,localizationLabels) : getLocaleLabels(item,item,localizationLabels)
        })).join(', ')}>
        {dropDownData && this.renderSelectMenuItems(dropDownData,value)}
      </Select>
      </span>
    );
  }
}


const mapStateToProps = (state) =>{
  const {localizationLabels} = state.app;
  return {localizationLabels}
}



MultiSelectDropDown.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.string,
};

export default withStyles(styles)(connect(mapStateToProps,null)(MultiSelectDropDown));
