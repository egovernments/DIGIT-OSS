import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { TaskDialog, TaskStatusComponents } from "../../ui-molecules-local";
import HistoryIcon from "@material-ui/icons/History";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: "#FE7A51"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class TastStatusContainer extends React.Component {
  state = {
    open: false
  };

  handleViewHistory = () => {
    this.setState({
      open: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { classes, ProcessInstances } = this.props;
    const currentObj =
      ProcessInstances && ProcessInstances[ProcessInstances.length - 1];
    return (
      <div>
        <Card className="">
          <CardContent>
            <Container
              children={
                <div style={{ width: "100%" }}>
                  <Grid container="true" spacing={12} marginTop={16}>
                    <Grid
                      style={{ alignItems: "center", display: "flex" }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Typography component="h2" variant="subheading">
                        <LabelContainer
                          labelName="Task Status"
                          labelKey="TL_TASK_STATUS"
                        />
                      </Typography>
                    </Grid>
                    <Grid item sm={6} xs={6} style={{ textAlign: "right" }}>
                      <Button
                        className={classes.button}
                        onClick={this.handleViewHistory}
                      >
                        <HistoryIcon className={classes.leftIcon} />
                        <LabelContainer
                          labelName="VIEW HISTORY"
                          labelKey="TL_VIEW_HISTORY"
                          color="#FE7A51"
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  <TaskStatusComponents
                    currentObj={currentObj}
                    index={ProcessInstances.length - 1}
                  />
                </div>
              }
            />
          </CardContent>
        </Card>
        <TaskDialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          history={ProcessInstances}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TastStatusContainer);
