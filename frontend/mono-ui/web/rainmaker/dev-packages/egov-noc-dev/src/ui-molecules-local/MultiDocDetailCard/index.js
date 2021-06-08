import React from "react";
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
//import "./index.css";

const styles = {
  whiteCard: {
    // maxWidth: 250,
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingLeft: 8,
    paddingRight: 0,
    paddingTop: 3,
    paddingBottom: 10,
    marginRight: 16,
    marginTop: 16,
    marginBottom:16,
    // marginBottom:4,
    display: "inline-flex",
  },
  // subtext: {
  //   // paddingTop: 7,
  //   display: "inline-flex",
  // },
  body2: {
    wordWrap: "break-word",
  },
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
  marginLeft:"7px",
};

const titleStyle = {
  fontSize: "12px",
  fontWeight: "500",
  color: "rgba(120,110,110,0.64)",
  fontFamily: "Roboto",
  marginLeft:"7px",
  
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
function MultiDocDetailCard(props) {
  const { classes, docItem, docIndex, name, ...rest } = props;
  return (
    <React.Fragment>
      <Grid container spacing={3}  className={
                props.backgroundGrey
                  ? classNames(classes.whiteCard, "background-grey")
                  : classes.whiteCard
              }>
        <Grid
          item={true}
          xs={12}
          className={
            props.backgroundGrey
              ? classNames(classes.whiteCard, "background-grey")
              : classes.whiteCard
          }
        >
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", fontSize: "12px" }}
            >
            <LabelContainer
              labelKey={getTransformedLocale(docItem.documentCode)}
            />
              {/* {getTransformedLocale(docItem.documentCode)} */}            
              {(!docItem.documents || docItem.documents == null || docItem.documents.length == 0) && (docItem.required) ? (
              <span>{requiredIcon}</span>) : (null)}
              
            </Typography>
            
          </Grid>
          <Grid item xs={3}>
            {!docItem.documents || docItem.documents == null || docItem.documents.length == 0 ? (
              <Typography
                variant="subtitle1"
                style={{ fontWeight: "bold", fontSize: "12px" }}
              >
                <LabelContainer
                  labelKey={getTransformedLocale("NOC_NO_DOCUMENTS_UPLOADED_LABEL")}
                />
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={3}>
            {docItem.readOnly ? (
              ""
            ) : (
              <Button
                color="primary"
                style={{ float: "right" }}
                onClick={() => props.toggleEditClick(docIndex)}
              >
                <LabelContainer
                  labelKey={getTransformedLocale("BPA_UPLOAD_LABEL")}
                />
              </Button>
            )}
          </Grid>
          
        </Grid>
        {docItem.documents &&
            docItem.documents.length > 0 &&
            docItem.documents.map((doc) => {
              return(<React.Fragment 
              >
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={titleStyle}
                  >
                    File
                  </Typography>
                  <LightTooltip title={!doc.name ? "" : doc.name} arrow>
                  <div style={fontStyle}>
                    {!doc.name ? "" : doc.name}
                  </div>
                  </LightTooltip>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={titleStyle}
                  >
                    Uploaded By
                  </Typography>
                  <LightTooltip title={!(doc.additionalDetails && doc.additionalDetails.uploadedBy) ? "" : doc.additionalDetails.uploadedBy} arrow>
                  <div style={fontStyle}>
                    {!(doc.additionalDetails && doc.additionalDetails.uploadedBy) ? "" : doc.additionalDetails.uploadedBy}
                  </div>
                  </LightTooltip>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={titleStyle}
                  >
                    Uploaded Date
                  </Typography>
                  
                  <div style={fontStyle}>
                    {!(doc.additionalDetails && doc.additionalDetails.uploadedTime) ? "" :convertEpochToDate(doc.additionalDetails.uploadedTime)}
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    color="primary"
                    onClick={() => {
                      window.open(doc.link, "_blank");
                    }}
                  >
                    View File
                  </Button>
                </Grid>
              </React.Fragment>)
            })}
      </Grid>
    </React.Fragment>
  );
}

MultiDocDetailCard.propTypes = {};

export default withStyles(styles)(MultiDocDetailCard);
