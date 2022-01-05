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
import { getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
import { Label } from "react-bootstrap";

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
        marginRight: 4
    }
};

function totalAmount(arr) {
    return arr
        .map(item => (item.value ? item.value : 0))
        .reduce((prev, next) => prev + next, 0);
}

function DemandRevisionDetailsCard(props) {
    const { classes, estimate } = props;
    const total = totalAmount(estimate.fees);
    return (

        <Grid container>
            <Grid xs={12} sm={7}>

                
                    <Grid container >

                        {estimate.fees.map((fee, key) => {
                            let tooltip = fee.info ? (
                                <Tooltip val={fee.info.labelName} icon={"info_circle"} />
                            ) : (
                                    ""
                                );
                            let textLeft = fee.name ? (
                                <Grid container xs={8}>
                                    <Typography>{fee.name.labelName}</Typography>
                                    {tooltip}
                                </Grid>
                            ) : (
                                    <Grid xs={8} />
                                );
                            let textRight = fee.value ? (
                                <Grid xs={4} align="right">
                                    <Typography variant="body2">{fee.value}</Typography>
                                </Grid>
                            ) : (
                                    <Grid xs={4} />
                                );
                            return (
                                <Grid container>
                                    <Label>ddd</Label>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Divider style={{ marginBottom: 5 }} />
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="body2">Total</Typography>
                        </Grid>
                        <Grid item xs={6} align="right" style={{ paddingRight: 0 }}>
                            <Typography variant="body2">{total}</Typography>
                        </Grid>
                    </Grid>
                
            </Grid>
            <Grid xs={12} sm={5}>
                <Typography variant="body2" align="right">
                    Total Amount
        </Typography>
                <Typography className={classes.bigheader} align="right">
                    Rs {total}
                </Typography>
                <Card className={classes.whiteCard}>
                    <Grid container>
                        <Grid item><ErrorIcon className={classes.leftIcon} /></Grid>
                        <Grid>
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
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

DemandRevisionDetailsCard.propTypes = {
    header: PropTypes.string.isRequired,
    fees: PropTypes.array.isRequired,
    extra: PropTypes.array.isRequired
};

export default withStyles(styles)(DemandRevisionDetailsCard);
