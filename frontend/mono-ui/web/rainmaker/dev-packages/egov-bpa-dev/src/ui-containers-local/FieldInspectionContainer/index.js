import React, { Component } from "react";
import { FeildInspectionCards } from "../../ui-containers-local";
import { connect } from "react-redux";
import get from "lodash/get";

class FieldInspectionContainer extends Component {
  render() {
    const { data, documentData, ...rest } = this.props;
    return (
      <FeildInspectionCards data={data} documentData={documentData} {...rest} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const data = get(
    screenConfiguration.preparedFinalObject,
    ownProps.jsonPath,
    []
  );
  return { data };
};

export default connect(
  mapStateToProps,
  null
)(FieldInspectionContainer);
