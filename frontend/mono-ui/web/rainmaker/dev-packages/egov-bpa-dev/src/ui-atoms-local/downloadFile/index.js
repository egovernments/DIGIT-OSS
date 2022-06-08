import React from "react";
import { connect } from "react-redux";
//import "./index.css";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";

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

class downloadFile extends React.Component {
  render() {
    const { label, linkDetail, value, classes } = this.props;
    return (
      <div>
        <div className={classes.root}>{label}</div>
        <a className={classes.linkDetails} href={value} target="_blank">
          {linkDetail}
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { jsonPath, value } = ownprops;
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  let fieldValue =
    value === undefined ? get(preparedFinalObject, jsonPath) : value;
  return { value: fieldValue };
};

export default withStyles(styles)(connect(mapStateToProps)(downloadFile));
