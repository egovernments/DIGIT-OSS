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
import "./index.css";

import facebook from "../../img/facebook.png";
import twitter from "../../img/twitter.png";
import chrome from "../../img/chrome.png";
import edge from "../../img/edge.png";
import mozilla from "../../img/mozilla.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,

    backgroundColor:"#0B4B66"

  },
  container :
  {    marginLeft:"10%",
  marginRight:"10%",
  marginTop:"10%",
  paddingRight:"18%"


  },
  header :
  {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "16px",
    lineHeight: "24px",
    color : "#FFFFFF"

  },
  paragraph :
  {
    color : "#FFFFFF",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "20px"

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
      <Grid container spacing={1}  className={classes.container}>
       
        <Grid item xs={12} sm={6} md={3}>    
        <p>   
        <h5 className={classes.header}  style={{fontSize: "1rem", marginTop: "-5px"}}>
                <b>Contact Details</b>
              </h5></p>
              <p className={classes.paragraph} >
                Office Address: <br />
                Urban Development Directorate <br />
                31/62 Rajpur Road,<br />
                Dehradun,<br />
                Uttarakhand - 248001<br />
                </p>
                <p className={classes.paragraph} >
                Call Us:<br />
                +91 (0135) 2741541<br />             
                </p>
                <p className={classes.paragraph} >
                Email Us:<br />
                < a href="mailto:enagarsewauk@gmail.com">enagarsewauk@gmail.com</a>
                <br />  
                <a href="https://www.facebook.com/profile.php?id=100070957113985">                
                <img src={facebook}   style={{width: "6%", marginRight: "6%"}}   /></a>
                <a href="https://twitter.com/NagarsewaU">                                 
                <img src={twitter}   style={{width: "6%"}}   /></a>           
                </p> 
                   </Grid>
        <Grid item xs={12} sm={6} md={3}>
       
        <p>
                <h5 className={classes.header} style={{fontSize: "1rem" , marginTop: "-5px"}}><b>Other Departments</b></h5>
              </p>
              <a
                href="https://uk.gov.in/"
                id ="flink"
                //className={classes.block}
                target="_blank"
              >
                Uttarakhand State Government
              </a><br />
              <a
                href="https://udd.uk.gov.in/"
                id ="flink"
                //className={classes.block}
                target="_blank"
              >
                Urban Development Directorate
              </a><br />
              <a
                href="http://mohua.gov.in/"
                id ="flink"
                //className={classes.block}
                target="_blank"
              >
                MoHUA
              </a><br />
              <a
                href="https://lgdirectory.gov.in/"
                id ="flink"
                //className={classes.block}
                target="_blank"
              >
                Local Government Directory
              </a><br />
              <a
                href="http://smartcitydehradun.uk.gov.in/"
                //className={classes.block}
                target="_blank"
                id ="flink"
              >
                Dehradun Smart City
              </a><br />
              <a
                href="https://serviceonline.gov.in/uttarakhand/"
                //className={classes.block}
                target="_blank"
                id ="flink"
              >
                Uttarakhand ServicePlus
              </a><br />
              <a
                href="https://nagarnigamdehradun.com/"
                //className={classes.block}
                target="_blank"
                id ="flink"
              >
                Nagar Nigam Dehradun 
              </a>
               
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
        
        <p              >
                <h5 className={classes.header} style={{fontSize: "1rem", marginTop: "-5px"}}><b>User Manuals</b></h5>
              </p>       
              <a
                href="/ukd-assets/PT_English_UserManual_Citizen.pdf"
                //className={classes.block}
                target="_blank"
                id ="flink"

              >
                Property Tax
              </a><br />
              <a
                href="https://udd.uk.gov.in/pages/display/147-property-tax"
                //className={classes.block}
                target="_blank"
                id ="flink"

              >
                Property Tax Demand Registers
              </a><br />
              <a
                href="/ukd-assets/TL_English_UserManual_Citizen.pdf"
                //className={classes.block}
                target="_blank"
                id ="flink"

              >
                Trade Licence
              </a><br />

              <a
                href="#"
                //className={classes.block}
                target="_blank"
                id ="flink"

              >
                Road Cutting
              </a><br />  
              <a
                href="https://www.youtube.com/channel/UCnRHcTjQ1ylEBR8nV6re1ZA"
                //className={classes.block}
                target="_blank"
                id ="flink"

              >
                NagarSewa YouTube Channel
              </a><br />
                 
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
        
        <p>
                <h5 className={classes.header} style={{fontSize: "1rem", marginTop: "-5px"}}><b>About Us</b></h5>
              </p>              
              <a
                href="https://udd.uk.gov.in/pages/display/2-about-us"
                //className={classes.block}
                target="_blank"
                id ="flink"
              >
              About UDD
              </a><br />
              <a
                href="https://smartnet.niua.org/nuis"
                //className={classes.block}
                target="_blank"
                id ="flink"
              >
              About NUIS
              </a><br />
              <a
                href=" http://egov.org.in/"
                //className={classes.block}
                target="_blank"
                id ="flink"
              >
              About eGov Foundation
              </a> <br />


            </Grid>

      </Grid><br />
      <center style={{color:"#ffffff"}}>Information provided online is update and no physical visit is required</center> <br />    
      <center style={{color:"#ffffff"}}>Last Updated July 2021</center> <br />    
      <center style={{color:"#ffffff"}}><span style={{color:"red"}}>*</span>Supported browser versions</center> <br />    
      <center ><table >
      <tr >
          <td style={{color:"#ffffff", width: "100px"}}><center> <img src={chrome}     /></center></td>
          {/* <td style={{color:"#ffffff", width: "100px"}}> <center><img src={edge}   /></center></td> */}
          <td style={{color:"#ffffff", width: "100px"}}> <center><img src={mozilla}   /></center></td>
          </tr>
        <tr >
          <td style={{color:"#ffffff", width: "100px"}}><center> &gt;V-81</center></td>
          {/* <td style={{color:"#ffffff", width: "100px"}}> <center>&gt;V-84</center></td> */}
          <td style={{color:"#ffffff", width: "100px"}}> <center>&gt;V-79</center></td>
          </tr>
          
          </table>     </center>


    </div>
  );
}
