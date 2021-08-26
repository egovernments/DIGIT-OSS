import { Dialog, TextField } from "components";
import { getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";
import { getLocaleLabels, handleFileUpload } from "egov-ui-framework/ui-utils/commons.js";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import Counter from "./counter";
import "./index.css";

const getFields = () => {
  return {
    "name": { type: "text", pattern: "", placeholder: "PT_FORM3_GUARDIAN_PLACEHOLDER", floatingLabelText: "CORE_COMMON_NAME", className: "textField", pattern: getPattern("Name"), style: { width: "40%", height: "76px" }, value: "", errorMessage: "", error: false, jsonpath: "name", invalid: "PT_ERR_INVALID_TEXT", disabled: true },
    "mobileNumber": { type: "text", pattern: "", placeholder: "PT_FORM3_MOBILE_NO_PLACEHOLDER", floatingLabelText: "CS_COMMON_MOBILE_NO", className: "textField", pattern: getPattern("MobileNo"), style: { width: "100%", height: "76px" }, value: "", errorMessage: "", error: false, jsonpath: "mobileNumber", invalid: "PT_ERR_INVALID_TEXT", disabled: false },
    "otp": { type: "text", pattern: "", placeholder: "CS_LOGIN_OTP_TEXT", floatingLabelText: "CORE_OTP_OTP", className: "textField", pattern: getPattern("ChequeNo"), style: { width: "100%", height: "76px" }, value: "", errorMessage: "", error: false, jsonpath: "otp", invalid: "CS_INVALID_OTP", disabled: true },
  }
}

const getDocuments = () => {
  return [
    {
      active: true,
      code: "OWNER.DULYSIGNED",
      description: "OWNER.DULYSIGNED_DESCRIPTION",
      documentType: "DULYSIGNED",
      dropdownData: [],
      hasDropdown: false,
      required: false,
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
      },
      maxFileSize: 5000,
    },
    {
      active: true,
      code: "OWNER.IDENTITYPROOF",
      description: "OWNER.IDENTITYPROOF_DESCRIPTION",
      documentType: "IDENTITYPROOF",
      dropdownData: [],
      hasDropdown: false,
      required: false,
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
      },
      maxFileSize: 5000,
    }
  ]
}

