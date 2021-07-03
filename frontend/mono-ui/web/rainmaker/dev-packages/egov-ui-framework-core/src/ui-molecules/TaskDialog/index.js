import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent, Divider } from "@material-ui/core";
import TaskStatusComponents from "../TaskStatusComponents";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const TaskDialog = props => {
  const { open, onClose, classes, history } = props;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogContent
        children={
          <Container
            children={
              <Grid container="true" sm="12" spacing={16} marginTop={16}>
                <Grid
                  style={{ alignItems: "center", display: "flex" }}
                  item
                  sm={10}
                >
                  <Typography component="h2" variant="subheading">
                    <LabelContainer
                      labelName="Task Status"
                      labelKey="TL_TASK_STATUS"
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  sm={2}
                  style={{ textAlign: "right", cursor: "pointer" }}
                  onClick={onClose}
                >
                  <CloseIcon />
                </Grid>
                <Grid item sm={12} style={{ margin: "10px 0 0 10px" }}>
                  {history &&
                    history.map((item, index) => {
                      return (
                        <div>
                          <TaskStatusComponents
                            currentObj={item}
                            index={index}
                          />
                          <Divider className={classes.root} />
                        </div>
                      );
                    })}
                </Grid>
              </Grid>
            }
          />
        }
      />
    </Dialog>
  );
};

export default withStyles(styles)(TaskDialog);
