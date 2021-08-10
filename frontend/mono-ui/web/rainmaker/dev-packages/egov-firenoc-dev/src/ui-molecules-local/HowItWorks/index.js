import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  root: {
    margin: "16px 8px",
    backgroundColor: theme.palette.background.paper
  }
});

class HowItWorks extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem button>
            <ListItemText primary="How it Works?" />
          </ListItem>
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(HowItWorks);
