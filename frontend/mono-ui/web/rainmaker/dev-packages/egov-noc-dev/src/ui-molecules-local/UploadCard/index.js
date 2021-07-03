import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { getTransformedLocale, handleFileUpload } from "egov-ui-framework/ui-utils/commons";
import React from "react";
import { UploadMultipleFile } from "../../ui-molecules-local";

const requiredIcon = (
  <sup style={{ color: "#5b5b5b", fontSize: "12px", paddingLeft: "5px" }}>
    *
  </sup>
);
const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    paddingBottom: "5px",
  },
  documentName: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px",
  },
  dropdownLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px",
  },
};
const cellstyle = {
  display: "flex",
  alignItems: "center",
};
const themeStyles = (theme) => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px",
  },
  documentCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px",
  },
  documentSubCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "10px",
    border: "#d6d6d6",
    borderStyle: "solid",
    borderWidth: "1px",
  },
  documentIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px",
    marginTop: "20px",
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white",
    marginTop: "20px",
  },
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px",
  },
  input: {
    display: "none",
  },
  iconDiv: {
    display: "flex",
    alignItems: "center",
  },
  descriptionDiv: {
    alignItems: "center",
    display: "block",
    marginTop: "20px",
  },
  formControl: {
    minWidth: 250,
    padding: "0px",
  },
  fileUploadDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: "5px",
    "& input": {
      display: "none",
    },
  },
});
const documentTitle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "16px",
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
  lineHeight: "19px",
  background: "#FEF0E7",
  borderRadius: "20px",
  padding: 10,
  display: "inline-block",
};

const documentTitlegrey = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "16px",
  fontWeight: 400,
  background: "#F3F4F6",
  borderRadius: "50%",
  padding: "10px 18px",
  display: "inline-block",
};
const relpos = {
  position: "relative",
};
const UploadCard = (props) => {
  const {
    classes,
    docItem,
    docIndex,
    name,
    jsonPath,
    ids,
    specificStyles,
    ...rest
  } = props;
  let forUpBtn = specificStyles ? specificStyles : "upload_btn";
  return (
    <Grid container={true} style={relpos}>
      {(!props.isFromPreview) ?
        <Grid item={true} xs={4} sm={2} md={1} className={cellstyle}>
          {docItem && docItem.documents && docItem.documents.length > 0 ?
            <div className={classes.documentSuccess}>
              <Icon>
                <i class="material-icons">done</i>
              </Icon>
            </div>
            :
            <div className={classes.documentIcon}>
              <span>{docIndex + 1}</span>
            </div>
          }
        </Grid> : ""
      }
      {/* <Grid item={true} xs={4} sm={2} md={1} className={cellstyle}>
        {(!props.isFromPreview)?<div>
          {docItem && docItem.documents && docItem.documents.length > 0 ? (
          <div className={classes.documentSuccess}>
            <Icon>
              <i class="material-icons">done</i>
            </Icon>
          </div>
        ) : (
          <div className={classes.documentIcon}>
            <span>{docIndex + 1}</span>
          </div>
        )}
        </div>:""}
       
      </Grid> */}
      <Grid
        item={true}
        xs={10}
        sm={5}
        md={4}
        align="left"
        className={classes.descriptionDiv}
      >
        <LabelContainer
          labelKey={getTransformedLocale(docItem.name)}
          style={styles.documentName}
        />
        {docItem.required && requiredIcon}
        <Typography variant="caption">
          <LabelContainer
            labelKey={getTransformedLocale("TL_UPLOAD_RESTRICTIONS")}
          />
        </Typography>
      </Grid>
      <Grid item={true} xs={12} sm={6} md={4}>
        {docItem.dropDownValues ? (
          <TextFieldContainer
            select={true}
            label={{
              labelKey: getTransformedLocale(docItem.dropDownValues.label),
            }}
            placeholder={{ labelKey: docItem.dropDownValues.label }}
            data={docItem.dropDownValues.menu}
            optionValue="code"
            optionLabel="label"
            autoSelect={true}
            required={(!docItem.isDocumentRequired) ? docItem.required : docItem.isDocumentRequired}
            onChange={(event) => props.handleChange(docIndex, event)}
            jsonPath={`${jsonPath}[${docIndex}].dropDownValues.value`}
          />
        ) : ""}
      </Grid>
      <Grid
        item={true}
        xs={12}
        sm={12}
        // md={6}
        className={classes.fileUploadDiv}
        style={{ display: "inline-block !important;" }}
      >
        <div className={forUpBtn}>

          <UploadMultipleFile
            classes={props.classes}
            handleFileUpload={(e) =>
              handleFileUpload(e, props.handleDocument, props)
            }
            uploaded={docItem && docItem.documents ? true : false}
            removeDocument={(uploadedDocIndex) => props.removeDocument(docIndex, uploadedDocIndex)}
            documents={docItem && docItem.documents}
            onButtonClick={() => props.onUploadClick(docIndex)}
            inputProps={props.inputProps}
            buttonLabel={props.buttonLabel}
            id={ids ? ids : `doc-${docIndex + 1}`}
          />
        </div>
      </Grid>
      {(props.isFromPreview) ?
        <Grid item xs={12}>
          <Button
            color="primary"
            style={{ float: "right" }}
            onClick={() => props.toggleEditClick(docIndex)}
          >
          <LabelContainer
            labelKey={getTransformedLocale("NOC_PREVIEW_LABEL")}
          />
          </Button>
        </Grid> : ""
      }
    </Grid>
  );
};

UploadCard.propTypes = {
};

export default withStyles(themeStyles)(UploadCard);
