import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Label from "egov-ui-framework/ui-containers/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import "./index.css";
import { checkValueForNA } from "egov-ui-framework/ui-config/screens/specs/utils";
const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};

class EdcrSingleApplication extends React.Component {
  onCardClick1 = item => {
    item && item.dxfFile && window.open(item.dxfFile);
  };
  onCardClick2 = item => {
    item && item.planReport && window.open(item.planReport);
  };

  onButtonCLick = () => {
    const { setRoute, homeURL } = this.props;
    setRoute(homeURL);
    // let toggle = get(
    //   screenConfig["my-applications"],
    //   "components.cityPickerDialog.props.open",
    //   false
    // );
    // handleField(
    //   "my-applications",
    //   "components.cityPickerDialog",
    //   "props.open",
    //   !toggle
    // );
  };
  generateLabelKey = (content, item) => {
    let LabelKey = "";
    if (content.prefix && content.suffix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath)
        .toUpperCase()
        .replace(/[._:-\s\/]/g, "_")}${content.suffix}`;
    } else if (content.prefix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath)
        .toUpperCase()
        .replace(/[._:-\s\/]/g, "_")}`;
    } else if (content.suffix) {
      LabelKey = `${get(item, content.jsonPath)
        .toUpperCase()
        .replace(/[._:-\s\/]/g, "_")}${content.suffix}`;
    } else {
      LabelKey = `${get(item, content.jsonPath)}`;
    }
    return LabelKey;
  };

  render() {
    const { searchResults, classes, contents, moduleName } = this.props;
    return (
      <div className="application-card">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map(item => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  <div>
                    {contents.map(content => {
                      return (
                        <Grid container style={{ marginBottom: 12 }}>
                          <Grid item xs={6}>
                            <Label
                              labelKey={content.label}
                              fontSize={14}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.60"
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Label
                              labelKey={this.generateLabelKey(content, item)}
                              fontSize={14}
                              checkValueForNA={checkValueForNA}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.87"
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <div
                          onClick={() => this.onCardClick1(item)}
                          className="myclassPointer"
                        >
                          <Label
                            labelKey={"EDCR_DOWNLOAD_BUILDING_PLAN"}
                            textTransform={"uppercase"}
                            style={{
                              color: "#fe7a51",
                              fontSize: 14,
                              textTransform: "uppercase"
                            }}
                          />
                        </div>
                      </Grid>
                      {item.status.toUpperCase() !== "ABORTED" ? (
                        <Grid item xs={6}>
                          <div
                            onClick={() => this.onCardClick2(item)}
                            className="myclassPointer"
                          >
                            <Label
                              labelKey={"EDCR_DOWNLOAD_REPORT"}
                              textTransform={"uppercase"}
                              style={{
                                color: "#fe7a51",
                                fontSize: 14,
                                textTransform: "uppercase"
                              }}
                            />
                          </div>
                        </Grid>
                      ) : null}
                    </Grid>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="no-assessment-message-cont">
            <Label
              labelKey={"No results Found!"}
              style={{ marginBottom: 10 }}
            />
            <Button
              style={{
                height: 36,
                lineHeight: "auto",
                minWidth: "inherit"
              }}
              className="assessment-button"
              variant="contained"
              color="primary"
              onClick={this.onButtonCLick}
            >
              <Label labelKey={`${moduleName}_NEW_APPLICATION`} />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const searchResults = get(
    state.screenConfiguration.preparedFinalObject,
    "searchResults",
    []
  );
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, searchResults };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path))
    // handleField: (screenKey, jsonPath, fieldKey, value) =>
    //   dispatch(handleField(screenKey, jsonPath, fieldKey, value))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EdcrSingleApplication)
);
