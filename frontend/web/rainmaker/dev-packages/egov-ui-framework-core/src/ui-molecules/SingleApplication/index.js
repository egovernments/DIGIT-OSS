import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Label from "../../ui-containers/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import "./index.css";
import { handleScreenConfigurationFieldChange as handleField } from "../../ui-redux/screen-configuration/actions";

const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};

class SingleApplication extends React.Component {
  onCardClick = item => {
    switch (item.status) {
      case "INITIATED":
        return `/tradelicense-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
      default:
        return `/tradelicence/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
    }
  };

  onButtonCLick = () => {
    const { setRoute } = this.props;
    setRoute("/tradelicense-citizen/home");
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

  render() {
    const { searchResults, onActionClick, classes } = this.props;
    return (
      <div className="application-card">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map(item => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  <div>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <Label
                          labelKey={"TL_COMMON_TABLE_COL_TRD_NAME"}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={item.tradeName}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <Label
                          labelKey="TL_COMMON_TABLE_COL_APP_NO"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={item.applicationNumber}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <Label
                          labelKey="TL_COMMON_TABLE_COL_OWN_NAME"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={item.tradeLicenseDetail.owners[0].name}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    {item.licenseNumber && (
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item xs={6}>
                          <Label
                            labelKey="PT_SEARCHPROPERTY_TABEL_EPID"
                            fontSize={14}
                            style={{
                              fontSize: 14,
                              color: "rgba(0, 0, 0, 0.60"
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Label
                            labelKey={item.licenseNumber}
                            style={{
                              fontSize: 14,
                              color: "rgba(0, 0, 0, 0.87"
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <Label
                          labelKey="TL_COMMON_TABLE_COL_STATUS"
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={item.status}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Link to={this.onCardClick(item)}>
                      <div onClick={onActionClick}>
                        <Label
                          labelKey={"TL_VIEW_DETAILS"}
                          textTransform={"uppercase"}
                          style={{
                            color: "#fe7a51",
                            fontSize: 14,
                            textTransform: "uppercase"
                          }}
                        />
                      </div>
                    </Link>
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
              <Label labelKey="NEW TRADE LICENSE" />
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
  )(SingleApplication)
);
