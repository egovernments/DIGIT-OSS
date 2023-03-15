import React, { Component } from "react";
import FeesEstimateCard  from "../../ui-molecules-local/FeeEstimateCard"

import { connect } from "react-redux";
import get from "lodash/get";

class EstimateCardContainer extends Component {
  render() {
    return <FeesEstimateCard estimate={this.props.estimate} searchBillDetails={this.props.searchBillDetails} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const fees = get( state, "screenConfiguration.preparedFinalObject.AmendmentTemp[0].estimateCardData", {});
  const searchBillDetails = get( state, "screenConfiguration.preparedFinalObject.searchBillDetails-bill", {});
  
  const amountType = get (state.screenConfiguration.preparedFinalObject, "BILL.AMOUNTTYPE", "");
  const estimate = {
    fees,
    extra: [
      { textLeft: "The approval note amount will be automatically applied in the upcoming bill" },
    ],
    amountType
  };
  return { estimate ,searchBillDetails};
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
