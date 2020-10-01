import React from "react";
import {
  Breadcrumbs,
  Link,
  Typography
} from "@material-ui/core";
import { withRouter } from "react-router-dom";


const Breadcrumb = props => {
  const {
    history,
    location: { pathname }
  } = props;
  const pathnames = pathname.split("/").filter(x => x);
  return (
    <Breadcrumbs style={{ margin: 13 }} aria-label="breadcrumb">
      {pathnames.map((name, index) => {
       let displayname=getDisplayName(name);       
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
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
    default:
      return name;
  }
}

export default withRouter(Breadcrumb);
