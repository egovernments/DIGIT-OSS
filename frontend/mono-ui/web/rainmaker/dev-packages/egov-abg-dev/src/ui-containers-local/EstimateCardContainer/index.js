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
  const { preparedFinalObject } = state.screenConfiguration || {};
  const { applyScreenMdmsData } = preparedFinalObject || {};
  const { estimateCardData } = applyScreenMdmsData || {};
  // const fees = [
  //   {
  //     name: {
  //       labelName: "Advertisement Tax",
  //       labelKey: "ABG_ADVERTISEMENT_TAX_LABEL"
  //     },
  //     value: 5000,
  //     info: {
  //       labelName: "Advertisement Tax",
  //       labelKey: "ABG_ADVERTISEMENT_TAX_INFO"
  //     }
  //   },
  //   {
  //     name: { labelName: "Rebate", labelKey: "ABG_REBATE_LABEL" },
  //     value: -500,
  //     info: { labelName: "Rebate", labelKey: "ABG_REBATE_INFO" }
  //   },
  //   {
  //     name: { labelName: "Penalty", labelKey: "ABG_PENALTY_LABEL" },
  //     value: 0,
  //     info: { labelName: "Penalty", labelKey: "ABG_PENALTY_INFO" }
  //   }
  // ];
  const estimate = {
    header: { labelName: "Bill Details", labelKey: "ABG_BILL_DETAILS_HEADER" },
    fees: estimateCardData
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
