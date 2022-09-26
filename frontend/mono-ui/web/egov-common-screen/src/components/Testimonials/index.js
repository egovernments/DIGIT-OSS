import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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


import team1 from "../../img/faces/KKshukla.jpg";
import team2 from "../../img/faces/munikireti.jpg";
import team3 from "../../img/faces/MaheshChandraPandey.jpeg";
import team4 from "../../img/faces/SPRawat.jpeg";


import "./index.css";


const useStyles = makeStyles((theme) => ({
 /*  root: {
    flexGrow: 1,
    marginLeft:"10%",
    marginRight:"10%"

  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },*/
  card: 
  {
    textAlign: 'center'
  }

}));

export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <div id="testimonials">
      <Grid container spacing={3}  justifyContent="center" >
      <Grid item xs={12} sm={6} md = {6} lg={3}  >
          <Card plain id="testmonialcard" className={classes.card} >
             {/*  <Grid item xs={12} sm={6} md = {4} lg={3} justifyContent="center"  > */}
                <img src={team1}    id="testmonialimg"  /* id="testimonialimg2" style={{marginTop: "-50px", marginLeft: "-17px"}} */ alt="..."  />
              {/* </Grid> */}
              <p style = {{textAlign: "center",
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px"}} >
              Shri K K Shukla
                <br />
                <small>Survey of India,Govt of India</small>
              </p>
              <CardContent>
              <p id="singletestimonial" >
              &rdquo;It was a good experience with the newly launched portal. Portal is user friendly interface and common people can use and pay his or her property tax while sitting in the home. In this way time and energy is saved. Money transactions are safe and receipt generated through the portal is nice feature of this portal. I wish this team all the best &rdquo;       </p>
              </CardContent>
            </Card>        
            </Grid>
        
        <Grid item xs={12} sm={6} md = {6} lg={3} >
          <Card plain id="testmonialcard" className={classes.card}>              
                <img src={team2}   id="testmonialimg" /* id="testimonialimg2" style={{marginTop: "-50px", marginLeft: "-17px"}} */ alt="..."  />
              <p style = {{textAlign: "center", 
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px"}} >
              Muni Ki Reti
                <br />
                <small>Executive Officer</small>
              </p>
              <CardContent>
              <p id="singletestimonial" >
              &rdquo;Nagarsewa Portal is a very good initiative for citizens and ULB employees. It ensures contactless delivery of all essential services in the pandemic. It is fast and also ensures transparency of services for citizens. It is secured and easily accessible at door step. Also monitoring at ULB and citizen level have become a lot easier. &rdquo;       </p>
              </CardContent>
            </Card>        
            </Grid>
            <Grid item xs={12} sm={6} md = {6} lg={3} > 
            <Card plain id="testmonialcard" className={classes.card}>
                <img src={team3}   id="testmonialimg" /* id="testimonialimg3" style={{marginTop: "-50px", marginLeft: "-17px"}}  */alt="..."  />
              <p style = {{textAlign: "center", 
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px"}}>
              Mahesh Chandra Pandey
                <br />
                <small c>Hotel Owner</small>
              </p>
              <CardContent>
              <p id="singletestimonial" >
              &rdquo;It was a good experience. As earlier we have to come to Nigam for Trade License but with this newly launched website, we can pay fees by sitting at home which is a very useful feature in this time of pandemic.&rdquo;
                </p>
              </CardContent>
            </Card>       </Grid>
        <Grid item xs={12} sm={6} md = {6} lg={3}><Card plain id="testmonialcard"  className={classes.card}>
                <img src={team4}  id="testmonialimg" /* id="testimonialimg4" style={{marginTop: "-50px"}} */ alt="..."  />
              <p style = {{textAlign: "center",
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px"}}>
              Shri S P Rawat
                <br />
                <small >Senior Officer (Retd.), ONGC</small>
              </p>
              <CardContent>
              <p  id="singletestimonial" >
              &rdquo;It was a good experience, as initially I got some problem in depositing house tax online but with the support of their helpdesk, I have deposited my tax successfully. I pay sincere thanks to their helpdesk for their dedication and Valuable Support provided to me and I wish them success in this initiative.&rdquo;
                </p>
              </CardContent>
            </Card>       </Grid>




      </Grid>
    </div>
  );
}
