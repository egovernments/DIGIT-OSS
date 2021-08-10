import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

class EstimateCardContainer extends Component {
  render() {
    return <FeesEstimateCard estimate={this.props.estimate} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { preparedFinalObject } = state.screenConfiguration || {};
  const { applyScreenMdmsData } = preparedFinalObject || {};
  let estimateCardData  =  get(
    state.screenConfiguration.preparedFinalObject,
    ownProps.sourceJsonPath,
    []
  );
    const payStatus = estimateCardData.payStatus;
    estimateCardData =estimateCardData && estimateCardData.map(fees => {
    if (fees.name && fees.name.labelKey)
      fees.name.labelKey = getTransformedLocale(fees.name.labelKey);
    if (fees.info && fees.info.labelKey)
      fees.info.labelKey = getTransformedLocale(fees.name.labelKey);
    return fees;
  });
 
  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "UC_FEE_ESTIMATE_HEADER" },
    fees: estimateCardData,
    payStatus:payStatus
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
