
import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import groupBy from "lodash/groupBy";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import Tooltip from '@material-ui/core/Tooltip';
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 12
  }
}))(Tooltip);
const styles = {
 
  body2: {
    wordWrap: "break-word",
  },

  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    paddingBottom: "5px"
  },
  whiteCard: {
    // maxWidth: 250,
    width: "100%",
    backgroundColor: "#FFFFFF",
    // paddingLeft: 8,
    paddingRight: 0,
    paddingTop: 3,
    paddingBottom: 10,
    marginRight: 16,
    marginTop: 8,
    marginBottom:16,
    // marginBottom:4,
    display: "inline-flex",
  },
  fontStyle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    wordBreak: "break-word",
    width: "90%",
    marginRight: "7px"
    // width:150,
    // overflow: "hidden", 
    // whiteSpace: "nowrap",
    // textOverflow: "ellipsis",
    // marginLeft:"7px",
  },
  labelStyle: {
    position: "relative",
    fontFamily: "Roboto",
    fontSize: 14,
    letterSpacing: 0.6,
    padding: "5px 0px",
    display: "inline-block"
  },  
  underlineStyle: {
    position: "absolute",
    bottom: -1,
    borderBottom: "2px solid #FE7A51",
    width: "100%"
  },
  dividerStyle : {
    borderBottom: "1px solid rgba(5, 5, 5, 0.12)",
    width: "100%"
  },
  documentContainer: {
   backgroundColor: "#FFFFFF",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  }
};
const marginStyle1 = {
  fontSize: "14px",
  fontWeight: "500",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  maxWidth: "12%",
};
const cellstyle = {
  display: "flex",
  alignItems: "center",
  maxWidth: "0% !important",
  fontSize: "10px",
};
const style = {
  display: "inline-grid",
  alignItems: "center",
  maxWidth: "22.8%",
};
const tablestyle = {
  display: "inline-grid",
  alignItems: "end",
  maxWidth: "23.3%",
  marginTop: "auto",
};

const documentTitle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "12px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "19px",
};

const documentTitleOrg = {
  color: "#CA9382",
  fontFamily: "Roboto",
  fontSize: "12px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "8px",
  background: "#FEF0E7",
  borderRadius: "20px",
  padding: 10,
  display: "inline-block",
};

const documentTitlegrey = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "12px",
  fontWeight: 400,
  background: "#F3F4F6",
  borderRadius: "50%",
  padding: "10px 18px",
  display: "inline-block",
};

const fontStyle = {
  fontSize: "12px",
  fontWeight: "500",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  width:150,
  overflow: "hidden", 
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  // marginLeft:"7px",
};

const titleStyle = {
  fontWeight: "bold",
  fontSize: "12px",
  // fontWeight: "500",
  // color: "rgba(120,110,110,0.64)",
  fontFamily: "Roboto",
  // marginLeft:"7px",
  
};

const marginStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
};

const floatStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  width: "100%",
};
const requiredIcon = (
  <sup style={{ color: "#5b5b5b", fontSize: "12px", paddingLeft: "5px" }}>
    *
  </sup>
);

class NocData extends Component {
  render(){
  const { classes, docItem, docIndex, name, ...rest } = this.props;

  let submittedOn,
  satus = "";
  if(docItem.additionalDetails){
    if(docItem.additionalDetails.submissionDetails){
      submittedOn = docItem.additionalDetails.submissionDetails.SubmittedOn;
    }
    satus = docItem.additionalDetails.applicationStatus
  }
  return (
    <React.Fragment>
      <Grid container spacing={3}
                      className={
                      this.props.backgroundGrey
                      ? classNames(styles.whiteCard, "background-grey")
                      : styles.whiteCard
                      }
                    >
                    <Grid item xs={3}>
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "bold", fontSize: "12px" , paddingTop: "12px" }}
                      >
                      <LabelContainer
                        labelKey="BPA_STATUS_LABEL"
                      />
                      </Typography>
                        <LabelContainer
                            labelKey={getTransformedLocale(satus)}
                            style={styles.fontStyle}
                        />
                      {/* <div style={styles.fontStyle}>
                        {satus}
                      </div> */}
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                      variant="subtitle1"
                      style={{ fontWeight: "bold", fontSize: "12px", paddingTop: "12px" }}
                    >
                      <LabelContainer
                        labelKey="BPA_SUDMITTED_ON_LABEL"
                      />
                      </Typography>
                      <div style={styles.fontStyle}>
                      {!(submittedOn) ? "NA" :convertEpochToDate(JSON.parse(submittedOn))}
                      </div>
                    </Grid>
                    
                    {satus === "APPROVED" || satus === "REJECTED" || satus === "AUTO_APPROVED" || satus === "AUTO_REJECTED" ? (
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "bold", fontSize: "12px", paddingTop: "12px" }}
                      >
                        <LabelContainer
                        labelKey="BPA_APPROVED_REJECTED_ON_LABEL"
                      />
                      </Typography>
                      <div style={styles.fontStyle}>
                        {!satus ? "NA" : docItem.additionalDetails && convertEpochToDate(docItem.additionalDetails.approvedRejectedOn)}
                      </div>
                    </Grid>          
                    ) : (
                        ""
                    )}
                    </Grid>
                    <Grid item xs={12}>                    
                    <div style={styles.dividerStyle}>
                      <div style={ styles.labelStyle}>
                        <span>
                          <LabelContainer
                            labelKey="BPA_COMMON_DOCS"
                          />
                          </span>
                        <div style={styles.underlineStyle} />
                      </div>
                    </div>
                    </Grid> 
    </React.Fragment>
  );
}
}

NocData.propTypes = {};

export default withStyles(styles)(NocData);
