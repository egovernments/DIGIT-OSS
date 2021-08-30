import React, { Component } from "react";
import { connect } from "react-redux";
import { Screen } from "modules/common";
import { Icon } from "components";
import PaymentStatus from "egov-ui-kit/common/propertyTax/PaymentStatus";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { createReceiptUIInfo } from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/createReceipt";
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";

const buttons = {
  button2: "Retry"
};

const icon = <Icon action="navigation" name="close" />;

class PaymentFailure extends Component {
  state = {
    bill: [],
    failureMessage: ""
  };

  failureMessages = () => {
    return {
      Message1: (
        <Label
          containerStyle={{ paddingTop: "10px" }}
          fontSize={16}
          label={"PT_OOPS"}
          labelStyle={{ color: "#484848", fontWeight: 500 }}
        />
      ),
      Message2: (
        <Label
          containerStyle={{ paddingTop: "10px" }}
          fontSize={16}
          label={
            this.state.failureMessage
              ? this.state.failureMessage
              : "PT_RECEIPT_FAILURE_MESSAGE"
          }
          labelStyle={{ color: "#484848", fontWeight: 500 }}
        />
      )
    };
  };

  // failureMessages = ;

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
      this.setState({ failureMessage: "Bill generation error." });
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
    const { assessmentNumber, assessmentYear } = match.params;
    history.push(
      `/property-tax/assessment-form?FY=${assessmentYear}&assessmentId=${assessmentNumber}&isReassesment=true`
    );
  };

  render() {
    const { bill } = this.state;
    const { txnAmount } = this.props.match.params;

    const { cities, selProperty } = this.props;
    const receiptUIDetails =
      selProperty &&
      bill &&
      cities &&
      txnAmount &&
      createReceiptUIInfo(selProperty, bill[0], cities, txnAmount, false);
    return (
      <Screen>
        <PaymentStatus
          receiptUIDetails={receiptUIDetails}
          floatingButtonColor="#e74c3c"
          icon={icon}
          messages={this.failureMessages()}
          buttons={buttons}
          primaryAction={this.redirectToReview}
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
  return { selProperty, cities };
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
