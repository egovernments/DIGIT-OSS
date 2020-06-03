import { Button } from "components";
import PTHeader from "egov-ui-kit/common/common/PTHeader";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import AcknowledgementCard from '../AcknowledgementCard';
import generateReceipt from "./Components/receipt";
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
  let assessmentNumber;
  if (receiptDetails && receiptDetails.propertyDetails && receiptDetails.propertyDetails[0]) {
    assessmentNumber = receiptDetails.propertyDetails[0].assessmentNumber;
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
      <div
        id="tax-wizard-buttons"
        className="wizard-footer col-sm-10"
        style={{ textAlign: "right" }}
      >
        <div className="button-container " style={{ float: "right" }}>
          <Button
            label={<Label buttonLabel={true}
              label='PT_ASSESS_PAY_FOR_NEW_YEAR'
              color="#fe7a51" />
            }
            className="pmt-status-back"
            onClick={() => { toggleYearDialogue(assessmentNumber) }}
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51" }}
            buttonStyle={{ border: "1px solid #fe7a51" }}
            style={{}}
          />
          <Button
            label={<Label buttonLabel={true} label='PT_DOWNLOAD_RECEIPT' color="#fff" />}
            className="pmt-status-next"
            backgroundColor="#fe7a51"
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fff" }}
            buttonStyle={{ border: 0 }}
            onClick={() => {
              generateReceipt("pt-reciept-citizen", receiptDetails, {}, receiptImageUrl)
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
