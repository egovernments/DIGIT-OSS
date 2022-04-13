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
import AcknowledgementCard from 'egov-ui-kit/common/propertyTax/AcknowledgementCard';
import PTHeader from "egov-ui-kit/common/common/PTHeader";
import ActionFooter from "egov-ui-kit/common/common/ActionFooter";

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
      // const payload = await httpRequest(
      //   "pt-calculator-v2/propertytax/_getbill",
      //   "_create",
      //   queryObj,
      //   {}
      // );
      // this.setState({ bill: payload["Bill"] });
    } catch (e) {
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
      { key: "propertyIds", value: match.params.propertyId },
      { key: "tenantId", value: match.params.tenantId }
    ]);
    this.getBill(tenantId, assessmentNumber, assessmentYear, propertyId);
  };

  redirectToReview = () => {
    const { match, history, assessmentNumber } = this.props;
    const {
      assessmentYear,
      propertyId,
      tenantId
    } = match.params;
    history.push(
      `/property-tax/assessment-form?assessmentId=${assessmentNumber}&purpose=assess&proceedToPayment=true&propertyId=${propertyId}&tenantId=${tenantId}&FY=${assessmentYear}`
    );
  };

  render() {

    const { bill } = this.state;
    const { txnAmount, assessmentYear, propertyId } = this.props.match.params;
    const amountPaid = get(bill[0], "billDetails[0].totalAmount");
    const {
      cities,
      selProperty,
      latestPropertyDetails,
      extraData
    } = this.props;
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

    const headerValue = "(" + assessmentYear + ")";

    const header = "PT_PAYMENT_HEADER";
    const subHeaderValue = propertyId;
    const { loading } = this.props;
    return (
      <Screen loading={loading}>
        <div>
          <div
            key={1}
            style={{ marginBottom: "50px" }}
            className=" col-md-12 col-lg-12"
          >
            <PTHeader
              header={header}
              subHeaderTitle="PT_PROPERTY_PTUID"
              headerValue={headerValue}
              subHeaderValue={subHeaderValue}
            />
            <AcknowledgementCard
              acknowledgeType="failed"
              receiptHeader="PT_TRANSACTION_AMT"
              messageHeader="PT_OOPS"
              message="PT_FAILURE_MESSAGE"
              receiptNo={txnAmount ? 'Rs:' + txnAmount : txnAmount}
            />
            {/* <AcknowledgementCard acknowledgeType='success'  messageHeader='' message='' receiptHeader='PT_APPLICATION_NO_LABEL' receiptNo=''/> */}
          </div>
          <ActionFooter
            key={2}
            label2="PT_RETRY_BUTTON"
            primaryAction={this.redirectToReview}
          />
        </div>
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { properties, common } = state || {};
  const { cities } = common;
  const { propertiesById, loading } = properties;
  const selProperty =
    propertiesById && propertiesById[ownProps.match.params.propertyId];
  const latestPropertyDetails =
    selProperty && getLatestPropertyDetails(selProperty.propertyDetails);
  let assessmentNumber;
  if (latestPropertyDetails && latestPropertyDetails.assessmentNumber) {
    assessmentNumber = latestPropertyDetails.assessmentNumber;
  }
  return { selProperty, cities, latestPropertyDetails, loading, assessmentNumber };
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
