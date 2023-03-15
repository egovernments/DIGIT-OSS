import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card } from "material-ui/Card";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { Tooltip, Icon } from "@material-ui/core";

const styles = {
    card: {
        backgroundColor: "rgb(242, 242, 242)",
        boxShadow: "none",
        borderRadius: 0
    },
    whiteCard: {
        padding: 18,
        marginTop: 2,
        // boxShadow: "none",
        borderRadius: 0,
        backgroundColor: "#ffffff"
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
        paddingTop: 1
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
        fontSize: 16,
        fontWeight: 400,
        lineHeight: "19px",
        letterSpacing: 0.67,
        fontFamily: "Roboto",
        marginBottom: 16
    }
};

const date = (from, to) => {
    if (from !== undefined && to !== 'NA') { return convertEpochToDate(from) + " to " + convertEpochToDate(to); }
    else { return "NA" }
}

function FeesEstimateCard(props) {
    const { classes, estimate } = props;
    let sortedArray = [], totalAmount, arrears = 0, arrearsDescription, fromPeriod, toPeriod, dueDate;
    const totalHeadClassName = "tl-total-amount-value " + classes.bigheader;
    if (estimate !== null && estimate !== undefined && estimate.fees !== undefined && estimate.fees !== null && estimate.fees.length > 0) {
        if (estimate.fees[0].data !== null && estimate.fees[0].data !== undefined && estimate.fees[0].data.length > 0) {
            totalAmount = estimate.fees[0].data[0].total;
            dueDate = convertEpochToDate(estimate.fees[0].data[0].expiryDate);
        }
        if (estimate.fees[0].description !== undefined && estimate.fees[0].description !== null) {
            sortedArray = estimate.fees[0].description.bill;
            arrearsDescription = estimate.fees[0].arrearsDescription;
            fromPeriod = estimate.fees[0].description.fromPeriod;
            toPeriod = estimate.fees[0].description.toPeriod;
            arrears = estimate.fees[0].arrears;
        }
    }

    return (
        <Grid container >
            <Grid xs={12} sm={12}>
                <Typography variant="body2"
                    align="right"
                    style={{ marginTop: -20 }}
                    className="tl-total-amount-text">
                    <LabelContainer labelName="Total Amount" labelKey="WS_COMMON_TOTAL_AMT" />
                </Typography>
                <Typography className={totalHeadClassName} align="right" >Rs {totalAmount}</Typography>
            </Grid>
            <Grid xs={12} sm={7}>
                <div style={{ maxWidth: 600 }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="WS_VIEW_BILL_BILLING_PERIOD_LABEL" />
                            </Typography>
                        </Grid>
                        <Grid item xs={6}
                            align="right"
                            style={styles.taxStyles}
                            className="tl-application-table-total-value" >
                            <Typography variant="body2">
                                {date(fromPeriod, toPeriod)}
                            </Typography>
                        </Grid>
                    </Grid>
                    {sortedArray.length > 0 && sortedArray.map(fee =>
                        <div>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="body2" >
                                        <LabelContainer labelKey={fee.key} />
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Tooltip title={fee.value}>
                                        <Icon className={styles.toolTipIcon}>
                                            <i class="material-icons" style={{ fontSize: 18 }}>info_circle</i>
                                        </Icon>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={6}
                                    align="right"
                                    style={styles.taxStyles}
                                    className="tl-application-table-total-value" >
                                    <Typography variant="body2">
                                        Rs {fee.amount}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                    <Grid container >
                        <Grid item xs={4}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="COMMON_ARREARS" />
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Tooltip title={arrearsDescription}>
                                <Icon className={styles.toolTipIcon}>
                                    <i class="material-icons" style={{ fontSize: 18 }}>info_circle</i>
                                </Icon>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={6}
                            align="right"
                            style={{ paddingRight: 0 }}
                            className="tl-application-table-total-value" >
                            <Typography variant="body2">
                                Rs {arrears}
                            </Typography>
                        </Grid>
                    </Grid>
                    < Divider />
                    <Grid container >
                        <Grid item xs={6}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="WS_COMMON_TOTAL_AMT" />
                            </Typography>
                        </Grid>
                        <Grid item xs={6}
                            align="right"
                            style={{ paddingRight: 0 }}
                            className="tl-application-table-total-value" >
                            <Typography variant="body2">
                                Rs {totalAmount}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </Grid >
            <Grid xs={12}
                sm={1} >
            </Grid>
            <Grid xs={12} sm={4}>
                <Card className={classes.whiteCard}
                    style={{ backgroundColor: '#fff', boxShadow: "none" }} >
                    <Grid container >
                        <Grid xs={12}
                            style={{ marginBottom: 16, fontSize: '16px', fontWeight: 500 }} >
                            <LabelContainer labelKey="WS_VIEW_BILL_IMP_DATE_HEADER" />
                        </Grid>
                        <Grid xs={6} >
                            <Typography> <LabelContainer labelKey="WS_VIEW_BILL_DUE_DATE_LABEL"></LabelContainer>
                            </Typography >
                        </Grid>
                        <Grid xs={6}
                            align="right" >
                            <Typography>{dueDate}</Typography>
                        </Grid>
                    </Grid>
                </Card >
                {/* // ) : null} */}
            </Grid>
        </Grid >
    )
}

// FeesEstimateCard.propTypes = {
//   header: PropTypes.string.isRequired,
//   fees: PropTypes.array.isRequired,
//   extra: PropTypes.array.isRequired
// };

export default withStyles(styles)(FeesEstimateCard);