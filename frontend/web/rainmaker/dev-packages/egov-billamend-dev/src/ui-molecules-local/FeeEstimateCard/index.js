import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import ErrorIcon from "@material-ui/icons/Error";
import { getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";


const styles = {
    card: {
        backgroundColor: "rgb(242, 242, 242)",
        boxShadow: "none",
        borderRadius: 0,
        display: "flex"
    },
    whiteCard: {
        padding: 18,
        marginTop: 24,
        boxShadow: "none",
        borderRadius: 0,
        display:"flex"
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
    leftIcon: {
        color: "grey",
        marginRight: 4,
        position:'absolute'
    },
    taxHeadMasterCodes: {
        fontSize: "12px",
        marginTop: "5px"
    }
};

function totalAmount(arr) {
    if(Array.isArray(arr)) {
        return arr
        .map(item => (item.taxAmount ? item.taxAmount : 0))
        .reduce((prev, next) => prev + next, 0);
    } else {
        return 0;
    }
}

// function getAmountType (fees) {
//     for(let i = 0; i < fees.length; i++) {
//         // if (fees[i].taxAmount < 0) return "reducedAmount";
//         // if (fees[i].taxAmount > 0) return "additionalAmount";
//         return fees[i].amountType
//     }
// }

function FeesEstimateCard(props) {
    const { classes, estimate } = props;
    const total = totalAmount(estimate.fees);
    // const amountType = getAmountType(estimate.fees);
    return (

        <Grid container>
            <Grid xs={12} sm={7}>
                <div style={{ marginTop: 48, maxWidth: 400 }}>
                    <Grid container >
                        <Grid container style={{ marginBottom: 10 }}>
                            <Grid container xs={6}>
                                <LabelContainer labelName="Tax Heads" labelKey="BILL_TAX_HEADS" style={{fontWeight:"bold"}}/>
                            </Grid>
                            <Grid xs={6} align="right">
                            <LabelContainer 
                            labelName="Reduced Amount(Rs)" 
                            labelKey= {get(estimate, "fees[0].amountType", "") === "reducedAmount" ? "BILL_REDUCED_AMOUNT_RS" : "BILL_ADDITIONAL_AMOUNT_RS"}
                            style={{fontWeight:"bold"}}/>
                            </Grid>
                        </Grid>
                        {estimate.fees && estimate.fees.length > 0 && estimate.fees.map((fee, key) => {
                            let tooltip = fee.info ? (
                                <Tooltip val="" icon={"info_circle"} className={'bill-estimate-infoicon'} style={{    position: 'absolute'}} /> //{fee.info.labelName}
                            ) : (
                                    ""
                                );
                            let textLeft = fee.taxHeadMasterCode ? (
                                <Grid container xs={8}>
                                    <LabelContainer 
                                        labelKey = {getTransformedLocale(`BILL_${fee.taxHeadMasterCode}`)}
                                        className={classes.taxHeadMasterCodes}
                                    />
                                    {/* <Typography>{`BILL_${fee.taxHeadMasterCode}`}</Typography> */}
                                    {tooltip}
                                </Grid>
                            ) : (
                                    <Grid xs={8} />
                                );
                            let textRight = fee ? (
                                <Grid xs={4} align="right">
                                    <Typography variant="body2" className={classes.taxHeadMasterCodes}>
                                        {fee.taxAmount}
                                    </Typography>
                                </Grid>
                            ) : (
                                    <Grid xs={4} />
                                );
                            return (
                                <Grid container>
                                    {textLeft}
                                    {textRight}
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Divider style={{ marginBottom: 5 }} />
                    <Grid container>
                        <Grid item xs={6}>
                        <LabelContainer labelName="Reduced Amount(Rs)" labelKey="BILL_ADJUSTMENT_AMOUNT_TOTAL" style={{fontWeight:"bold"}}/>
                        </Grid>
                        <Grid item xs={6} align="right" style={{ paddingRight: 0 }}>
                            <Typography variant="body2">{total}</Typography>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
            <Grid xs={12} sm={5}>
                <Typography variant="body2" align="right">
                    Total Amount
        </Typography>
                <Typography className={classes.bigheader} align="right">
                    Rs {total}
                </Typography>
                <Card className={classes.whiteCard}>
                    <Grid container style={{display:"flex"}}>
                        <Grid item><ErrorIcon className={classes.leftIcon} /></Grid>
                        <Grid>
                            {estimate.extra.map((item, key) => {
                                let textLeft, textRight;
                                let colLeft = item.textRight ? 6 : 10;
                                let colRight = item.textLeft ? 6 : 10;
                                if (item.textLeft) {
                                    textLeft = (
                                        <Grid xs={colLeft} className={'bill-estimate-infotext'}>
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
                                    <Grid>
                                        {textLeft}
                                        {textRight}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

FeesEstimateCard.propTypes = {
    header: PropTypes.string.isRequired,
    fees: PropTypes.array.isRequired,
    extra: PropTypes.array.isRequired
};

export default withStyles(styles)(FeesEstimateCard);
