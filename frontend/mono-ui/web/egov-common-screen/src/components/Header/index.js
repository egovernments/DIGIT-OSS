import React from "react";
import "./index.css";
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
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import rightImage from "../../img/logo.png";
import bannerImage from "../../img/banner.jpeg";
import leftImage from "../../img/stateLogo.png";

const styles = (theme) => ({
  root: {
    paddingTop: "0px",
    overflow: "visible",
    height: "100%",
  },
  btn: {
    padding: "2.5% 5% ",
    width: "20%",
    borderRadius: 4,
    fontSize: "15px",
    background: "#EA784E",
    color: "white",
    textDecoration: "none",
    textAlign: "center",
    // marginTop: "42px",
  },
  text: {
    padding: "12px",
    fontSize: "22px",
    fontWeight: "680",
    lineHeight: 2,
  },
  listStyle: {},
});

class Header extends React.Component {
  state = {
    backgroundUrl: "",
    logoUrl: "",
  };

  componentDidMount() {
    let tenantIdFromPath = "";
    tenantIdFromPath = document.location.search
      ? document.location.search.split("=")[1]
      : "uk";
    console.log(tenantIdFromPath, "tenant");
    const RequestInfo = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: ".01",
        ts: "",
        action: "_search",
        did: "1",
        key: "",
        msgId: "20170310130900|en_IN",
        authToken: null,
      },
      MdmsCriteria: {
        tenantId: tenantIdFromPath,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "StateInfo",
              },
            ],
          },
        ],
      },
    };
    axios
      .post(
        `${document.location.origin}/egov-mdms-service/v1/_search?tenantId=${tenantIdFromPath}`,
        RequestInfo
      )
      .then((response) => {
        console.log("ResponseInfo", response.data);
        this.setValuestoState("tenantId", tenantIdFromPath);
        this.setValuestoState(
          "backgroundUrl",
          response.data.MdmsRes["common-masters"].StateInfo[0].bannerUrl
        );
        this.setValuestoState(
          "logoUrl",
          response.data.MdmsRes["common-masters"].StateInfo[0].logoUrl
        );
      })
      .catch((err) => {
        console.log(err, "error");
      });
  }
  setValuestoState = (property, value) => {
    this.setState({
      [property]: value,
    });
  };
  render() {
    const { classes } = this.props;
    const { backgroundUrl, logoUrl } = this.state;

    console.log("state", this.state);

    return (

      <div style={{backgroundColor: "#f3f4f5 !important"}}>
      <div id="flex-container">
      <div style={{width: "30%", float:"left", marginLeft: "10%"}}><img
                        src={leftImage}
                        alt="..."
                        style={{
                          width: "60px",
                          height: "60px",
                          left: "130px",
                          top: "7px",
                        
                        }}
                      /></div>
  
    <div style={{width: "70%", float:"right", marginRight: "10%",}}>
      <div id = "links" > <p id="emplogin">
        <a href="/employee/user/login"   >Employee Login </a></p>
        </div>
        <img
                        src={rightImage}
                        alt="..."
                        id="rightimg"
                        style={{  
                        }}
                  /></div>
  </div>
              <div id="bannerimage">
              <img
                        src={bannerImage}
                        alt="..."
                        style={{ maxWidth: "100%",
                        maxHeight: "100%", width: "inherit"}}                        
                  />
  </div>
  </div>
     
    );
  }
}
export default withStyles(styles)(Header);
