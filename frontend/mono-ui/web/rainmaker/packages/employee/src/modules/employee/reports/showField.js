import React, { Component } from "react";
import { TextField, DropDown, DatePicker } from "components";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import { translate } from "./commons/common";
import Grid from '@material-ui/core/Grid';
import AutoComplete from "material-ui/AutoComplete";
import Label from "egov-ui-kit/utils/translationNode";
import UiBoundary from "./components/boundary";
import boundaryConfig from "./commons/config";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import AutoSuggestDropdown from "egov-ui-kit/components/AutoSuggestDropdown";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

export default class ShowField extends Component {
  constructor(props) {
    super(props);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear());
    maxDate.setHours(0, 0, 0, 0);

    this.state = {
      maxDate: maxDate,
    };
  }

  renderFields = (obj) => {
    let des = getLocaleLabels(obj.label, obj.label);
    const {localizationLabels} =this.props;
    let { maxDate } = this.state;
    let description = des;

    let dropDownData = [];

    if (!isEmpty(obj.defaultValue)) {
      dropDownData.push({
        value: "All",
        label: "All",
      });
    }

    if (typeof obj.defaultValue == "object") {
      for (var variable in obj.defaultValue) {
        dropDownData.push({
          value: variable,
          label: obj.defaultValue[variable],
        });
      }
    }

    switch (obj.type) {
      case "string":
        return (
          <Grid item  xs={12} sm={4} md={4} lg={4}>
            <TextField
              value={this.props.value}
              id={obj.label.split(".").join("-")}
              fullWidth={true}
              disabled={obj.disabled ? true : false}
              floatingLabelFixed={true}
              floatingLabelText={
                <span>
                  {description} <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </span>
              }
              onChange={(e) => this.props.handler(e, obj.name, obj.isMandatory ? true : false, "")}
            />
          </Grid>
        );
      case "number":
        return (
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TextField
              value={this.props.value}
              id={obj.label.split(".").join("-")}
              fullWidth={true}
              floatingLabelFixed={true}
              floatingLabelText={
                <span>
                  {description} <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </span>
              }
              onChange={(e) => this.props.handler(e, obj.name, obj.isMandatory ? true : false, /^[+-]?\d+(\.\d+)?$/)}
            />
          </Grid>
        );
      case "date":
        return (
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <DatePicker
              autoOk={true}
              // className="custom-form-control-for-textfield"
              id={obj.label.split(".").join("-")}
              fullWidth={true}
              floatingLabelFixed={true}
              floatingLabelText={
                <div className="rainmaker-displayInline">
                  <Label label={description} />
                  <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </div>
              }
              maxDate={maxDate}
              value={typeof obj.value == "object" ? obj.value : {}}
              onChange={(first, object) => {
                let e = { target: { value: object } };
                this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
              }}
            />
          </Grid>
        );
      case "epoch":
        return (
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <DatePicker
              // className="custom-form-control-for-textfield"
              id={obj.label.split(".").join("-")}
              autoOk={true}
              fullWidth={true}
              floatingLabelFixed={true}
              maxDate={maxDate}
              // required={obj.isMandatory ? true : false}
              floatingLabelText={
                <div className="rainmaker-displayInline">
                  <Label className="show-field-label" label={description} containerStyle={{ marginRight: "5px" }} />
                  <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </div>
              }
              hintText={<Label label="PT_DATE_HINT_TEXT" />}
              value={obj.value ? obj.value : {}}
              errorText={this.props.dateField ? (obj.name === this.props.dateField ? this.props.dateError : "") : ""}
              formatDate={(date) => {
                let dateObj = new Date(date);
                let year = dateObj.getFullYear();
                let month = dateObj.getMonth() + 1;
                let dt = dateObj.getDate();
                dt = dt < 10 ? "0" + dt : dt;
                month = month < 10 ? "0" + month : month;
                return dt + "-" + month + "-" + year;
              }}
              onChange={(first, object) => {
                let e = { target: { value: object } };
                this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
              }}
              minDate={obj.minValue}
              maxDate={obj.maxValue}
            />
          </Grid>
        );
      // case "singlevaluelist":
      //   return (
      //     <Col xs={12} sm={4} md={4} lg={4}>
      //       <DropDown
      //         // className="custom-form-control-for-select"
      //         hintText={<Label label="PT_COMMONS_SELECT_PLACEHOLDER" />}
      //         disabled={obj.disabled ? true : false}
      //         id={obj.label.split(".").join("-")}
      //         fullWidth={true}
      //         dropDownMenuProps={{ targetOrigin: { horizontal: "left", vertical: "bottom" } }}
      //         floatingLabelFixed={true}
      //         floatingLabelText={
      //           <div className="rainmaker-displayInline">
      //             <Label className="show-field-label" label={description} containerStyle={{ marginRight: "5px" }} />
      //             <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
      //           </div>
      //         }
      //         value={typeof obj.value == "undefined" ? "" : obj.value}
      //         onChange={(event, key, value) => {
      //           let e = { target: { value } };
      //           this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
      //         }}
      //         maxHeight={200}
      //         dropDownData={dropDownData}
      //       />
      //     </Col>
      //   );

      case "singlevaluelist":
        const dataSourceConfig = { text: "label", value: "value" };
        return (
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <AutoSuggestDropdown
            dataSource={dropDownData}
            value={typeof obj.value === undefined ? "" : getDropdownLabel(obj.value, dropDownData)}
            hintText="Select"
            hintStyle={{fontSize: "14px",color: "#767676"}}
            floatingLabelText={
              <div className="rainmaker-displayInline">
                <Label
                  className="show-field-label"
                  label={description}
                  containerStyle={{ marginRight: "5px" }}
                  style={{ fontSize: "16px !important" }}
                />
                <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
              </div>
            }
            onChange={(value) => {
              const e = { target: { value: value.value } };
              this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
            }}
          />
            {/* <AutoComplete
              // className="custom-form-control-for-textfield"

              // floatingLabelStyle={{ fontSize: "20px"}}
              floatingLabelText={
                <div className="rainmaker-displayInline">
                  <Label
                    className="show-field-label"
                    label={description}
                    containerStyle={{ marginRight: "5px" }}
                    style={{ fontSize: "16px !important" }}
                  />
                  <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </div>
              }
              // inputStyle={{ color: "#5F5C57" }}
              floatingLabelFixed={true}
              fullWidth={true}
              // style={{ display: "inline-block" }}
              filter={(searchText, key) => {
                return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
              }}
              // listStyle={{ maxHeight: 100, overflow: "auto" }}
              onNewRequest={(value) => {
                const e = { target: { value: value.value } };
                this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
              }}
              onUpdateInput={(searchText, dataSource, params) => {
                const e = { target: { value: searchText } };
                this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
              }}
              dataSource={dropDownData}
              dataSourceConfig={dataSourceConfig}
              openOnFocus={true}
              listStyle={{ maxHeight: 200, overflow: 'auto' }}
              maxSearchResults={200}
              searchText={obj.searchText}
            /> */}
          </Grid>
        );

      case "url":
        return (
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <SelectField
              // className="custom-form-control-for-select"
              hintText={<Label label="PT_COMMONS_SELECT_PLACEHOLDER" />}
              underlineDisabledStyle={{ background: "blue" }}
              disabled={obj.disabled ? true : false}
              id={obj.label.split(".").join("-")}
              fullWidth={true}
              dropDownMenuProps={{ targetOrigin: { horizontal: "left", vertical: "bottom" } }}
              floatingLabelFixed={true}
              floatingLabelText={
                <span>
                  {description} <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </span>   
              }
              value={typeof obj.value == "undefined" ? "" : obj.value}
              onChange={(event, key, value) => {
                let e = { target: { value } };
                this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
              }}
              maxHeight={200}
            >
              {dropDownData.map((dd, index) => (
                <MenuItem value={translate(dd.key)} key={index} primaryText={translate(dd.value)} />
              ))}
            </SelectField>
          </Grid>
        );

      case "multivaluelist":
        return (
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <SelectField
              // className="custom-form-control-for-select"
              hintText={<Label label="PT_COMMONS_SELECT_PLACEHOLDER" />}
              id={obj.label.split(".").join("-")}
              fullWidth={true}
              multiple={true}
              dropDownMenuProps={{ targetOrigin: { horizontal: "left", vertical: "top" } }}
              floatingLabelFixed={true}
              // floatingLabelText={
              //   <span>
              //     {description} <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
              //   </span>
              // }
              floatingLabelText={
                <div className="rainmaker-displayInline">
                  <Label
                    className="show-field-label"
                    label={description}
                    containerStyle={{ marginRight: "5px" }}
                    style={{ fontSize: "16px !important" }}
                  />
                  <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </div>
              }
              value={typeof obj.value == "undefined" ? "" : obj.value}
              onChange={(event, key, value) => {
                let e = { target: { value } };
                this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
              }}
              maxHeight={200}
            >
              {dropDownData.map((dd, index) => (
                <MenuItem
                  insetChildren={true}
                  checked={obj.value && obj.value.indexOf(dd.value) > -1 ? true : false}
                  value={translate(dd.value)}
                  key={index}
                  primaryText={getLocaleLabels(dd.label,dd.label,localizationLabels)}
                />
              ))}
            </SelectField>
          </Grid>
        );

      case "checkbox":
        return (
          <Grid item xs={12} md={3}>
            <Checkbox
              id={obj.label.split(".").join("-")}
              label={
                <span>
                  {description} <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </span>
              }
              checked={obj.value ? obj.value : false}
              onCheck={(e) => this.props.handler({ target: { value: e.target.checked } }, obj.name, obj.isMandatory ? true : false, "")}
            />
          </Grid>
        );

      case "boundarylist":
        return <UiBoundary item={boundaryConfig} handleFieldChange={this.props.handler} />;

      default:
        return <div />;
    }
  };
  render() {
    return this.renderFields(this.props.obj);
  }
}

const getDropdownLabel = (value, data) => {
  const object = filter(data, { value });
  let label = "";
  if (object.length > 0) {
    label = object[0].label;
  }
  return label;
};
