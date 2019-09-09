import React, { Component } from "react";
import { connect } from "react-redux";
import { Screen } from "modules/common";
import { Icon } from "components";
import get from "lodash/get";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import PaymentStatus from "egov-ui-kit/common/propertyTax/PaymentStatus";
import { createReceiptUIInfo } from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/createReceipt";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";

const buttons = {
  button2: "Retry"
};

const failureMessages = billAmount => {
  return {
    Message1: (
      <Label
        containerStyle={{ paddingTop: "30px" }}
        fontSize={16}
        label={"PT_OOPS"}
        labelStyle={{ color: "#484848", fontWeight: 500 }}
      />
    ),
    Message2: (
      <div>
        <div>
          {billAmount ? (
            <div
              class="rainmaker-displayInline"
              style={{ justifyContent: "center" }}
            >
              <Label
                containerStyle={{ paddingTop: "10px" }}
                fontSize={16}
                label={"PT_RECEIPT_FAILURE_MESSAGE1"}
                labelStyle={{ color: "#484848", fontWeight: 500 }}
              />
              <Label
                containerStyle={{ paddingTop: "10px", margin: "0 3px" }}
                fontSize={16}
                label={billAmount}
                labelStyle={{ color: "#484848", fontWeight: 500 }}
              />
              <Label
                containerStyle={{ paddingTop: "10px" }}
                fontSize={16}
                label={"PT_RECEIPT_FAILURE_MESSAGE2"}
                labelStyle={{ color: "#484848", fontWeight: 500 }}
              />
            </div>
          ) : (
            <div>
              <Label
                containerStyle={{ paddingTop: "10px" }}
                fontSize={16}
                label={"PT_RECEIPT_FAILURE_MESSAGE"}
                labelStyle={{ color: "#484848", fontWeight: 500 }}
              />
            </div>
          )}
        </div>
        <Label
          containerStyle={{ paddingTop: "10px" }}
          fontSize={16}
          label={"PT_RECEIPT_FAILURE_MESSAGE3"}
          labelStyle={{ color: "#484848", fontWeight: 500 }}
        />
      </div>
    )
  };
};

const icon = <Icon action="navigation" name="close" />;

class PaymentFailure extends Component {
  state = {
    bill: []
  };
  getBill = async (tenantId, assessmentNumber, assessmentYear, propertyId) => {
    const queryObj = [
      { key: "propertyId", value: propertyId },
      { key: "assessmentNumber", value: assessmentNumber },
      { key: "assessmentYear", value: assessmentYear },
      { key: "tenantId", value: tenantId }
    ];
    try {
      const payload = await httpRequest(
        "pt-calculator-v2/propertytax/_getbill",
        "_create",
        queryObj,
        {}
      );
      this.setState({ bill: payload["Bill"] });
    } catch (e) {
      console.log(e);
    }
    return;
  };
  componentDidMount = () => {
    const { fetchProperties, match } = this.props;
    const {
      tenantId,
      assessmentNumber,
      assessmentYear,
      propertyId
    } = match.params;
    fetchProperties([
      { key: "ids", value: match.params.propertyId },
      { key: "tenantId", value: match.params.tenantId }
    ]);
    this.getBill(tenantId, assessmentNumber, assessmentYear, propertyId);
  };

  redirectToReview = () => {
    const { match, history } = this.props;
    const {
      assessmentNumber,
      assessmentYear,
      propertyId,
      tenantId
    } = match.params;
    history.push(
      `/property-tax/assessment-form?FY=${assessmentYear}&assessmentId=${assessmentNumber}&isReassesment=true&propertyId=${propertyId}&tenantId=${tenantId}`
    );
  };

  render() {
    const { bill } = this.state;
    const { txnAmount } = this.props.match.params;
    const amountPaid = get(bill[0], "billDetails[0].totalAmount");
    const { cities, selProperty, latestPropertyDetails, extraData } = this.props;
    const receiptUIDetails =
      selProperty &&
      bill &&
      cities &&
      txnAmount &&
      createReceiptUIInfo(
        selProperty,
        bill[0],
        cities,
        txnAmount,
        false,
        amountPaid,
        latestPropertyDetails
      );
    const messages = failureMessages(txnAmount);
    return (
      <Screen>
        <PaymentStatus
          receiptUIDetails={receiptUIDetails && receiptUIDetails}
          floatingButtonColor="#e74c3c"
          icon={icon}
          messages={messages}
          buttons={buttons}
          primaryAction={this.redirectToReview}
          extraData={extraData}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { properties, common } = state || {};
  const { cities } = common;
  const { propertiesById } = properties;
  const selProperty =
    propertiesById && propertiesById[ownProps.match.params.propertyId];
  const latestPropertyDetails =
    selProperty && getLatestPropertyDetails(selProperty.propertyDetails);
  return { selProperty, cities, latestPropertyDetails };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProperties: queryObject => dispatch(fetchProperties(queryObject))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentFailure);
