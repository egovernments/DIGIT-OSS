import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { NocList } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none !important"
  }
});

class NocListContainer extends Component {
  render() {
    const { ...rest } = this.props;
    return <NocList {...rest} />;
  }
}

const mapStateToProps = state => {
  let documentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.nocDocumentsContract",
    []
  );
  let bpaDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA",
    []
  )
  return { documentsList, bpaDetails };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(NocListContainer)
);
