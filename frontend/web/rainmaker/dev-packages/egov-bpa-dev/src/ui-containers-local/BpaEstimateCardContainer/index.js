import React, { Component } from "react";
import { BpaFeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class BpaEstimateCardContainer extends Component {
  render() {
    return <BpaFeesEstimateCard estimate={this.props.estimate} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);
  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "NOC_FEE_ESTIMATE_HEADER" },
    fees
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(BpaEstimateCardContainer);
