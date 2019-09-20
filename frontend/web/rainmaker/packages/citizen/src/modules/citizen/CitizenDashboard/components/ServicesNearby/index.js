import React from "react";
import { Icon } from "components";
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

  render() {
    const { getServicesNearBy } = this;
    const { onSeviceClick } = this.props;
    return (
      <Grid container>
        {getServicesNearBy().map((service) => {
          return (
            <Grid item xs={3} sm={2} align="center" 
              style={{ padding: "0px 8px", cursor: "pointer" }} 
              onClick={() =>onSeviceClick(service.route)}>
              <div className="service-nearby-icon-cont">{service.icon}</div>
              <Label dark={true} className="service-label-cont" fontSize={14} label={service.label} />
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default ServicesNearby;
