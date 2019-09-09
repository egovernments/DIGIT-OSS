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
  let { estimateCardData } = applyScreenMdmsData || [];

  estimateCardData = estimateCardData.map(fees => {
    if (fees.name && fees.name.labelKey)
      fees.name.labelKey = getTransformedLocale(fees.name.labelKey);
    if (fees.info && fees.info.labelKey)
      fees.info.labelKey = getTransformedLocale(fees.name.labelKey);
    return fees;
  });
  // const estimateCardData = get(
  //   preparedFinalObject,
  //   "applyScreenMdmsData.estimateCardData",
  //   []
  // );
  // const fees = [
  //   {
  //     name: { labelName: "UC Fee", labelKey: "UC_ESTIMATE_NOC_FEE" },
  //     value: 5000,
  //     info: { labelName: "UC Fee", labelKey: "UC_ESTIMATE_NOC_FEE" }
  //   },
  //   {
  //     name: { labelName: "Rebate", labelKey: "UC_ESTIMATE_REABATE" },
  //     value: -500,
  //     info: { labelName: "UC Fee", labelKey: "UC_ESTIMATE_NOC_FEE" }
  //   },
  //   {
  //     name: { labelName: "Penalty", labelKey: "UC_ESTIMATE_PENALTY" },
  //     value: 0,
  //     info: { labelName: "UC Fee", labelKey: "UC_ESTIMATE_NOC_FEE" }
  //   }
  // ];
  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "UC_FEE_ESTIMATE_HEADER" },
    fees: estimateCardData
    // extra: [
    //   { textLeft: "Last Date for Rebate (20% of TL)" },
    //   {
    //     textLeft: "Penalty (10% of TL) applicable from"
    //   },
    //   { textLeft: "Additional Penalty (20% of TL) applicable from" }
    // ]
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
