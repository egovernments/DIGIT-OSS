import { Dialog, TextField } from "components";
import { getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import Label from "egov-ui-kit/components/Label";
import { httpRequest } from "egov-ui-kit/utils/api";
import React from "react";
import "./index.css";
import ListItems from "./ListItems.js";

const getFields = () => {
  return {
    "name": { type: "text", pattern: "", placeholder: "Enter Name", floatingLabelText: "Name", className: "textField", pattern: getPattern("Name"), style: { width: "40%", height: "76px" }, value: "", errorMessage: "", error: false, jsonpath: "name", invalid: "INVALID_INPUT" },
    "mobileNumber": { type: "text", pattern: "", placeholder: "Enter Mobile no", floatingLabelText: "Mobile Number", className: "textField", pattern: getPattern("MobileNo"), style: { width: "40%", height: "76px" }, value: "", errorMessage: "", error: false, jsonpath: "mobileNumber", invalid: "INVALID_INPUT" },
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
    console.log("awaw", this.state);

    let { property = {} } = this.props;
    const newItem = this.state.fields;

    if (Object.values(newItem).some((item) => item.error)) {
      this.setState({
        error: {
          errorMessage: "INVALID INPUT",
          type: "ERROR"
        }
      })
      return;
    } else {
      this.setState({
        error: {
          errorMessage: "",
          type: ""
        }
      })
    }
    if (this.props.propertyNumbers.some(inp => inp.mobileNumber == this.state.fields.mobileNumber.value)) {
      this.setState({
        error: {
          errorMessage: "SAME NUMBER EXISTS",
          type: "ERROR"
        }
      })
      return;
    } else {
      this.setState({
        error: {
          errorMessage: "",
          type: ""
        }
      })
    }

    // let { owners = [], alternateMobileNumberDetails = [] } = property;
    // if (owners.filter(owner => owner.mobileNumber == this.newItem.mobileNumber))







    if (property) {
      property.alternateMobileNumberDetails = [{
        "id": null,
        "uuid": null,
        "name": newItem.name.value,
        "mobileNumber": newItem.mobileNumber.value,
      }]
    } else {
      property.alternateMobileNumberDetails.push({
        "id": null,
        "uuid": null,
        "name": newItem.name,
        "mobileNumber": newItem.mobileNumber,
      })
    }
    const propertyResponse = await httpRequest(`property-services/property/_addAlternateNumber`, "update", [], { "Property": property });
    if (propertyResponse) {
      this.props.loadProperty(true);
    }
    this.setState({
      fields: getFields()
    })
  }

  // handleInputSecond(e){
  //   
  //   this.setState({
  //     currentItem:{
  //       key:e.target.value,
  //     }
  //   })
  // }
  render() {
    const { fields = {}, error = {} } = this.state;
    const { errorMessage = "", type = "" } = error;
    return (
      <Dialog
        open={this.props.open}
        isClose={true}
        title={<Label label="Link Mobile No." fontSize="24px" labelStyle={{ padding: "2%", backgroundColor: "white" }} labelClassName="owner-history" />}
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

        <Label label="Property Owner’s Mobile No." fontSize="20px" labelClassName="owner-history" />
        <ListItems items={this.state.items} property={this.props.property} propertyNumbers={this.props.propertyNumbers} />
        <Label label="Add Alternate Mobile No." labelStyle={{ marginTop: "2%" }} fontSize="20px" labelClassName="owner-history" />

        <Label label="This Mobile no. will be used to notify you about property tax dues and important dates" style={{ color: '#00000099' }} fontSize="14px" labelClassName="owner-history" />

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

          <button type="button" className={"button-verify-link"} onClick={() => this.addNewNumber()} >ADD</button>
        </div>
        {errorMessage && <div className={type=="error"?"error-comp-second-num":"success-comp-second-num"}>{errorMessage}</div>}
      </Dialog>
    )
  }
}
