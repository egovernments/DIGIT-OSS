import React, { Component } from 'react';
import "./index.css";

export const VerifyIcon=()=><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#E54D42" />
</svg>

export const SuccessIcon=()=><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#39CB74" />
</svg>

export default class ListItems extends Component {
    constructor(props) {
        super(props);
    }
    sendOTP = (number) => {
        const { property = {} } = this.props;
        var myHeaders = new Headers();
        const stateTenant = property.tenantId.split('.')[0];
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("content-type", "application/json;charset=UTF-8");
        var raw = { "RequestInfo": { "apiId": "Rainmaker", "ver": ".01", "ts": "", "action": "token", "did": "1", "key": "", "msgId": "20170310130900|en_IN", "authToken": null }, "otp": { "mobileNumber": number, "type": "login", "tenantId": stateTenant, "userType": "CITIZEN" } };
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(raw),
            redirect: 'follow'
        };

        fetch(`${window.location.origin}/user-otp/v1/_send?tenantId=${stateTenant}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    render() {
        const { propertyNumbers = [] } = this.props;

        /* 
                    "id": owner.id,
                    "uuid": owner.uuid,
                    "name": owner.name,
                    "mobileNumber": owner.mobileNumber,
                    "type":"owner" */



        const listItems = propertyNumbers.map(item => {
            return <div className="list" key={item.key}>
                <p>
                    <div style={{ width: "24%", display: "inline-block", fontSize: "14px" }}>{item.name} </div>
                    <div style={{ width: "24%", display: "inline-block", fontSize: "14px" }}>{item.mobileNumber} </div>
                    <div style={{ width: "24%", display: "inline-block", fontSize: "14px" }}>   <SuccessIcon /></div>
                    <div style={{ width: "24%", display: "inline-block", fontSize: "14px" }} onClick={() => {
                        this.sendOTP(item.mobileNumber)
                    }}>   <VerifyIcon />
                    </div>
                    {/* {!this.state.verify && <div style={{ width: "75%", display: "inline-block", fontSize: "14px" }}><div style={{ width: "53%", display: "inline-block" }} >{item.key} </div> <button style={{ background: "none", color: "red", border: "none", width: "20%", display: "inline-block", fontSize: "14px" }}
                        onClick={(e) => {
                            this.getVerifyResponse(items, e);
                        }}>VERIFY</button>
                        <button style={{ background: "none", color: "red", border: "none", width: "10%", display: "inline-block", fontSize: "14px" }} onClick={(e) => {
                            this.getUpdateResponse(items, e)
                        }}>UPDATE</button>
                    </div>} */}
                    {/* {(this.state.verify && !this.state.update) && <div style={{ width: "53%", display: "inline-block", fontSize: "14px" }}>
                        <form id="to-do-verification" >
                            <TextField type="text"
                                placeholder="Enter OTP"
                                value={this.state.currentItem.verifytext}
                                onChange={this.handleVerify('verifytext')}>
                            </TextField>
                            <button className="otpBUtton" onClick={(items, e) => {
                                this.getOtpResponse(phonenumber, e);
                            }}>SUBMIT</button>
                        </form>
                    </div>} */}

                    {/* {(this.state.update) && <div style={{ width: "53%", display: "inline-block", fontSize: "14px" }}>
                        <form id="to-do-updation" >
                            <TextField type="text"
                                placeholder="Enter Mobile No."
                                value={this.state.currentItem.updatedMobile}
                                onChange={this.handleUpdate('updatedMobile')}>
                            </TextField>
                            <button className="otpBUtton" onClick={(items, e) => {
                                this.getNextResponse(items, e)
                            }} >NEXT</button>
                        </form>
                    </div>} */}
                </p>
            </div>
        })
        return (
            <div>
                {listItems}
            </div>
        )
    }
}
