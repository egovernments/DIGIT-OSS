import React from 'react';
import './index.css';
import { Grid, Card, CardActions, CardContent, List, ListItem, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

const styles = theme => ({
    root: {
        paddingTop: "0px",
        overflow: "hidden",
        height: '100%',
    },
    btn: {
        padding: "2.5% 5%",
        width: "20%",
        borderRadius: 4,
        fontSize: "15px",
        background: "#EA784E",
        color: "white",
        textDecoration: "none",
        textAlign: "center"
    },
    text: {
        padding: "12px",
        fontSize: "22px",
        fontWeight: "680",
        lineHeight: 2
    },
    listStyle: {

    }
});

class LandingPage extends React.Component {
    state = {
        backgroundUrl: "",
        logoUrl: ""
    }

    componentDidMount() {
        let tenantIdFromPath = ""
        tenantIdFromPath = document.location.search ? document.location.search.split('=')[1] : "uk";
        console.log(tenantIdFromPath, "tenant")
        const RequestInfo = {
            RequestInfo: {
                "apiId": "Rainmaker",
                "ver": ".01",
                "ts": "",
                "action": "_search",
                "did": "1",
                "key": "",
                "msgId": "20170310130900|en_IN",
                "authToken": null
            },
            MdmsCriteria: {
                "tenantId": tenantIdFromPath,
                "moduleDetails": [
                    {
                        "moduleName": "common-masters",
                        "masterDetails": [

                            {
                                "name": "StateInfo"
                            }
                        ]
                    }
                ]
            }
        }
        axios.post(`${document.location.origin}/egov-mdms-service/v1/_search?tenantId=${tenantIdFromPath}`, RequestInfo)
            .then(response => {
                console.log("ResponseInfo", response.data);
                this.setValuestoState("tenantId", tenantIdFromPath);
                this.setValuestoState("backgroundUrl", response.data.MdmsRes["common-masters"].StateInfo[0].bannerUrl);
                this.setValuestoState("logoUrl", response.data.MdmsRes["common-masters"].StateInfo[0].logoUrl);

            })
            .catch(err => { console.log(err, "error"); })
    }
    setValuestoState = (property, value) => {
        this.setState({
            [property]: value
        })
    };
    render() {
        const { classes } = this.props;
        const { backgroundUrl, logoUrl } = this.state;

        console.log("state", this.state)

        return (
            <div className="common-background" style={{
                height: '100%',
                background: `url(https://s3.ap-south-1.amazonaws.com/ukd-egov-assets/Stateimages/banner.png) no-repeat center`,
            }}>
                <Grid container className={classes.root}>

                    <Grid container style={{ marginBottom: "10px" }}>
                        <Grid item md={12} style={{ textAlign: "center", backgroundColor:"#FFF", paddingTop:"20px", height:"80px", marginBottom:"50px"}}>
                            <img src={logoUrl} alt="company-logo" width="20%" />
                        </Grid>
                    </Grid>

                    <Grid container spacing={4}>
                        <Grid item md={1}></Grid>
                        <Grid item md={5}>
                            <Card style={{ borderRadius: 0, height:380 }}>
                                <CardContent style={{height:270}}> 
                                    <Grid container  alignItems="center" >
                                        <Grid item md={1} >
                                            <img src="assets/citizen.png" alt="citizen-logo" width="40px" height="40px" style={{opacity:0.6}} />
                                        </Grid>
                                        <Grid item md={11}>
                                            <List style={{ padding: 0 }}>
                                                <ListItem style={{ padding: "0px 0px 0px 8px" }}>
                                                    <ListItemText
                                                        primary={<span style={{ fontSize: "22px", fontWeight: "680", opacity:0.75}}>नागरिक</span>}
                                                        secondary={<span style={{ fontStyle: "italic" }}>Citizen</span>}
                                                    />
                                                </ListItem>
                                            </List>

                                        </Grid>
                                    </Grid>
                                    <List style={{ padding: 0 }}>
                                        <ListItem style={{ padding: 0 }}>
                                            <ListItemText
                                                primary={<span style={{ fontSize: "14px", fontfamily: "inherit",opacity:0.8 }}>नगरसेवा नागरिक खाता नागरिकों को शहरी स्थानीय निकाय (नगर पालिका / नगर निगम) द्वारा प्रदान की गई विभिन्न सेवाओं का ऑनलाइन लाभ उठाने में सक्षम बनाता है। शहरी स्थानीय निकाय प्रमुख रूप से व्यापार लाइसेंस, संपत्ति कर और नागरिक शिकायतों आदि से संबंधित सेवाएं प्रदान करते हैं। रजिस्टर / कृपया लॉग इन करने के लिए नीचे क्लिक करें।
                                                </span>}
                                                secondary={<span style={{ fontStyle: "italic" }}>A NagarSewa citizen account enables citizens to avail the various services online rendered by the urban local body (Municipality/ Municipal Corporation). The major services which the local body provides are related to Trade License, Property Tax, and Citizen Grievances etc. Please click below to register/log in.</span>}
                                            />
                                        </ListItem>
                                    </List>

                                </CardContent>
                                <CardActions  style={{ padding: "16px"}}>
                                    <a href="/citizen" className={classes.btn}>
                                        लॉग इन / LOGIN
                                      </a>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item md={5}>
                            <Card style={{ borderRadius: 0, height:380 }}>
                                <CardContent style={{height:270}}>
                                    <Grid container alignItems="center" >
                                        <Grid item md={1}>
                                            <img src="assets/municiple-employee.png" alt="municiple-employee-logo" width="40px" height="40px" style={{opacity:0.6}} />
                                        </Grid>
                                        <Grid item md={11}>
                                            <List style={{ padding: 0 }}>
                                                <ListItem style={{ padding: "0px 0px 0px 8px" }}>
                                                    <ListItemText
                                                        primary={<span style={{ fontSize: "22px", fontWeight: "680" , opacity:0.75}}>नगर निगम कर्मचारी</span>}
                                                        secondary={<span style={{ fontStyle: "italic" }}>Municipal Employee</span>}
                                                    />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </Grid>
                                    <List style={{ padding: 0 }}>
                                        <ListItem style={{ padding: 0 }}>
                                            <ListItemText
                                                primary={<span style={{ fontSize: "14px", fontfamily: "inherit" , opacity:0.8}}>नगरसेवा कर्मचारी खाता शहरी स्थानीय निकाय (नगर पालिका / नगर निगम) के कर्मचारी को दिन-प्रतिदिन की गतिविधियों के लिए सक्षम बनाता है और उसे नागरिकों द्वारा सौंपे गए सेवा अनुरोध की समय पर डिलीवरी सुनिश्चित करता है। कृपया लॉग इन करने के लिए नीचे क्लिक करें।</span>}
                                                secondary={<span style={{ fontStyle: "italic" }}>A NagarSewa employee account enables the employee of urban local body (Municipality/ Municipal Corporation) to perform its day to day activities and ensure the timely delivery of services applied by citizen assigned to him/her. Please click below to login.</span>}
                                            />
                                        </ListItem>
                                    </List>
                                </CardContent>
                                <CardActions style={{ padding: "16px"}} >
                                    <a href="/employee" className={classes.btn} >लॉग इन / LOGIN
                             </a>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid container style={{ marginBottom: "10px" }}>
                        <Grid item md={12} style={{ textAlign: "center" }}>
                            <p style={{color:"#fff",fontSize:"20px"}}>For Right of Way/Road Cutting/Road Digging Service <a style={{color:"#EA784E"}} href="http://enagarsewa.uk.gov.in/" target="_blank" >APPLY HERE
                             </a></p>
                        </Grid>
                    </Grid>
                        <Grid item md={1}></Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default withStyles(styles)(LandingPage);
