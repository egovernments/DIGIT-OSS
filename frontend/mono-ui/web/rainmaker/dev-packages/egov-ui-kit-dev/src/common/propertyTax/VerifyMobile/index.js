import { Dialog, TextField } from "components";
import { getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import "./index.css";
import ListItems from "./ListItems.js";

const getFields = () => {
  return {
    "name": { type: "text", pattern: "", placeholder: "PT_FORM3_GUARDIAN_PLACEHOLDER", floatingLabelText: "CORE_COMMON_NAME", className: "textField", pattern: getPattern("Name"), style: { width: "40%", height: "76px" }, value: "", errorMessage: "", error: false, jsonpath: "name", invalid: "PT_ERR_INVALID_TEXT" },
    "mobileNumber": { type: "text", pattern: "", placeholder: "PT_FORM3_MOBILE_NO_PLACEHOLDER", floatingLabelText: "CS_COMMON_MOBILE_NO", className: "textField", pattern: getPattern("MobileNo"), style: { width: "40%", height: "76px" }, value: "", errorMessage: "", error: false, jsonpath: "mobileNumber", invalid: "PT_ERR_INVALID_TEXT" },
  }
}


export default class ViewMobileDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: getFields(),
      error: {
        errorMessage: "",
        type: ""
      }
    }
  }

  handleChange = (id, value) => {
    const { fields = {} } = this.state;
    fields[id].value = value;
    if (value && value.length > 0 && value.match(fields[id].pattern) == null) {
      fields[id].error = true;
      fields[id].errorMessage = fields[id].invalid;
    } else {
      fields[id].error = false;
      fields[id].errorMessage = '';
    }
    this.setState({
      fields: { ...fields },
      error: {
        errorMessage: "",
        type: ""
      }
    })
  }
  addNewNumber = async () => {

    try {


      let { property = {} } = this.props;
      const newItem = this.state.fields;
      if (Object.values(newItem).some((item) => item.value == "")) {
        this.setMessage("PT_SEC_ENTER_NAME_NUMBER", "ERROR");
        return;
      } else if (Object.values(newItem).some((item) => item.error)) {
        this.setMessage("PT_ERR_INVALID_TEXT", "ERROR");
        return;
      } else if (this.props.propertyNumbers.some(inp => inp.mobileNumber == this.state.fields.mobileNumber.value)) {
        this.setMessage("PT_SEC_SAME_NUMBER", "ERROR");
        return;
      } else {
        this.setMessage();
      }

      if (property) {
        property.alternateMobileNumberDetails = [{
          "id": null,
          "uuid": null,
          "name": newItem.name.value,
          "mobileNumber": newItem.mobileNumber.value,
        }]
      } else {
        /* This LOGIC CAN BE USED IN CASE ADDINGTO EXISTING ARRAY */
        property.alternateMobileNumberDetails.push({
          "id": null,
          "uuid": null,
          "name": newItem.name,
          "mobileNumber": newItem.mobileNumber,
        })
      }
      const propertyResponse = await httpRequest(`property-services/property/_addAlternateNumber`, "update", [], { "Property": property });
      if (propertyResponse) {
        this.setMessage("PT_SEC_NUMBER_LINKED", "SUCCESS", true)
        this.props.loadProperty(true);
      }
      this.setState({
        fields: getFields()
      })
    } catch (e) {
      this.setMessage(e.message, "ERROR")
    }
  }


  setMessage = (message = "", type = "", clear = false) => {
    this.setState({
      error: {
        errorMessage: message,
        type: type
      }
    });
    if (clear) {
      setTimeout(this.setMessage, 1000);
    }
  }



  render() {
    const { fields = {}, error = {} } = this.state;
    const { errorMessage = "", type = "" } = error;
    return (
      <Dialog
        open={this.props.open}
        isClose={true}
        title={<Label label="PT_SEC_LINK_MOBILE_NO_HEADER" fontSize="24px" labelStyle={{ padding: "2%", backgroundColor: "white" }} labelClassName="owner-history" />}
        handleClose={this.props.closeDialog}
        titleStyle={{
          padding: "2%",
          backgroundColor: "white"
        }}
        actionsContainerStyle={{
          padding: "2%",
          backgroundColor: "white"
        }}
        bodyStyle={{
          padding: "0% 2% 2% 2%",
          backgroundColor: "white"
        }}
      >

        <Label label="PT_SEC_OWNER_NO" fontSize="20px" labelClassName="owner-history" />
        <ListItems items={this.state.items} property={this.props.property} propertyNumbers={this.props.propertyNumbers} setMessage={this.setMessage} />
        <Label label="PT_SEC_ADD_SEC_MOB" labelStyle={{ marginTop: "2%" }} fontSize="20px" labelClassName="owner-history" />

        <Label label="PT_SEC_ADD_SEC_MOB_INFO" style={{ color: '#00000099' }} fontSize="14px" labelClassName="owner-history" />

        <div style={{
          height: "100px",
          display: "flex",
          alignItems: "center"
        }}> {Object.keys(fields).map(key => {
          return <TextField type={fields[key].type}
            placeholder={fields[key].placeholder}
            floatingLabelText={fields[key].floatingLabelText}
            className={fields[key].className}
            pattern={fields[key].pattern}
            errorText={fields[key].errorMessage}
            style={fields[key].style}
            value={fields[key].value}
            onChange={(e) => this.handleChange(key, e.target.value)}></TextField>
        })}

          <button type="button" className={"button-verify-link"} onClick={() => this.addNewNumber()} ><Label label="PT_SEC_ADD"></Label></button>
        </div>
        {errorMessage && <div className={type == "ERROR" ? "error-comp-second-num" : "success-comp-second-num"}><Label label={errorMessage}></Label></div>}
      </Dialog>
    )
  }
}
