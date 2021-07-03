import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";

const styles = {
  Icon: {
    backgroundColor: "#f2f2f2",
    borderRadius: "100%",
    width: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px"
  },
};

class PermitListCondition extends Component {
  render() {
    const { classes, data } = this.props;
    return (
      <div>
        {data && data.length > 0 &&
          data.map((conditions, key) => {
            return (
                <Grid container={true}>
                    <Grid item={true}>
                        <div className={classes.Icon}>
                            <span>{key + 1}</span>
                        </div>
                    </Grid>
                    <Grid  item={true} xs={10} sm={5} md={11}>
                        <LabelContainer
                        labelKey={conditions}
                        />
                    </Grid>
              </Grid>
            );
          })}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const data = get(
    screenConfiguration.preparedFinalObject,
    ownProps.sourceJsonPath,
    []
  );
  return { data };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  null
)(PermitListCondition));