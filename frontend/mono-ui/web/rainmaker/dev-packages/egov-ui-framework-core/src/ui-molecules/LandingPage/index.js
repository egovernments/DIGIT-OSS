import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import LabelContainer from "../../ui-containers/LabelContainer";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    borderRadius: 0,
    marginTop: 0,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    cursor: "pointer"
  },
  icon: {
    color: "#fe7a51"
  },
  item: {
    padding: 8
  }
});

class LandingPage extends React.Component {
  onCardCLick = route => {
    const {
      screenConfig,
      handleField,
      setRoute,
      moduleName,
      jsonPath,
      value
    } = this.props;
    if (typeof route === "string") {
      setRoute(route);
    } else {
      if (moduleName === "fire-noc") {
        prepareFinalObject("FireNOCs", [
          { "fireNOCDetails.fireNOCType": "NEW" }
        ]);
      }
      let toggle = get(
        screenConfig[route.screenKey],
        `${route.jsonPath}.props.open`,
        false
      );
      handleField(route.screenKey, route.jsonPath, "props.open", !toggle);
    }
  };

  render() {
    const { classes, items, applicationCount } = this.props;
    return (
      <Grid container className="landing-page-main-grid">
        {items.map(obj => {
          return !obj.hide ? (
            <Grid
              className={classes.item}
              item
              xs={12 / items.length}
              sm={12 / items.length}
              align="center"
            >
              <Card
                className={`${classes.paper} module-card-style`}
                onClick={() => this.onCardCLick(obj.route)}
              >
                <CardContent classes={{ root: "card-content-style" }}>
                  {obj.icon}
                  <div>
                    <LabelContainer
                      labelKey={obj.label.labelKey}
                      labelName={obj.label.labelName}
                      style={{
                        fontSize: 14,
                        color: "rgba(0, 0, 0, 0.8700000047683716)"
                      }}
                      dynamicArray={applicationCount ? [applicationCount] : [0]}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ) : null;
        })}
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  const moduleName = get(state.screenConfiguration, "moduleName");
  const applicationCount = get(
    state.screenConfiguration.preparedFinalObject,
    "myApplicationsCount"
  );
  return { screenConfig, moduleName, applicationCount };
};

const mapDispatchToProps = dispatch => {
  return {
    handleField: (screenKey, jsonPath, fieldKey, value) =>
      dispatch(handleField(screenKey, jsonPath, fieldKey, value)),
    setRoute: path => dispatch(setRoute(path)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LandingPage)
);
