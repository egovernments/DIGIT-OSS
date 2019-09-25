import PTHeader from "egov-ui-kit/common/common/PTHeader";
import React from "react";
import { Card, Divider, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import ActionFooter from "../../common/ActionFooter";
import FloatingActionButton from "material-ui/FloatingActionButton";
import generateReceipt from "./Components/receiptsPDF";
import AcknowledgementCard from '../AcknowledgementCard';
import "./index.css";

const labelStyle = {
  fontWeight: 500,
};
const PaymentStatus = ({ assessmentYear,
  toggleYearDialogue,
  generalMDMSDataById,
  noExistingPropertyId,
  receiptUIDetails,
  receiptDetails = {},
  propertyId,
  floatingButtonColor,
  icon,
  messages,
  buttons,
  primaryAction,
  tenantId,
  receiptImageUrl,
}) => {
  const { ReceiptNo } = receiptDetails;
  if (!assessmentYear) {
    if (receiptDetails && receiptDetails.propertyDetails && receiptDetails.propertyDetails[0]) {
      assessmentYear = receiptDetails.propertyDetails[0].financialYear;
    }
  }
  const headerValue = '(' + assessmentYear + ')';
  const header = 'PT_PAYMENT_HEADER';
  const subHeaderValue = propertyId;
  let paymentHeader = 'PT_PROPERTY_PAYMENT_SUCCESS';
  process.env.REACT_APP_NAME !== "Citizen" ? paymentHeader = 'PT_PROPERTY_PAYMENT_SUCCESS' : paymentHeader = 'PT_PAYMENT_SUCCESS_MESSAGE'
  let paymentMessage = 'PT_PROPERTY_PAYMENT_NOTIFICATION';
  process.env.REACT_APP_NAME !== "Citizen" ? paymentMessage = 'PT_PROPERTY_PAYMENT_NOTIFICATION' : paymentMessage = 'PT_PROPERTY_PAYMENT_CITIZEN_NOTIFICATION'
  return (
    <div>
      <div key={1} style={{ marginBottom: "50px" }} className=" col-md-12 col-lg-12">
        <PTHeader header={header} subHeaderTitle='PT_PROPERTY_PTUID' headerValue={headerValue} subHeaderValue={subHeaderValue} />
        <AcknowledgementCard acknowledgeType='success' receiptHeader="PT_PMT_RCPT_NO" messageHeader={paymentHeader} message={paymentMessage} receiptNo={ReceiptNo} />
      </div>
      <ActionFooter key={2} label2='PT_DOWNLOAD_RECEIPT' secondaryAction={toggleYearDialogue} label1='PT_ASSESS_PAY_FOR_NEW_YEAR' primaryAction={() => {
        generateReceipt("pt-reciept-citizen", receiptDetails, {}, receiptImageUrl);
      }} />
    </div>
  );
};

export default PaymentStatus;
