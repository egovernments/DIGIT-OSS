import React from "react";
import { connect } from "react-redux";
// import "./index.css";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import { getLocaleLabels, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const styles = {
  root: {
    color: 'rgba(0, 0, 0, 0.54)',
    // fontSize: '16px',
    fontWeight: 400,
    lineHeight: '1.375em',
  },
  linkDetails : {
    color: 'rgb(245, 117, 66)',
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: 'Roboto',
    lineHeight: '19px',
    letterSpacing: '0.67px',
    textDecoration : 'none',
    '&:hover':{
      color: 'rgb(245, 117, 66)',
    },
    '&:active':{
      color: 'rgb(245, 117, 66)',
    },
    '&:visited':{
      color: 'rgb(245, 117, 66)',
    },
    '&:link':{
      color: 'rgb(245, 117, 66)',
    }

  },
};

class downloadFile extends React.Component {
  render() {
    const { label = {}, linkDetail= {}, classes, localizationLabels  } = this.props;
    let { value } = this.props;
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      localizationLabels
    );
    let translatedLabelLink = getLocaleLabels(
      linkDetail.labelName,
      linkDetail.labelKey,
      localizationLabels
    );
    let downloadLink;
    if(value && !value.includes("https") && window.location.href.includes("https")) {
      downloadLink = value.replace(/http/g, "https")
    }
    value = downloadLink ? downloadLink : value;
    return (
      <div>
        <div className={classes.root}>{translatedLabel}</div>
        <a className={classes.linkDetails} href={value} target="_blank"  rel="noopener noreferrer">
          {translatedLabelLink}
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let { jsonPath, value } = ownprops;
  const { screenConfiguration, app } = state;
  const { localizationLabels } = app;
  const { preparedFinalObject } = screenConfiguration;
  let fieldValue =
    value === undefined ? get(preparedFinalObject, jsonPath) : value;
  return { value: fieldValue, localizationLabels };
};

export default withStyles(styles)(connect(mapStateToProps)(downloadFile));
