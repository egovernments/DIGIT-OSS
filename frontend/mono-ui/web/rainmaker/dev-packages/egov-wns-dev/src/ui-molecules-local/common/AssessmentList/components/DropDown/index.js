import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Label from "egov-ui-kit/utils/translationNode";
import { httpRequest } from "egov-ui-kit/utils/api";
import createReceipt from "../../../PaymentStatus/Components/createReceipt";
import generateReceipt from "../../../PaymentStatus/Components/receiptsPDF";
import React from "react";

const styles = {
  customWidth: {
    width: 120,
    backgroundColor: "#F0F0F0",
    height: "25px",
    paddingLeft: "10px"
  },
  iconStyle: { top: "-13px", fill: "#484848", width: "35px" },
  underlineStyle: { display: "none" },
  hintStyle: { color: "#484848", top: 0 }
};

const onSelectFieldChange = (event, key, payload, history, item) => {
  switch (payload) {
    case "Re-Assess":
      history &&
        history.push(
          `/property-tax/assessment-form?FY=${
            item.financialYear
          }&assessmentId=${item.assessmentNo}&isReassesment=true&propertyId=${
            item.propertyId
          }&tenantId=${item.tenantId}`
        );
      break;
    case "Download Receipt":
      //Need 1. Property, 2. Property Details, 3. receiptdetails
      // call receiptcreate func
      downloadReceipt(item);
      break;
    case "Complete Payment":
      history &&
        history.push(
          `/property-tax/assessment-form?FY=${
            item.financialYear
          }&assessmentId=${item.assessmentNo}&isReassesment=true&propertyId=${
            item.propertyId
          }&tenantId=${item.tenantId}`
        );
      break;
  }
};

const downloadReceipt = async item => {
  const queryObj = [
    { key: "tenantId", value: item.tenantId },
    { key: "consumerCode", value: item.consumerCode }
  ];
  try {
    const payload = await httpRequest(
      "/collection-services/receipts/_search",
      "_search",
      queryObj,
      {},
      [],
      { ts: 0 }
    );
    const receiptDetails =
      payload &&
      payload.Receipt &&
      createReceipt(
        item.property,
        item.propertyDetails,
        payload.Receipt[0],
        item.localizationLabels,
        item.cities
      );
    receiptDetails && generateReceipt("pt-reciept-citizen", receiptDetails);
  } catch (e) {
  }
};

const DropDown = ({ history, item }) => {
  return (
    <div>
      <SelectField
        autoWidth={true}
        className="pt-action-dropDown"
        hintText={<Label label="PT_SELECT_ACTION" />}
        underlineStyle={styles.underlineStyle}
        iconStyle={styles.iconStyle}
        style={styles.customWidth}
        hintStyle={styles.hintStyle}
        onChange={(event, key, payload) =>
          onSelectFieldChange(event, key, payload, history, item)
        }
      >
        <MenuItem value="Download Receipt" primaryText="Download Receipt" />
        <MenuItem value="Re-Assess" primaryText="Re-Assess" />
        {item.status === "Partially Paid" && (
          <MenuItem value="Complete Payment" primaryText="Complete Payment" />
        )}
      </SelectField>
    </div>
  );
};

export default DropDown;
