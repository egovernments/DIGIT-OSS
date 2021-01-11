import React, { Component } from "react";
import FeesEstimateCard  from "../../ui-molecules-local/FeeEstimateCard"

import { connect } from "react-redux";
import get from "lodash/get";

class EstimateCardContainer extends Component {
  render() {
    return <FeesEstimateCard estimate={this.props.estimate} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const fees = JSON.parse(`[{ "name": { "labelName": "Water Tax", "labelKey": "Water Tax" }, "value": 1000, "info": "" }, { "name": { "labelName": "Water Cess", "labelKey": "Water Cess  " }, "value": 200, "info": "" }, { "name": { "labelName": "Intrest", "labelKey": "Intrest" }, "value": 100, "info": "" },{ "name": { "labelName": "Penalty", "labelKey": "Penalty" }, "value": 100, "info": "" }]`);
  
  const estimate = {
    fees,
    extra: [
      { textLeft: "The approval note amount will be automatically applied in the upcoming bill" },
    ]
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
