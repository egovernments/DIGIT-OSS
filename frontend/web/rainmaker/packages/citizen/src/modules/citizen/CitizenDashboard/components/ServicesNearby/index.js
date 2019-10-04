import React from "react";
import { Icon, Card } from "components";
import Grid from "@material-ui/core/Grid";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

class ServicesNearby extends React.Component {
  getServicesNearBy = () => {
    return [
      {
        label: "COMMON_EVENTS_LABEL",
        icon: <Icon className="service-icon" action="custom" name="calendar" />,
        route: "events",
      },
      {
        label: "COMMON_MYCITY_LABEL",
        icon: <Icon className="service-icon" action="custom" name="home-city-outline" />,
        route: "my-city",
      },
    ];
  };

  // render() {
  //   const { getServicesNearBy } = this;
  //   const { onSeviceClick } = this.props;
  //   return {

  /* <Grid item xs={3} sm={2} align="center"
            //   style={{ padding: "0px 8px", cursor: "pointer" }}
            //   onClick={() =>onSeviceClick(service.route)}>
            //   <div className="service-nearby-icon-cont">{service.icon}</div>
            //   <Label dark={true} className="service-label-cont" fontSize={14} label={service.label} />
            // </Grid> */
  //   };
  // }

  render() {
    const { onServiceClick } = this.props;
    return (
      <Grid container>
        <Grid item xs={6} sm={6} align="center" style={{ paddingRight : 8,cursor: "pointer" }}  onClick={() => onServiceClick("events")}>
          <Card className="servicelist-style"
            textChildren={
              <div className="local-information-cont" >
                <Icon className="service-icon" action="custom" name="calendar" />
                <Label labelStyle={{ paddingLeft: "10px" }} dark={true} fontSize={14} label={"COMMON_EVENTS_LABEL"} />
              </div>
            }
          />
        </Grid>
        <Grid item xs={6} sm={6} align="center" style={{ cursor: "pointer" }}  onClick={() => onServiceClick("my-city")}>
          <Card className="servicelist-style"
            textChildren={
              <div className="local-information-cont" >
                <Icon className="service-icon" action="custom" name="home-city-outline" />
                <Label labelStyle={{ paddingLeft: "10px" }} dark={true} fontSize={14} label={"COMMON_MYCITY_LABEL"} />
              </div>
            }
          />
        </Grid>
      </Grid>
    );
  }
}

export default ServicesNearby;
