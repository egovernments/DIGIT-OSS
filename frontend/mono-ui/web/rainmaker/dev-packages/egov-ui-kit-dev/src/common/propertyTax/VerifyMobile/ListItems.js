import Tooltip from "@material-ui/core/Tooltip";
import { TextField } from "components";
import { getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { LabelContainer } from 'egov-ui-framework/ui-containers';
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from 'react';
import "./index.css";

export const VerifyIcon = () => <span style={{ display: "inline-flex" }} >
    <Tooltip
        title={<LabelContainer labelName={"PT_SEC_NOT_VERIFIED "} labelKey={"PT_SEC_NOT_VERIFIED "} />}    >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#E54D42" />
        </svg>
    </Tooltip>
</span>

export const SuccessIcon = () => <span style={{ display: "inline-flex" }} >
    <Tooltip
        title={<LabelContainer labelName={"PT_SEC_VERIFIED "} labelKey={"PT_SEC_VERIFIED "} />}>
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
            .then(result => { console.log(result), this.props.setMessage("PT_SEC_OTP_SENT_SUCEESS", "SUCCESS", true) })
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

        const { property = {}, setMessage } = this.props;
        const { clickedNumberObject = {} } = this.state;
        if (!clickedNumberObject.enteredNumber.match(getPattern("ChequeNo"))) {
            setMessage("CS_INVALID_OTP", "ERROR")
            return;
        }
        var myHeaders = new Headers();
        const stateTenant = property.tenantId.split('.')[0];
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("authorization", "Basic ZWdvdi11c2VyLWNsaWVudDo=");
        myHeaders.append("content-type", "application/x-www-form-urlencoded");
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
            .then(result => {
                console.log(result),
                    this.props.setMessage("PT_SEC_NUMBER_VERIFIED", "SUCCESS", true);
                this.reset()
            })
            .catch(error => console.log('error', error));
    }
    submitUpdateNumber = () => {
        const { property = {} } = this.props;
        var myHeaders = new Headers();
        const stateTenant = property.tenantId.split('.')[0];
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("content-type", "application/json;charset=UTF-8");

        var raw = { "RequestInfo": { "apiId": "Rainmaker", "ver": ".01", "ts": "", "did": "1", "key": "", "msgId": "20170310130900|en_IN", "authToken": "28824554-550f-4692-ab3f-b8e0271bf6e0" }, "user": { "id": 26678, "userName": "9965664222", "salutation": null, "name": "Jagan", "gender": null, "mobileNumber": "9965664222", "emailId": "ejagankumar@gmail.com", "altContactNumber": null, "pan": null, "aadhaarNumber": null, "permanentAddress": null, "permanentCity": "pb.amritsar", "permanentPinCode": null, "correspondenceAddress": null, "correspondenceCity": null, "correspondencePinCode": null, "active": true, "locale": null, "type": "CITIZEN", "accountLocked": false, "accountLockedDate": 0, "fatherOrHusbandName": null, "signature": null, "bloodGroup": null, "identificationMark": null, "createdBy": 26644, "password": null, "otpReference": null, "lastModifiedBy": 1, "tenantId": "pb", "roles": [{ "code": "CITIZEN", "name": "Citizen", "tenantId": "pb" }], "uuid": "b7014a0f-f21e-45ee-bde6-2aafb44e2164", "createdDate": "01-08-2019 10:48:57", "lastModifiedDate": "11-08-2021 20:20:35", "dob": "1/8/2019", "pwdExpiryDate": "27-11-2019 10:47:04" } };

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };

        fetch(`${window.location.origin}/user/profile/_update?tenantId=${stateTenant}`, requestOptions)
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
                }}><Label label="PT_SEC_VERIFY_BTN"></Label></button></div>}
                {/* TODO UPDATE BUTTON , removing it since it is not clear and no API supports this */}
                {/* {clickedNumberObject.mobileNumber != item.mobileNumber && <div>   <button className="button-verify" onClick={() => {
                    this.updateItem(item)
                }}>UPDATE</button>
                </div>} */}
                {clickedNumberObject.clicked && clickedNumberObject.mobileNumber == item.mobileNumber && <div>
                    <TextField type="text" pattern="" placeholder={clickedNumberObject.clickType == "UPDATE" ? "PT_FORM3_MOBILE_NO_PLACEHOLDER" : "CORE_OTP_HEADING"}
                        className="textField" pattern={pattern} style={{ width: "100%", height: "auto", backgroundColor: "none" }}
                        value={clickedNumberObject.enteredNumber}
                        errorText={""}
                        error={errorText}
                        onChange={(e) => this.changeNum(e.target.value)}></TextField>
                </div>}
                {clickedNumberObject.clicked && clickedNumberObject.mobileNumber == item.mobileNumber && <div >    <button type="button" className={"button-verify-link"} style={{ "float": "right" }} onClick={clickedNumberObject.clickType == "UPDATE" ? this.submitUpdateNumber : this.submitOTP} ><Label label="CS_COMMON_SUBMIT"></Label></button>
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
