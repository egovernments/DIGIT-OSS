import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
const styles = {
  root: {
    color: 'rgba(0, 0, 0, 0.54)',
    // fontSize: '16px',
    fontWeight: 400,
    lineHeight: '1.375em',
  },
  linkDetails : {
    // color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: 'Roboto',
    lineHeight: '19px',
    letterSpacing: '0.67px',
    textDecoration : 'none'
  }
};

class ComparisionLink extends React.Component {
  render() {
    const { comparisonDetails } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h2" style={{ textAlign: "center", fontWeight:"bold" }} gutterBottom>
          Comparison Report
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Few parameters in the diagram are deviating more than the allowed
          value from the permit eDCR to that of the OC eDCR. You will not be
          allowed to create an application.
          <div style={{padding:"10"}}>
            Please refer the comparison report from this link to get the
            violation details.
          </div>
          <br />
          
        </Typography>
        <Typography variant="subtitle1" style={{padding:"10"}} gutterBottom>
          <a
            href={comparisonDetails ? comparisonDetails.report : ""}
            target="_blank"
          >
            {comparisonDetails ? comparisonDetails.report : ""}
          </a>
        </Typography>
        <Typography variant="subtitle1" style={{ textAlign: "center", padding:"10"}} gutterBottom>
        You can contact ULB for further queries.
        </Typography>

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration, app } = state;
  const { localizationLabels } = app;
  const { preparedFinalObject } = screenConfiguration;
  const { comparisonDetails } = preparedFinalObject;

  return {
    localizationLabels,
    comparisonDetails: comparisonDetails ? comparisonDetails : false,
  };
};

export default withStyles(styles)(connect(mapStateToProps)(ComparisionLink));
