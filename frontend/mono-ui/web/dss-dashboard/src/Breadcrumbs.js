import React from "react";
import {
  Breadcrumbs,
  Link,
  Typography
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { isNurtDashboard } from "./utils/commons";


const Breadcrumb = props => {
  const {
    history,
    location: { pathname }
  } = props;
  const pathnames = pathname.split("/").filter(x => x);
  return (
    <Breadcrumbs style={{ margin: 13 }} aria-label="breadcrumb">
      {isNurtDashboard()? <Typography key={'Home'}>{'Home'}</Typography>:pathnames.map((name, index) => {
       let displayname=getDisplayName(name); 
       let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`; 
       if(window.location.pathname.toLowerCase().includes("national")==true){
          routeTo = 'NURT_DASHBOARD';
       }      
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography key={name}>{displayname}</Typography>
        ) : (
            <Link style={{ color: '#FC6A03' }} component="button" variant="body2" key={name} onClick={() => history.push(routeTo)}>
              {displayname}
            </Link>

          );
      })}
    </Breadcrumbs>
  );
};

const getDisplayName = (name) => {
  switch (name) {
    case "dashboard":
      return "Home";
    case "propertytax":
      return "Property Tax";
    case "overview":
      return "Overview";
    case "tradelicense":
      return "Trade License";
    case "pgr":
      return "Complaints";
    case "ws":
      return "Water & Sewerage";   
    case "fsm":
      return "FSM";    
    default:
      return name;
  }
}

export default withRouter(Breadcrumb);
