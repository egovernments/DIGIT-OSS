import PTHeader from "egov-ui-kit/common/common/PTHeader";
import React from "react";
import { Card, Divider, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import ActionFooter from "../../common/ActionFooter";
import FloatingActionButton from "material-ui/FloatingActionButton";
import generateReceipt from "./Components/receiptsPDF";
import AcknowledgementCard from "../AcknowledgementCard";
import "./index.css";

const labelStyle = {
  fontWeight: 500,
};

const PaymentStatus = ({
  assessmentYear,
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
  console.log("ReceiptNo", receiptDetails.ReceiptNo);
  console.log("this.props", {
    assessmentYear,
    generalMDMSDataById,
    noExistingPropertyId,
    receiptUIDetails,
    receiptDetails,
    propertyId,
    floatingButtonColor,
    icon,
    messages,
    buttons,
    primaryAction,
    tenantId,
    receiptImageUrl,
  });
  console.log("ReceiptNo", receiptDetails);
  if (!assessmentYear) {
    if (receiptDetails && receiptDetails.propertyDetails && receiptDetails.propertyDetails[0]) {
      assessmentYear = receiptDetails.propertyDetails[0].financialYear;
    }
  }
  const headerValue = "(" + assessmentYear + ")";

  const header = "PT_PAYMENT_HEADER";
  const subHeaderValue = propertyId;
  let paymentMessage = "PT_PROPERTY_PAYMENT_NOTIFICATION";
  process.env.REACT_APP_NAME !== "Citizen" ? (paymentMessage = "PT_PROPERTY_PAYMENT_NOTIFICATION") : (paymentMessage = "PT_PAYMENT_SUCCESS_MESSAGE");
  return (
    <div>
      <div key={1} style={{ marginBottom: "50px" }} className=" col-md-12 col-lg-12">
        {/* <Card
          className="pt-success-receipt "
          textChildren={
            <div className="pt-reciept-top-cont">
              <FloatingActionButton className="floating-button" style={{ boxShadow: 0 }} backgroundColor={floatingButtonColor}>
                {icon}
              </FloatingActionButton>
              <div>{messages.Message1}</div>
              <div>{messages.Message2}</div>
            </div>
          }
        />
        {noExistingPropertyId && (
          <div
            className="rainmaker-displayInline"
            style={{ padding: "12px 12px 12px 12px", border: "1px solid #5aaafa", borderLeft: "5px solid #5aaafa" }}
          >
            <div key={"1_1"}>
              <Icon action="action" name="info" color="#30588c" />
            </div>
            <div key={"1_2"} style={{ marginLeft: 16 }}>
              <Label fontSize="14px" color="#484848" label="PT_FORM1_INFORMATION_MESSAGE" />
            </div>
          </div>
        )}
        {receiptUIDetails && receiptUIDetails.propertyInfo.length && receiptUIDetails.receiptInfo.length ? (
          <Card
            className="pt-success-receipt"
            textChildren={
              <div key={"1_3"}>
                {receiptUIDetails &&
                  receiptUIDetails.propertyInfo &&
                  receiptUIDetails.propertyInfo.map((item) => {
                    return (
                      <div className="row pt-reciept-label">
                        <Label className="col-xs-6" label={item.key} dynamicArray={item.dynamicArray ? item.dynamicArray : []} />
                        <span>:</span>
                        <Label className="col-xs-6" labelStyle={labelStyle} label={item.value || "NA"} />
                      </div>
                    );
                  })}
                <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0 }} />
                {receiptUIDetails &&
                  receiptUIDetails.receiptInfo &&
                  receiptUIDetails.receiptInfo.map((item) => {
                    return (
                      <div className="row pt-reciept-label">
                        <Label className="col-xs-6" label={item.key} />
                        <span>:</span>
                        <Label className="col-xs-6" labelStyle={labelStyle} label={item.value || item.value === "0" ? item.value : "NA"} />
                      </div>
                    );
                  })}
              </div>
            }
          />
        ) : null} */}
        {/* {receiptDetails && receiptDetails.ReceiptNo && (
          <div
            onClick={() => {
              generateReceipt("pt-reciept-citizen", receiptDetails, generalMDMSDataById, receiptImageUrl);
            }}
          >
            <Label
              label="PT_DOWNLOAD_RECEIPT"
              color="#fe7a51"
              labelStyle={{ textAlign: "center", fontWeight: 500, fontSize: "16px", cursor: "pointer" }}
            />
            {noExistingPropertyId && (
              <div
                className="rainmaker-displayInline"
                style={{ padding: "12px 12px 12px 12px", border: "1px solid #5aaafa", borderLeft: "5px solid #5aaafa" }}
              >
                <div key={"1_1"}>
                  <Icon action="action" name="info" color="#30588c" />
                </div>
                <div key={"1_2"} style={{ marginLeft: 16 }}>
                  <Label fontSize="14px" color="#484848" label="PT_FORM1_INFORMATION_MESSAGE" />
                </div>
              </div>
            )}
            {receiptUIDetails && receiptUIDetails.propertyInfo.length && receiptUIDetails.receiptInfo.length ? (
              <Card
                className="pt-success-receipt"
                textChildren={
                  <div key={"1_3"}>
                    {receiptUIDetails &&
                      receiptUIDetails.propertyInfo &&
                      receiptUIDetails.propertyInfo.map((item) => {
                        return (
                          <div className="row pt-reciept-label">
                            <Label className="col-xs-6" label={item.key} dynamicArray={item.dynamicArray ? item.dynamicArray : []} />
                            <span>:</span>
                            <Label className="col-xs-6" labelStyle={labelStyle} label={item.value || "NA"} />
                          </div>
                        );
                      })}
                    <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0 }} />
                    {receiptUIDetails &&
                      receiptUIDetails.receiptInfo &&
                      receiptUIDetails.receiptInfo.map((item) => {
                        return (
                          <div className="row pt-reciept-label">
                            <Label className="col-xs-6" label={item.key} />
                            <span>:</span>
                            <Label className="col-xs-6" labelStyle={labelStyle} label={item.value || item.value === "0" ? item.value : "NA"} />
                          </div>
                        );
                      })}
                  </div>
                }
              />
            ) : null}
            {receiptDetails && receiptDetails.ReceiptNo && this.ptReceiptAvailableHook() && (
              <div
                onClick={() => {
                  generateReceipt("pt-reciept-citizen", receiptDetails, generalMDMSDataById, receiptImageUrl, false, extraData);
                }}
              >
                <Label
                  label="PT_DOWNLOAD_RECEIPT"
                  color="#fe7a51"
                  labelStyle={{ textAlign: "center", fontWeight: 500, fontSize: "16px", cursor: "pointer" }}
                />
              </div>
            )}
          </div>
        )} */}

        <PTHeader header={header} subHeaderTitle="PT_PROPERTY_PTUID" headerValue={headerValue} subHeaderValue={subHeaderValue} />
        <AcknowledgementCard
          acknowledgeType="success"
          receiptHeader="PT_PMT_RCPT_NO"
          messageHeader="PT_PROPERTY_PAYMENT_SUCCESS"
          message={paymentMessage}
          receiptNo={ReceiptNo}
        />
        {/* <AcknowledgementCard acknowledgeType='success'  messageHeader='' message='' receiptHeader='PT_APPLICATION_NO_LABEL' receiptNo=''/> */}
      </div>
      <ActionFooter
        key={2}
        label2="PT_DOWNLOAD_RECEIPT"
        secondaryAction={toggleYearDialogue}
        label1="PT_ASSESS_PAY_FOR_NEW_YEAR"
        primaryAction={() => {
          generateReceipt("pt-reciept-citizen", receiptDetails, {}, receiptImageUrl);
        }}
      />
    </div>
  );
};

export default PaymentStatus;
