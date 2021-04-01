import React from "react";
import { List } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import PastPaymentDetailsForm from "./PastPaymentDetailsForm";

const getListItems = items =>
  items.map((item, index) => ({
    primaryText: (
      <Label
        label={item.primaryText}
        fontSize="16px"
        color="#484848"
        labelStyle={{ fontWeight: 500 }}
      />
    ),
    secondaryText: (
      <Label
        label={item.secondaryText}
        fontSize="14px"
        color="#484848"
        containerStyle={{ marginTop: "15px" }}
      />
    ),
    route: item.route,
    nestedItems: [
      {
        secondaryText: (
          <PastPaymentDetailsForm
            formKey={`pastPayments`}
            path="PropertyTaxPay"
            extraFields={{ year: { value: item.primaryText } }}
            index={index}
            copyName={`pastPayments_${index}`}
          />
        ),
        disabled: true,
        listContainerStyle: { padding: 0 }
      }
    ]
  }));

const PastPaymentList = ({ history, items, header, subHeader }) => (
  <div>
    <Label
      label={header}
      containerStyle={{ paddingBottom: "11px", marginLeft: "16px" }}
      dark={true}
      bold={true}
      labelStyle={{ letterSpacing: 0 }}
      fontSize={"20px"}
    />
    <Label
      label={subHeader}
      containerStyle={{ paddingBottom: "5px", marginLeft: "16px" }}
      dark={true}
      bold={true}
      labelStyle={{ letterSpacing: 0 }}
      fontSize={"16px"}
    />
    <List
      items={getListItems(items)}
      primaryTogglesNestedList={true}
      onItemClick={(item, index) => {
        history && history.push(item.route);
      }}
    />
  </div>
);

export default PastPaymentList;
