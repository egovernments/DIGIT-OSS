import React from "react";
import { Card, Icon, Divider } from "components";
import Screen from "modules/common/common/Screen";
import Label from "utils/translationNode";
import FloatingActionButton from "material-ui/FloatingActionButton";
import "./index.css";

const labelStyle = {
  fontWeight: 500,
};

const Reciept = () => {
  return (
    <Screen>
      <div className="reciept-top-cont">
        <FloatingActionButton className="floating-button" style={{ boxShadow: 0 }} backgroundColor="#22b25f">
          <Icon action="navigation" name="check" />
        </FloatingActionButton>
        <Label containerStyle={{ paddingTop: "30px" }} label="PT_RECEIPT_SUCCESS_MESSAGE" labelStyle={{ color: "#484848", fontWeight: 500 }} />
      </div>
      <Card
        textChildren={
          <div>
            <div className="row reciept-label">
              <Label className="col-xs-6" label="PT_RECEIPT_RECEIPT_NO" />
              <Label className="col-xs-6" labelStyle={labelStyle} label="PT03-067-03-117" />
            </div>
            <div className="row reciept-label">
              <Label className="col-xs-6" label="PT_RECEIPT_DATE" />
              <Label className="col-xs-6" labelStyle={labelStyle} label="24.04.18" />
            </div>
            <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0 }} />
            <div className="row reciept-label">
              <Label className="col-xs-6" label="PT_RECEIPT_OWNER_NAME" />
              <Label className="col-xs-6" labelStyle={labelStyle} label="Harishikesh Anand" />
            </div>
            <div className="row reciept-label">
              <Label className="col-xs-6" label="PT_RECEIPT_PROPERTY" />
              <Label className="col-xs-6" labelStyle={labelStyle} label="EB-154, Maya Enclave Harinagar, KT Marg Amritsar - 53" />
            </div>
            <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0 }} />
            <div className="row reciept-label">
              <Label className="col-xs-6" label="PT_RECEIPT_PAYMENT_TERM" />
              <Label className="col-xs-6" labelStyle={labelStyle} label="2017-18" />
            </div>
            <div className="row reciept-label">
              <Label className="col-xs-6" label="PT_RECEIPT_AMOUNT_PAID" />
              <Label className="col-xs-6" labelStyle={labelStyle} label="1432.47" />
            </div>
          </div>
        }
      />
    </Screen>
  );
};

export default Reciept;
