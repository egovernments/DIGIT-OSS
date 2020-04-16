
import { httpRequest } from "egov-ui-kit/utils/api";
import { getUserInfo, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { getPropertyLink } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createReceiptDetails } from "../../../PaymentStatus/Components/createReceipt";
import generateReceipt from "../../../PaymentStatus/Components/receipt";

const styles = {
  customWidth: {
    width: 120,
    backgroundColor: "#F0F0F0",
    height: "25px",
    paddingLeft: "10px",
  },
  iconStyle: { top: "-13px", fill: "#484848", width: "35px" },
  underlineStyle: { display: "none" },
  hintStyle: { color: "#484848", top: 0 },
};

class DropDown extends Component {
  state = {
    imageUrl: "",
  };

  componentDidMount = () => {
    const { item } = this.props;
    const tenantId = item && item.tenantId;
    tenantId &&
      this.convertImgToDataURLviaCanvas(
        this.createImageUrl(tenantId),
        function (data) {
          this.setState({ imageUrl: data });
        }.bind(this)
      );
  };

  convertImgToDataURLviaCanvas = (url, callback, outputFormat) => {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  };

  createImageUrl = (tenantId) => {
    return `https://s3.ap-south-1.amazonaws.com/pb-egov-assets/${tenantId}/logo.png`;
  };

  onSelectFieldChange = (event, key, payload, imageUrl) => {
    const { generalMDMSDataById, history, item, singleAssessmentByStatus = [] } = this.props;
    const { downloadReceipt } = this;
    const callReciept = (isEmployeeReceipt = false) => {
      item.consumerCode = item.propertyId;
      downloadReceipt(item, generalMDMSDataById, isEmployeeReceipt, imageUrl);
    }
    switch (payload) {
      case "Re-Assess":
        history &&
          history.push(getPropertyLink(item.propertyId, item.tenantId, "reassess", item.financialYear, item.latestAssessmentNumber)
          );
        break;
      case "Download Receipt":
        //Need 1. Property, 2. Property Details, 3. receiptdetails
        //&& assessment.receiptInfo.status == "Paid"
        // call receiptcreate func
        callReciept()

        break;
      case "Download Citizen Receipt":
        callReciept()
        break;
      case "Download Employee Receipt":
        callReciept(true)

        break;
      case "Complete Payment":
        history &&
          history.push(getPropertyLink(item.propertyId, item.tenantId, "assess", item.financialYear, item.assessmentNo, true)
          );
        break;
    }
  };

  downloadReceipt = async (item, generalMDMSDataById, isEmployeeReceipt, imageUrl) => {
    const queryObj = [{ key: "tenantId", value: item.tenantId }, { key: "consumerCode", value: item.consumerCode }];//todo Consumer code uniqueness

    try {
      const payload = await httpRequest("/collection-services/receipts/_search", "_search", queryObj, {}, [], { ts: 0 });
      // const lastAmount = payload && payload.Receipt && get(payload.Receipt[0], "Bill[0].billDetails[0].totalAmount");
      // const totalAmountBeforeLast =
      //   payload &&
      //   payload.Receipt &&
      //   payload.Receipt.reduce((acc, curr, index) => {
      //     if (index !== 0) {
      //       acc += get(curr, "Bill[0].billDetails[0].amountPaid");
      //     }
      //     return acc;
      //   }, 0);
      // const totalAmountToPay = lastAmount + totalAmountBeforeLast;
      // const totalAmountPaid =
      //   payload &&
      //   payload.Receipt &&
      //   payload.Receipt.reduce((acc, curr) => {
      //     acc += get(curr, "Bill[0].billDetails[0].amountPaid");
      //     return acc;
      //   }, 0);
      payload.Receipt.forEach((receipt) => {
        if (item.propertyDetails.receiptInfo.fromPeriod == receipt.Bill[0].billDetails[0].fromPeriod) {
          const receiptDetails =
            payload &&
            payload.Receipt && createReceiptDetails(
              item.property,
              item.propertyDetails,
              receipt,
              item.localizationLabels,
              item.cities,
              get(receipt, "Bill[0].billDetails[0].totalAmount"),
              get(receipt, "Bill[0].billDetails[0].amountPaid")
            );
          localStorageSet("rd-propertyId", item.propertyId);
          localStorageSet("rd-assessmentNumber", item.propertyDetails.assessmentNumber);
          receiptDetails && generateReceipt("pt-reciept-citizen", receiptDetails, generalMDMSDataById, imageUrl, isEmployeeReceipt, { itemData: item, property: item.property, receipt: payload.Receipt });
        }
      })

    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { item } = this.props;
    const { imageUrl } = this.state;
    const userType = getUserInfo() && JSON.parse(getUserInfo()).type;
    return (
      <div style={{ float: 'right' }}>
        <SelectField
          autoWidth={true}
          className="pt-action-dropDown"
          hintText={<Label label="PT_SELECT_ACTION" />}
          underlineStyle={styles.underlineStyle}
          iconStyle={styles.iconStyle}
          style={styles.customWidth}
          hintStyle={styles.hintStyle}
          onChange={(event, key, payload) => this.onSelectFieldChange(event, key, payload, imageUrl)}
        >
          {userType === "CITIZEN" && item.status !== "Pending" && <MenuItem value="Download Receipt" primaryText={<Label label="PT_DOWNLOAD_RECEIPT" />} />}
          {userType === "EMPLOYEE" && item.status !== "Pending" && <MenuItem value="Download Citizen Receipt" primaryText={<Label label="PT_DOWNLOAD_CITIZEN_RECEIPT" />} />}
          {userType === "EMPLOYEE" && item.status !== "Pending" && <MenuItem value="Download Employee Receipt" primaryText={<Label label="PT_DOWNLOAD_EMPLOYEE_RECEIPT" />} />}
          {(item.status === "Paid" || item.status === "Partially Paid" || item.status === "Pending") && (
            <MenuItem value="Re-Assess" primaryText={<Label label="PT_RE_ASSESS" />} />
          )}
          {item.status === "Pending" && <MenuItem value="Complete Payment" primaryText={<Label label="PT_COMPLETE_PAYMENT" />} />}
          {item.status === "Partially Paid" && <MenuItem value="Complete Payment" primaryText={<Label label="PT_COMPLETE_PAYMENT" />} />}
        </SelectField>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  const { properties } = state;

  const { singleAssessmentByStatus = [] } = properties || {};


  return {
    singleAssessmentByStatus
  };
};



export default connect(
  mapStateToProps,
  null
)(DropDown);
