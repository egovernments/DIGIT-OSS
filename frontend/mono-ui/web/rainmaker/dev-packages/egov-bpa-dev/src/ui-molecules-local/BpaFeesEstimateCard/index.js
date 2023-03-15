import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import { LabelContainer } from "egov-ui-framework/ui-containers";

const styles = {
  card: {
    backgroundColor: "rgb(242, 242, 242)",
    boxShadow: "none",
    borderRadius: 0
  },
  whiteCard: {
    padding: 18,
    marginTop: 24,
    boxShadow: "none",
    borderRadius: 0
  },
  whiteCardText: {
    padding: 8,
    color: "rgba(0, 0, 0, 0.6000000238418579)",
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.65
  },
  toolTipIcon: {
    color: "rgba(0, 0, 0, 0.3799999952316284)",
    paddingLeft: 5,
    position: "relative",
    top: -2
  },
  bigheader: {
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "34px",
    fontWeight: 500,
    letterSpacing: "1.42px",
    lineHeight: "41px"
  },
  taxStyles: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "17px",
    letterSpacing: 0.67,
    fontFamily: "Roboto",
    marginBottom: 16
  },
  taxStylesLeft: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "17px",
    letterSpacing: 0.58,
    fontFamily: "Roboto",
    marginBottom: 16
  },
  cardHeader: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "18px",
    fontWeight: 400,
    letterSpacing: "0.75px",
    lineHeight: "22px",
    textAlign: "left"
  }
};

function totalAmount(arr) {
  return arr
    .map(item => (item.value ? item.value : 0))
    .reduce((prev, next) => prev + next, 0);
}

function BpaFeesEstimateCard(props) {
  const { classes, estimate } = props;
  const total = totalAmount(estimate.fees);
  const totalHeadClassName = "tl-total-amount-value " + classes.bigheader;
  return (
    <Grid container>
      <Grid item={true} xs={12} sm={7}>
        <LabelContainer
          labelName={estimate.header.labelName}
          labelKey={estimate.header.labelKey}
          style={styles.cardHeader}
        />
        <div style={{ marginTop: 48, maxWidth: 400 }}>
          <Grid container>
            {estimate.fees.map((fee, key) => {
              let tooltip = fee.info ? (
              ""
              ) : (
                ""
              );
              let textLeft = fee.name ? (
                <Grid container xs={8}>
                  <LabelContainer
                    labelName={fee.name.labelName}
                    labelKey={fee.name.labelKey}
                    style={styles.taxStylesLeft}
                  />
                  {tooltip}
                </Grid>
              ) : (
                <Grid xs={8} />
              );
              let textRight = fee.value ? (
                <Grid xs={4} align="right">
                  <LabelContainer
                    labelName={fee.value}
                    labelKey={fee.value}
                    style={styles.taxStyles}
                  />
                </Grid>
              ) : (
                <Grid xs={4} align="right">
                  <LabelContainer
                    labelName={0}
                    labelKey={0}
                    style={styles.taxStyles}
                  />
                </Grid>
              );
              return (
                <Grid key={key} container>
                  {textLeft}
                  {textRight}
                </Grid>
              );
            })}
          </Grid>
          <Divider style={{ marginBottom: 16 }} />
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="body2">
                <LabelContainer
                  labelName="Total Amount"
                  labelKey="BPA_COMMON_TOTAL_AMT"
                />
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              align="right"
              style={{ paddingRight: 0 }}
              className="tl-application-table-total-value"
            >
              <Typography variant="body2">{total}</Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid xs={12} sm={5}>
        <Typography
          variant="body2"
          align="right"
          className="tl-total-amount-text"
        >
          <LabelContainer
            labelName="Total Amount"
            labelKey="BPA_COMMON_TOTAL_AMT"
          />
        </Typography>
        <Typography className={totalHeadClassName} align="right">
          Rs {total}
        </Typography>
        {estimate.extra && estimate.extra.length !== 0 ? (
          <Card className={classes.whiteCard}>
            {estimate.extra.map((item, key) => {
              let textLeft, textRight;
              let colLeft = item.textRight ? 6 : 12;
              let colRight = item.textLeft ? 6 : 12;
              if (item.textLeft) {
                textLeft = (
                  <Grid xs={colLeft}>
                    <Typography>{item.textLeft}</Typography>
                  </Grid>
                );
              } else {
                textLeft = <Grid xs={colLeft} />;
              }
              if (item.textRight) {
                textRight = (
                  <Grid xs={colRight}>
                    <Typography>{item.textRight}</Typography>
                  </Grid>
                );
              } else {
                textRight = <Grid xs={colRight} />;
              }
              return (
                <Grid container>
                  {textLeft}
                  {textRight}
                </Grid>
              );
            })}
          </Card>
        ) : null}
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(BpaFeesEstimateCard);
