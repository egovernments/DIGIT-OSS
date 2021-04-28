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
    if (from !== undefined && to !== 'NA') { return convertEpochToDate(from) + " - " + convertEpochToDate(to); }
    else { return "NA" }
}

function FeesEstimateOverviewCard(props) {
    const { classes, estimate } = props;
    const totalHeadClassName = "tl-total-amount-value " + classes.bigheader;
    const isPaid = (estimate.fees.appStatus === 'CONNECTION_ACTIVATED' || estimate.fees.appStatus === 'PENDING_FOR_CONNECTION_ACTIVATION')?true:false;

    // if (estimate !== null && estimate !== undefined && estimate.fees !== undefined && estimate.fees !== null && estimate.fees.length > 0) {
    //     if (estimate.fees[0].data !== null && estimate.fees[0].data !== undefined && estimate.fees[0].data.length > 0) {
    //         totalAmount = estimate.fees[0].data[0].total;
    //         dueDate = convertEpochToDate(estimate.fees[0].data[0].expiryDate);
    //     }
    //     if (estimate.fees[0].description !== null && estimate.fees[0].description !== undefined && estimate.fees[0].description.length > 0) {
    //         sortedArray = estimate.fees[0].description;
    //     }
    // }

    return (
        <Grid container >
            <Grid xs={12} sm={12}>
                <Typography variant="body2"
                    align="right"
                    style={{ marginTop: -20 }}
                    className="tl-total-amount-text">
                    <LabelContainer labelName="Total Amount" labelKey="WS_COMMON_TOTAL_AMT" />
                </Typography>
                <Typography className={totalHeadClassName} align="right" >Rs {estimate.fees.totalAmount}</Typography>
                { isPaid? (
                    <Typography variant="body2" align="right"  style={{ color: 'green' }}>
                      <LabelContainer
                        labelName="Paid Successfully"
                        labelKey="WS_COMMON_PAID_SUCCESS"
                      />
                    </Typography>
                    ):(
                    <Typography variant="body2" align="right" style={{ color: 'red' }}>
                      <LabelContainer
                        labelName="Not Paid"
                        labelKey="WS_COMMON_NOT_PAID"
                      />
                      </Typography> 
                    )
                }
            </Grid>
            <Grid xs={12} sm={7}>
                <div style={{ maxWidth: 600 }}>
                    <div>
                        <Grid container>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="body2" >
                                        <LabelContainer labelKey="WS_APPLICATION_FEE_HEADER" />
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={6}
                                    align="right"
                                    style={styles.taxStyles}
                                    className="tl-application-table-total-value" >
                                    <Typography variant="body2">
                                        {estimate.fees.fee}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="body2" >
                                        <LabelContainer labelKey="WS_SERVICE_FEE_HEADER" />
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                </Grid>
                                <Grid item xs={6}
                                    align="right"
                                    style={styles.taxStyles}
                                    className="tl-application-table-total-value" >
                                    <Typography variant="body2">
                                        {estimate.fees.charge}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="body2" >
                                        <LabelContainer labelKey="WS_TAX_HEADER" />
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                </Grid>
                                <Grid item xs={6}
                                    align="right"
                                    style={styles.taxStyles}
                                    className="tl-application-table-total-value" >
                                    <Typography variant="body2">
                                        {estimate.fees.taxAmount}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
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
                                Rs {estimate.fees.totalAmount}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </Grid >
            <Grid xs={12}
                sm={1} >
            </Grid>
        </Grid >
    )
}

export default withStyles(styles)(FeesEstimateOverviewCard);