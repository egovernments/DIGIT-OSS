import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class EstimateCardContainer extends Component {
  render() {
    return <FeesEstimateCard estimate={this.props.estimate} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const fees = [
    {
      name: { labelName: "NOC Fee", labelKey: "NOC_ESTIMATE_NOC_FEE" },
      value: 5000,
      info: { labelName: "NOC Fee", labelKey: "NOC_ESTIMATE_NOC_FEE" }
    },
    {
      name: { labelName: "Rebate", labelKey: "NOC_ESTIMATE_REABATE" },
      value: -500,
      info: { labelName: "NOC Fee", labelKey: "NOC_ESTIMATE_NOC_FEE" }
    },
    {
      name: { labelName: "Penalty", labelKey: "NOC_ESTIMATE_PENALTY" },
      value: 0,
      info: { labelName: "NOC Fee", labelKey: "NOC_ESTIMATE_NOC_FEE" }
    }
  ];
  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "NOC_FEE_ESTIMATE_HEADER" },
    fees
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
