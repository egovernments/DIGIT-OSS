import React from "react";
import { Card, Divider, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { ActionFooter } from "modules/common";
import FloatingActionButton from "material-ui/FloatingActionButton";
import generateReceipt from "./Components/receiptsPDF";
import "../../FormWizard/components/WizardComponent/index.css";
import "./index.css";

const labelStyle = {
  fontWeight: 500
};

const PaymentStatus = ({
  generalMDMSDataById,
  noExistingPropertyId,
  receiptUIDetails,
  receiptDetails,
  floatingButtonColor,
  icon,
  messages,
  extraData,
  buttons,
  primaryAction
}) => {
  return (
    <div>
      <div
        style={{ marginBottom: "50px" }}
        className="col-md-offset-4 col-lg-offset-4 col-md-4 col-lg-4"
      >
        <Card
          className="pt-success-receipt "
          textChildren={
            <div className="pt-reciept-top-cont">
              <FloatingActionButton
                className="floating-button"
                style={{ boxShadow: 0 }}
                backgroundColor={floatingButtonColor}
              >
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
            style={{
              padding: "12px 12px 12px 12px",
              border: "1px solid #5aaafa",
              borderLeft: "5px solid #5aaafa"
            }}
          >
            <div>
              <Icon action="action" name="info" color="#30588c" />
            </div>
            <div style={{ marginLeft: 16 }}>
              <Label
                fontSize="14px"
                color="#484848"
                label="PT_FORM1_INFORMATION_MESSAGE"
              />
            </div>
          </div>
        )}
        {receiptUIDetails &&
        receiptUIDetails.propertyInfo.length &&
        receiptUIDetails.receiptInfo.length ? (
          <Card
            className="pt-success-receipt"
            textChildren={
              <div>
                {receiptUIDetails &&
                  receiptUIDetails.propertyInfo &&
                  receiptUIDetails.propertyInfo.map(item => {
                    return (
                      <div className="row pt-reciept-label">
                        <Label
                          className="col-xs-6"
                          label={item.key}
                          dynamicArray={
                            item.dynamicArray ? item.dynamicArray : []
                          }
                        />
                        <span>:</span>
                        <Label
                          className="col-xs-6"
                          labelStyle={labelStyle}
                          label={item.value || "NA"}
                        />
                      </div>
                    );
                  })}
                <Divider
                  className="reciept-divider"
                  inset={true}
                  lineStyle={{ marginLeft: 0, marginRight: 0 }}
                />
                {receiptUIDetails &&
                  receiptUIDetails.receiptInfo &&
                  receiptUIDetails.receiptInfo.map(item => {
                    return (
                      <div className="row pt-reciept-label">
                        <Label className="col-xs-6" label={item.key} />
                        <span>:</span>
                        <Label
                          className="col-xs-6"
                          labelStyle={labelStyle}
                          label={
                            item.value || item.value === "0" ? item.value : "NA"
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            }
          />
        ) : null}
        {receiptDetails && receiptDetails.ReceiptNo && (
          <div
            onClick={() => {
              generateReceipt(
                "pt-reciept-citizen",
                receiptDetails,
                generalMDMSDataById
              );
            }}
          >
            <Label
              label="PT_DOWNLOAD_RECEIPT"
              color="#fe7a51"
              labelStyle={{
                textAlign: "center",
                fontWeight: 500,
                fontSize: "16px",
                cursor: "pointer"
              }}
            />
          </div>
        )}
      </div>
      <ActionFooter label2={buttons.button2} primaryAction={primaryAction} />
    </div>
  );
};

export default PaymentStatus;