export default class ViewMobileDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: getFields(),
      register: false,
      documentsUploaded: [],
      documents: getDocuments(),
      clickedElement: 0,
      verifyButton: true,
      fileUploadingStatus: "",
      otpButton: false,
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

  registerNumber = () => {
    const { mobileNumber } = this.state.fields;
    const { property = {}, propertyNumbers = {} } = this.props;
    const { tenantId = "" } = property;
    const tenant = tenantId.split('.')[0];
    const { name = "" } = propertyNumbers;

    var myHeaders = new Headers();

    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("content-type", "application/json;charset=UTF-8");

    var raw = {
      "RequestInfo": {
        "apiId": "Rainmaker",
        "ver": ".01",
        "ts": "",
        "action": "_send",
        "did": "1",
        "key": "",
        "msgId": "20170310130900|en_IN",
        "authToken": null
      },
      "otp": {
        "name": name,
        "permanentCity": tenantId,
        "tenantId": tenant,
        "mobileNumber": mobileNumber.value,
        "type": "register"
      }
    }

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
    };

    fetch(`${window.location.origin}/user-otp/v1/_send?tenantId=${tenant}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        const newFields = { ...this.state.fields };
        newFields.mobileNumber.disabled = true;
        newFields.otp.disabled = false;
        this.setState({ fields: { ...newFields }, otpButton: true, verifyButton: false })
        this.setMessage("PT_SEC_OTP_SENT_SUCEESS", "SUCCESS", true)
      })
      .catch(error => this.setMessage("PT_SEC_OTP_SENT_FAILURE", "ERROR", true));
  }
  createUser = () => {
    const { mobileNumber, otp } = this.state.fields;
    const { property = {}, propertyNumbers = {} } = this.props;
    const { tenantId = "" } = property;
    const tenant = tenantId.split('.')[0];
    const { name = "" } = propertyNumbers;
    var myHeaders = new Headers();

    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("content-type", "application/json;charset=UTF-8");
    var raw = {
      "RequestInfo": {
        "apiId": "Rainmaker",
        "ver": ".01",
        "ts": "",
        "action": "_create",
        "did": "1",
        "key": "",
        "msgId": "20170310130900|en_IN",
        "authToken": null
      },
      "User": {
        "otpReference": otp.value,
        "username": mobileNumber.value,
        "name": name,
        "tenantId": tenantId,
        "permanentCity": tenantId
      }
    }
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
    };


    fetch(`${window.location.origin}/user/citizen/_create?tenantId=${tenant}`, requestOptions)
      .then(response => response.text())
      .then(resp => JSON.parse(resp))
      .then(result => {
        if (result.error && result.error.fields[0] && result.error.fields[0].code == "OTP.VALIDATION_UNSUCCESSFUL") {
          this.setMessage(result.error.fields[0].code, "ERROR", false);
        } else {
          this.setMessage("PT_SEC_USER_CREATED_SUCCESS", "SUCCESS", true);
          setTimeout(() => {
            window.location.reload()
          }, 1000);
        }
      })
      .catch(error => console.log('error', error));
  }

  validateOTP = () => {
    const { mobileNumber, otp } = this.state.fields;
    const { property = {} } = this.props;
    const { tenantId = "" } = property;
    const tenant = tenantId.split('.')[0];
    var myHeaders = new Headers();

    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("authorization", "Basic ZWdvdi11c2VyLWNsaWVudDo=");

    myHeaders.append("content-type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("username", mobileNumber.value);
    urlencoded.append("password", otp.value);
    urlencoded.append("grant_type", "password");
    urlencoded.append("scope", "read");
    urlencoded.append("tenantId", tenant);
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
        if (result.error && result.error == "invalid_request") {
          this.setMessage(result.error, "ERROR", false);
        } else {
          this.setMessage("PT_SEC_USER_CREATED_SUCCESS", "SUCCESS", true);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch(error => console.log('error', error));
  }


  sendOTP = () => {
    const { mobileNumber } = this.state.fields;
    const { property = {} } = this.props;
    const { tenantId = "" } = property;
    const tenant = tenantId.split('.')[0];
    var myHeaders = new Headers();

    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("content-type", "application/json;charset=UTF-8");
    var raw = { "RequestInfo": { "apiId": "Rainmaker", "ver": ".01", "ts": "", "action": "token", "did": "1", "key": "", "msgId": "20170310130900|en_IN", "authToken": null }, "otp": { "mobileNumber": mobileNumber.value, "type": "login", "tenantId": tenant, "userType": "CITIZEN" } };
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
    };


    fetch(`${window.location.origin}/user-otp/v1/_send?tenantId=${tenant}`, requestOptions)
      .then(response => response.text())
      .then(resp => JSON.parse(resp))
      .then(result => {
        if (result.error && result.error.fields[0] && result.error.fields[0].code == "OTP.UNKNOWN_USER") {
          this.setState({ register: true });
          this.registerNumber();
        } else {
          const newFields = { ...this.state.fields };
          newFields.mobileNumber.disabled = true;
          newFields.otp.disabled = false;
          this.setState({ fields: { ...newFields }, otpButton: true, verifyButton: false });
          this.setMessage("PT_SEC_OTP_SENT_SUCEESS", "SUCCESS", true);
        }
      })
      .catch(error => console.log('error', error));
  }

  validateAndSendOtp = async () => {
    try {
      const newItem = { mobileNumber: this.state.fields.mobileNumber };
      if (Object.values(newItem).some((item) => item.value == "")) {
        this.setMessage("PT_SEC_ENTER_NAME_NUMBER", "ERROR");
        return;
      } else if (Object.values(newItem).some((item) => item.error)) {
        this.setMessage("PT_ERR_INVALID_TEXT", "ERROR");
        return;
      } else if (this.props.propertyNumbers.mobileNumber == this.state.fields.mobileNumber.value) {
        this.setMessage("PT_SEC_SAME_NUMBER", "ERROR");
        return;
      } else {
        this.setMessage();
      }
      this.sendOTP();
    } catch (e) {
      this.setMessage(e.message, "ERROR")
    }
  }
  validateAndCreate = async () => {
    try {
      const newItem = { otp: this.state.fields.otp };
      if (Object.values(newItem).some((item) => item.value == "")) {
        this.setMessage("PT_INVALID_OTP", "ERROR");
        return;
      } else if (Object.values(newItem).some((item) => item.error)) {
        this.setMessage("PT_INVALID_OTP", "ERROR");
        return;
      } else {
        this.setMessage();
      }
      if (this.state.register) {
        this.createUser();
      }
      else {
        this.validateOTP();
      }

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
  setDocFileDetails = (ind, file, fileStoreId) => {
    ind = this.state.clickedElement != "IDENTITYPROOF" ? 0 : 1;

    const documents = this.state.documents;
    documents[ind].fileName = file.name;
    documents[ind].fileStoreId = fileStoreId;
    this.setState({ documents: documents });
    this.setState({ fileUploadingStatus: "uploaded" });
  }

  render() {
    const { propertyNumbers = {} } = this.props;
    const { fields = {}, error = {}, documents, fileUploadingStatus } = this.state;
    const { errorMessage = "", type = "" } = error;
    let key = "mobileNumber";
    let key1 = "otp";
    return (
      <Dialog
        className="pt-update-popup"
        open={this.props.open}
        isClose={true}
        title={<Label label="PTUPNO_HEADER" fontSize="24px" labelStyle={{ padding: "2%", backgroundColor: "white", paddingLeft: '4%' }} labelClassName="owner-history" />}
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
        <div className="pt-update-popup-holder">
          {fileUploadingStatus == "uploading" &&
            <div><LoadingIndicator></LoadingIndicator>
            </div>}
          <span className="pt-update-static-content">
            <span>
              <Label label="PTUPNO_OWNER_NAME" labelStyle={{ color: 'rgba(0, 0, 0, 0.604138)', fontSize: "14px" }}></Label>
              <Label label={propertyNumbers && propertyNumbers.name} labelStyle={{ color: 'rgba(0, 0, 0, 0.875)', fontSize: "16px" }} ></Label>
            </span>
            <span style={{ marginRight: '15%' }}>
              <Label label="PTUPNO_CURR_NO" labelStyle={{ color: 'rgba(0, 0, 0, 0.873302)', fontSize: "14px" }}></Label>
              <Label label={propertyNumbers && propertyNumbers.mobileNumber} labelStyle={{ color: 'rgba(0, 0, 0, 0.875)', fontSize: "16px" }} ></Label>
            </span>
          </span>
          <div>
            <span style={{
              height: "100px",
              display: "flex",
              alignItems: "center"
            }}> <TextField type={fields[key].type}
              placeholder={getLocaleLabels(fields[key].placeholder, fields[key].placeholder)}
              floatingLabelText={getLocaleLabels(fields[key].floatingLabelText, fields[key].floatingLabelText)}
              className={fields[key].className}/*  */
              pattern={fields[key].pattern}
              errorText={fields[key].errorMessage}
              style={fields[key].style}
              disabled={fields[key].disabled}
              value={fields[key].value}
              onChange={(e) => this.handleChange(key, e.target.value)}></TextField>
            </span>
            {process.env.REACT_APP_NAME !== "Citizen" && <div>
              {documents.map((document, ind) => {
                return (<div>
                  <Label label={document.code} labelStyle={{ color: '#000000DF', fontSize: "16px" }} />
                  <Label label="PT_ATTACH_RESTRICTIONS_SIZE" />
                  <div className={"pt-document-upload-holder"}>
                    <div class="pt-update-button-wrap">
                      <label class="pt-update-upload-button" for={document.documentType} >{getLocaleLabels("EVENTS_UPLOAD_FILE", "EVENTS_UPLOAD_FILE")}</label>
                      <input id={document.documentType} accept={document.inputProps.accept} type="file" onChange={(e) => handleFileUpload(e, (...props) => { let i = ind; this.setDocFileDetails(i, ...props); }, { inputProps: document.inputProps, maxFileSize: document.maxFileSize, moduleName: "PT" }, () => {
                        this.setState({ fileUploadingStatus: "uploading", clickedElement: document.documentType });
                      })}
                        onClick={event => {
                          event.target.value = null;
                        }} />
                    </div>
                    {document.fileName && <Label className="pt-uploaded-document-label" label={document.fileName} />}
                  </div>

                  {/* <button type="button" className={"button-upload-link"} onClick={(e) => handleFileUpload(e, this.setDocFileDetails, { inputProps: document.inputProps, maxFileSize: document.maxFileSize, moduleName: "PT" }, () => {
                    this.setState({ fileUploadingStatus: "uploading" });
                  })} ><Label label="EVENTS_UPLOAD_FILE"></Label></button> */}

                </div>)
              })}
            </div>}
            {process.env.REACT_APP_NAME !== "Citizen" && <div className="pt-update-verify-container" style={{ marginTop: '25px' }}>
              <button type="button" disabled={this.state.verifyButton} style={{ width: '100%' }} className={"button-verify-link"} onClick={() => this.validateAndCreate()} ><Label label="PTUPNO_VER_NO"></Label></button>
            </div>}
            {process.env.REACT_APP_NAME === "Citizen" && <div className="pt-update-send-otp-container">
              <button type="button" disabled={this.state.otpButton} style={{ marginRight: "5%" }} className={"button-verify-link"} onClick={() => this.validateAndSendOtp()} ><Label label="PTUPNO_SENDOTP"></Label></button>
              {this.state.otpButton && <React.Fragment><Label label="CORE_ANOTHER_OTP" labelStyle={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: "14px" }}></Label>
                <Counter updateState={() => this.setState({ otpButton: false })} otpButton={this.state.otpButton} />
                <Label label="CS_RESEND_SECONDS" labelStyle={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: "14px" }}></Label></React.Fragment>}
            </div>}
          </div>
          {process.env.REACT_APP_NAME === "Citizen" && <div className="pt-update-verify-container">
            <span style={{
              height: "100px",
              display: "flex",
              alignItems: "center"
            }}> <TextField type={fields[key1].type}
              placeholder={getLocaleLabels(fields[key].placeholder, fields[key1].placeholder)}
              floatingLabelText={getLocaleLabels(fields[key1].floatingLabelText, fields[key1].floatingLabelText)}
              className={fields[key1].className}/*  */
              pattern={fields[key1].pattern}
              errorText={fields[key1].errorMessage}
              style={fields[key1].style}
              value={fields[key1].value}
              disabled={fields[key1].disabled}
              onChange={(e) => this.handleChange(key1, e.target.value)}></TextField>
            </span>
            <button type="button" disabled={this.state.verifyButton} style={{ width: '100%' }} className={"button-verify-link"} onClick={() => this.validateAndCreate()} ><Label label="PTUPNO_VERUPD_NO"></Label></button>
          </div>}
        </div>
        {errorMessage && <div className={type == "ERROR" ? "error-comp-second-num" : "success-comp-second-num"}><Label label={errorMessage}></Label></div>}
      </Dialog>
    )
  }
}
