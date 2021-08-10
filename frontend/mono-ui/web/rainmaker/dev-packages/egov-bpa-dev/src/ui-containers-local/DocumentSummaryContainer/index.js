import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.scss";
import SingleDocDetailCard from "../../ui-molecules-local/SingleDocDetailCard";
import Grid from "@material-ui/core/Grid";

class DocumentSummaryContainer extends Component {
  render() {
    const { data, documentData, bpaDetails, ...rest } = this.props;
    return (
      <React.Fragment>
        <Grid container={true} {...rest}>
          {documentData &&
            Object.values(documentData).map((item, key) => {
              return (
                <SingleDocDetailCard
                  docItem={item}
                  docIndex={key}
                  key={key.toString()}
                  {...rest}
                />
              );
            })}
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const data = get(
    screenConfiguration.preparedFinalObject,
    ownProps.sourceJsonPath,
    []
  );
  const documentData = get(
    screenConfiguration.preparedFinalObject,
    "documentDetailsUploadRedux",
    []
  );
  const bpaDetails = get(screenConfiguration.preparedFinalObject, "BPA", {});
  return { data, documentData, bpaDetails };
};

export default connect(mapStateToProps, null)(DocumentSummaryContainer);
