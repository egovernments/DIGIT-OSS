import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import KeyboardRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { getDomainLink } from "../../ui-utils/commons";
import store from "ui-redux/store";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
const styles = theme => ({
  root: {
    margin: "2px 8px",
    backgroundColor: theme.palette.background.paper
  }
});

class HowItWorks extends React.Component {

  clickHandler = () => {
    store.dispatch(setRoute("howItWorks"))
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} onClick={this.clickHandler}>
        <List component="nav">
          <ListItem button>
            <ListItemText
              primary={
                <LabelContainer
                  labelKey="COMMON_HOW_IT_WORKS"
                  labelName="How it works?"
                  style={{
                    fontSize: 14,
                    color: "rgba(0, 0, 0, 0.8700000047683716)"
                  }}
                />
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <KeyboardRightIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(HowItWorks);
