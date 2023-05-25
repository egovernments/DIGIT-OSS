import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import DocumentList from "../../ui-molecules-local/DocumentList";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    // display: "none !important",
    //For QA Automation
    position: "absolute",
    right: 0
  }
});

class DocumentListContainer extends Component {
  render() {
    const { uploadedDocuments, ...rest } = this.props;
    return <DocumentList uploadedDocsInRedux={uploadedDocuments} {...rest} />;
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const documents = get(
    screenConfiguration.preparedFinalObject,
    "LicensesTemp[0].applicationDocuments",
    []
  );
  const uploadedDocuments = get(
    screenConfiguration.preparedFinalObject,
    "LicensesTemp[0].uploadedDocsInRedux",
    {}
  );
  const tenantId = get(
    screenConfiguration.preparedFinalObject,
    "Licenses[0].tenantId",
    ""
  );
  const { preparedFinalObject } = screenConfiguration || {};
  return { documents, tenantId, uploadedDocuments, preparedFinalObject };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(DocumentListContainer)
);
