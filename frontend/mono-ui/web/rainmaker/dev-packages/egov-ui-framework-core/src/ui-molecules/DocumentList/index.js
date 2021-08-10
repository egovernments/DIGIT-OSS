import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LabelContainer from "../../ui-containers/LabelContainer";

const styles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginBottom: "16px"
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
    lineHeight: "24px"
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white"
  }
});

const DocumentList = props => {
  const { classes, documents } = props;

  return (
    <div>
      {documents.map((document, key) => {
        return (
          <div className={classes.documentContainer}>
            <Grid container={true}>
              <Grid item={true} xs={2} sm={1} align="center">
                {document.uploaded ? (
                  <div className={classes.documentSuccess}>
                    <Icon>
                      <i class="material-icons">done</i>
                    </Icon>
                  </div>
                ) : (
                  <div className={classes.documentIcon}>
                    <span>{key + 1}</span>
                  </div>
                )}
              </Grid>
              <Grid item={true} xs={6} sm={6} align="left">
                <Typography variant="body2">
                  {document.name}
                  {document.required && (
                    <sup style={{ color: "#E54D42" }}>*</sup>
                  )}
                </Typography>
                <Typography variant="caption">
                  <LabelContainer
                    labelName="Only .jpg and .pdf files. 500kb max file size."
                    labelKey="TL_APPROVAL_UPLOAD_SUBHEAD"
                  />
                </Typography>
              </Grid>
              <Grid item={true} xs={12} sm={5} align="right">
                {document.uploaded ? (
                  <Button
                    variant="outlined"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(5, 5, 5, 0.11999999731779099)"
                    }}
                  >
                    {document.fileName}
                    <Icon style={{ color: "#E54D42", marginLeft: "16px" }}>
                      <i class="material-icons">highlight_off</i>
                    </Icon>
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary">
                    ADD FILE
                  </Button>
                )}
              </Grid>
            </Grid>
          </div>
        );
      })}
    </div>
  );
};

DocumentList.propTypes = {
  classes: PropTypes.object.isRequired,
  documents: PropTypes.object.isRequired
};

export default withStyles(styles)(DocumentList);
