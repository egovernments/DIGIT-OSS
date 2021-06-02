import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

const styles = {
  whiteCard: {
    backgroundColor: "#FFFFFF",
    padding : 10,
    marginTop: 16
  },
  subtext: {
    paddingTop: 10
  },
  subtext1: {
    paddingTop: 5
  },
  body2: {
    wordWrap: "break-word"
  },
  documentIcon: {
    backgroundColor: "#f2f2f2",
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
};

const documentTitle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "16px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "19px"
};

function FeildInspectionCards(props) {
  const { classes, data, ...rest } = props;
  return (
    <Grid container={true} {...rest}> 
      { data && data.map((item, key) => { 
        return ( 
        <Grid 
        container={true}
          className={ props.backgroundGrey ? 
          classNames(classes.whiteCard, "background-grey") : classes.whiteCard } 
        > 
          <Grid item={true} xs={2} sm={1} className={classes.iconDiv} className={classes.subtext1}>  
            <div className={classes.documentIcon}> 
              <span>{key + 1}</span> 
            </div> 
          </Grid> 
          <Grid  
          item={true}
          xs={10}
          sm={5}
          md={4}
          align="left"
          > 
          <Typography className={classes.body2} className={classes.subtext}>
              <LabelContainer
                labelKey={getTransformedLocale(item.question)}
              />
            </Typography>
          </Grid> 
          <Grid item={true} xs={12} sm={6} md={4} className={classes.subtext}> 
            <Typography className={classes.body2}>
              <LabelContainer
                labelKey={`BPA_ADD_HOC_CHARGES_POPUP_BUTTON_${item.value}`}
              />
            </Typography> 
          </Grid> 
          <Grid 
            item={true}
            xs={12}
            sm={12}
            md={3} align="left" 
            className={classes.descriptionDiv} > 
            <LabelContainer 
              labelKey={getTransformedLocale("BPA_REMARKS")} 
              style={styles.documentName} 
            /> 
            <Typography variant="caption"> 
              <LabelContainer labelKey={item.remarks} />
            </Typography> 
          </Grid> 
        </Grid> );
        })} 
        </Grid>
  );
}

export default withStyles(styles)(FeildInspectionCards);
