import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import DocumentList from "../DocumentList";
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

class DocumentListContainer extends Component {
  render() {
    const { ...rest } = this.props;
    return <DocumentList { ...rest }  />;
  }
}

const mapStateToProps = state => {
  let ptDocumentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsContract",
    []
  );
  return { ptDocumentsList };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(DocumentListContainer)
);
