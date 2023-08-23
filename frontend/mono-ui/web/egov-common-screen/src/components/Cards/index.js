import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    Grid,
    Card,
    CardActions,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@material-ui/core";
import propertyTaxImage from "../../img/property_tax.png"
import roadCuttingImage from "../../img/roadcutting.png"
import tradelicenceImage from "../../img/tradelicence.png"
import arrow from "../../img/arrow.png"

import "./index.css";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginLeft: "10%",
        marginRight: "10%"

    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function CenteredGrid() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>

                <Grid item xs={12} md={4}>
                    <Card id="card1">

                        <p id="cardheadingsnew">Property Tax</p>
                        <img
                            src={propertyTaxImage}
                            alt="..."
                            id=""
                            style={{
                                height: "50px",
                                width: "50px",
                                marginTop: "-53px",
                                marginLeft: "5px"
                            }}
                        />
                        <CardContent style={{marginTop: "5%"}}>
                            <p id="carddescription" style={{marginTop: "-51px", color: "rgba(0, 0, 0, 0.6)"}}><br/>
                                Property Tax or House Tax is a local tax levied by municipal authorities for maintaining
                                civic amenities in your area and is paid by occupier of that property
                                <br/>
                                <p id="paylink1"><a style={{color: "#ffffff", marginLeft: "20px"}}
                                                    href="/citizen/withoutAuth/pt-mutation/public-search">Pay Property
                                    Tax</a>
                                    &nbsp;
                                    <img src={arrow} id="arrowicon1"/></p> <br/>
                                <p style={{marginTop: "-7%"}}><a href="/citizen/user/login">Access Property</a></p>
                            </p>
                        </CardContent>
                    </Card> </Grid>
                <Grid item xs={12} md={4}>
                    <Card id="card2">
                        <p id="cardheadingsnew">Trade Licence</p>
                        <img
                            src={tradelicenceImage}
                            alt="..."
                            id=""
                            style={{
                                height: "50px",
                                width: "50px",
                                marginTop: "-53px",
                                marginLeft: "5px"
                            }}/>
                        <CardContent style={{marginTop: "5%"}}>
                            <p id="carddescription" style={{marginTop: "-51px", color: "rgba(0, 0, 0, 0.6)"}}><br/>
                                A Trade License is permission issued by an Urban Local Body (ULB) to conduct specific
                                trade or business according to the relevant rules, standards and safety guidelines on
                                premises for which it has been issued
                                <br/>
                                <p id="paylink2"><a style={{color: "#ffffff", marginLeft: "20px"}}
                                                    href="/citizen/user/login">New Application</a>&nbsp;
                                    <img src={arrow} id="arrowicon2"/></p> <br/>
                                <p style={{marginTop: "-7%"}}><a href="/citizen/user/login">Renewal of License</a></p>
                                <br/>
                            </p>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card id="card3">
                        <p id="cardheadingsnew">Road Cutting</p>
                        <img
                            src={roadCuttingImage}
                            alt="..."
                            id=""
                            style={{
                                height: "50px",
                                width: "50px",
                                marginTop: "-53px",
                                marginLeft: "5px"
                            }}/>
                        <CardContent style={{marginTop: "5%"}}>
                            <p id="carddescription" style={{marginTop: "-51px", color: "rgba(0, 0, 0, 0.6)"}}><br/>
                                Road Cutting charges are levied by ULBs to recover cost for maintaining roads when they
                                are cut for laying pipes, installing electricity lines, internet lines etc
                                <br/>
                                <p id="paylink3"><a style={{color: "#ffffff", marginLeft: "20px"}}
                                                    href="http://enagarsewa.uk.gov.in/" target="_blank"
                                                    rel="noreferrer">Apply</a> &nbsp;
                                    <img src={arrow} id="arrowicon3"/></p><br/>
                            </p>
                        </CardContent>
                    </Card>
                </Grid>

                {/*Grids new 4,5,6*/}
                <Grid item xs={12} md={4}>
                    <Card id="card4">
                        <p id="cardheadingsnew">New Module</p>
                        <img
                            src={roadCuttingImage}
                            alt="..."
                            id=""
                            style={{
                                height: "50px",
                                width: "50px",
                                marginTop: "-53px",
                                marginLeft: "5px"
                            }}/>
                        <CardContent style={{marginTop: "5%"}}>
                            <p id="carddescription" style={{marginTop: "-51px", color: "rgba(0, 0, 0, 0.6)"}}><br/>
                                Road Cutting charges are levied by ULBs to recover cost for maintaining roads when they
                                are cut for laying pipes, installing electricity lines, internet lines etc
                                <br/>
                                <p id="paylink3"><a style={{color: "#ffffff", marginLeft: "20px"}}
                                                    href="http://enagarsewa.uk.gov.in/" target="_blank"
                                                    rel="noreferrer">Apply</a> &nbsp;
                                    <img src={arrow} id="arrowicon3"/></p><br/>
                            </p>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card id="card5">
                        <p id="cardheadingsnew">New Module</p>
                        <img
                            src={roadCuttingImage}
                            alt="..."
                            id=""
                            style={{
                                height: "50px",
                                width: "50px",
                                marginTop: "-53px",
                                marginLeft: "5px"
                            }}/>
                        <CardContent style={{marginTop: "5%"}}>
                            <p id="carddescription" style={{marginTop: "-51px", color: "rgba(0, 0, 0, 0.6)"}}><br/>
                                Road Cutting charges are levied by ULBs to recover cost for maintaining roads when they
                                are cut for laying pipes, installing electricity lines, internet lines etc
                                <br/>
                                <p id="paylink3"><a style={{color: "#ffffff", marginLeft: "20px"}}
                                                    href="http://enagarsewa.uk.gov.in/" target="_blank"
                                                    rel="noreferrer">Apply</a> &nbsp;
                                    <img src={arrow} id="arrowicon3"/></p><br/>
                            </p>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card id="card6">
                        <p id="cardheadingsnew">new Module</p>
                        <img
                            src={roadCuttingImage}
                            alt="..."
                            id=""
                            style={{
                                height: "50px",
                                width: "50px",
                                marginTop: "-53px",
                                marginLeft: "5px"
                            }}/>
                        <CardContent style={{marginTop: "5%"}}>
                            <p id="carddescription" style={{marginTop: "-51px", color: "rgba(0, 0, 0, 0.6)"}}><br/>
                                Road Cutting charges are levied by ULBs to recover cost for maintaining roads when they
                                are cut for laying pipes, installing electricity lines, internet lines etc
                                <br/>
                                <p id="paylink3"><a style={{color: "#ffffff", marginLeft: "20px"}}
                                                    href="http://enagarsewa.uk.gov.in/" target="_blank"
                                                    rel="noreferrer">Apply</a> &nbsp;
                                    <img src={arrow} id="arrowicon3"/></p><br/>
                            </p>
                        </CardContent>
                    </Card>
                </Grid>


            </Grid>
        </div>
    );
}
