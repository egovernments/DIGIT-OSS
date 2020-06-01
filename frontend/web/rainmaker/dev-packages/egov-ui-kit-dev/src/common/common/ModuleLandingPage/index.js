import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Label from "../../../utils/translationNode";
import "./index.css";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    borderRadius: 0,
    marginTop: 0,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    cursor: "pointer",
  },
  icon: {
    color: "#fe7a51",
  },
  item: {
    padding: 8,
  },
});

class ModuleLandingPage extends React.Component {
  render() {
    const { classes, items, history } = this.props;
    return (
      <Grid container>
        {items.map((obj) => {
          return (
            <Grid className={classes.item} item xs sm align="center">
              <Card
                className={`${classes.paper} module-card-style`}
                onClick={(e) => {
                  history.push(obj.route);
                }}
              >
                <CardContent classes={{ root: "card-content-style" }}>
                  {obj.icon}
                  <Label label={obj.label} fontSize={14} color="rgba(0, 0, 0, 0.8700000047683716)" dynamicArray={obj.dynamicArray} />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default withStyles(styles)(ModuleLandingPage);
