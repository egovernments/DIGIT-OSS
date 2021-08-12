import Tooltip from "@material-ui/core/Tooltip";
import { TextField } from "components";
import { getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { LabelContainer } from 'egov-ui-framework/ui-containers';
import React, { Component } from 'react';
import "./index.css";

export const VerifyIcon = () => <span style={{ display: "inline-flex" }} >
    <Tooltip
        title={<LabelContainer labelName={"PT_NOT_VERIFIED"} labelKey={"PT_NOT_VERIFIED"} />}    >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#E54D42" />
        </svg>
    </Tooltip>
</span>

export const SuccessIcon = () => <span style={{ display: "inline-flex" }} >
    <Tooltip
        title={<LabelContainer labelName={"PT_VERIFIED"} labelKey={"PT_VERIFIED"} />}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#39CB74" />
        </svg>
    </Tooltip>
</span>

export default class ListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedNumberObject: {
                clickType: "",
                enteredNumber: "",
                clicked: false,
            },
        }
    }

    reset = () => {
        this.setState({
            clickedNumberObject: {
                clickType: "",
                enteredNumber: "",
                clicked: false
            }
        });
    }
    sendOTP = (item) => {
        const { mobileNumber } = item;
        const { property = {} } = this.props;
        var myHeaders = new Headers();
        const stateTenant = property.tenantId.split('.')[0];
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("content-type", "application/json;charset=UTF-8");
        var raw = { "RequestInfo": { "apiId": "Rainmaker", "ver": ".01", "ts": "", "action": "token", "did": "1", "key": "", "msgId": "20170310130900|en_IN", "authToken": null }, "otp": { "mobileNumber": mobileNumber, "type": "login", "tenantId": stateTenant, "userType": "CITIZEN" } };
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };
        this.setState({
            clickedNumberObject: {
                clickType: "VERIFY",
                clicked: true,
                enteredNumber: "",
                ...item
            }
        });

        fetch(`${window.location.origin}/user-otp/v1/_send?tenantId=${stateTenant}`, requestOptions)
            .then(response => response.text())
            .then(result => { console.log(result) })
            .catch(error => console.log('error', error));
    }

    updateItem = (item) => {
        this.setState({
            clickedNumberObject: {
                clickType: "UPDATE",
                enteredNumber: item.mobileNumber,
                clicked: true,
                ...item
            }
        });
    }

    changeNum = (num) => {
        this.setState({
            clickedNumberObject: {
                ...this.state.clickedNumberObject,
                enteredNumber: num
            }
        });
    }



    submitOTP = () => {
      
        const { property = {} } = this.props;
        const { clickedNumberObject = {} } = this.state;

        var myHeaders = new Headers();
        const stateTenant = property.tenantId.split('.')[0];
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("content-type", "application/x-www-form-urlencoded");
        myHeaders.append("authorization", "Basic ZWdvdi11c2VyLWNsaWVudDo=");
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", clickedNumberObject.mobileNumber);
        urlencoded.append("password", clickedNumberObject.enteredNumber);
        urlencoded.append("grant_type", "password");
        urlencoded.append("scope", "read");
        urlencoded.append("tenantId", stateTenant);
        urlencoded.append("userType", "CITIZEN");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`${window.location.origin}/user/oauth/token`, requestOptions)
            .then(response => response.text())
            .then(result => { console.log(result), this.reset() })
            .catch(error => console.log('error', error));
    }

    render() {
        const { propertyNumbers = [] } = this.props;
        const { clickedNumberObject = {} } = this.state;
        const listItems = propertyNumbers.map(item => {
            let pattern = clickedNumberObject.clickType == "UPDATE" ? getPattern("MobileNo") : getPattern("ChequeNo");
            const errorText = clickedNumberObject.enteredNumber && clickedNumberObject.enteredNumber.length > 0 && clickedNumberObject.enteredNumber.match(pattern) == null ? "ERROR" : "";
            return <div className="list" key={item.key}>
                <div >{item.name} </div>
                {clickedNumberObject.mobileNumber != item.mobileNumber && <div>+91 | {item.mobileNumber} <SuccessIcon /> <VerifyIcon /> </div>}
                {clickedNumberObject.mobileNumber != item.mobileNumber && <div >  <button className="button-verify" onClick={() => {
                    this.sendOTP(item)
                }}>VERIFY</button></div>}
                {clickedNumberObject.mobileNumber != item.mobileNumber && <div>   <button className="button-verify" onClick={() => {
                    this.updateItem(item)
                }}>UPDATE</button>
                </div>}
                {clickedNumberObject.clicked && clickedNumberObject.mobileNumber == item.mobileNumber && <div>
                    <TextField type="text" pattern="" placeholder={clickedNumberObject.clickType == "UPDATE" ? "Enter Mobile no" : "Enter OTP"}
                        className="textField" pattern={pattern} style={{ width: "100%", height: "auto" }}
                        value={clickedNumberObject.enteredNumber}
                        errorText={errorText}
                        onChange={(e) => this.changeNum(e.target.value)}></TextField>
                </div>}
                {clickedNumberObject.clicked && clickedNumberObject.mobileNumber == item.mobileNumber && <div style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center"
                }}>    <button type="button" className={"button-verify-link"} onClick={clickedNumberObject.clickType == "UPDATE" ? this.reset : this.submitOTP} >SUBMIT</button>
                </div>}
            </div>
        })
        return (
            <div>
                {listItems}
            </div>
        )
    }
}
