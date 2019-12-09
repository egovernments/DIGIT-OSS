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

const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};

class SingleApplicationedcr extends React.Component {
  onCardClick = item => {
    const { moduleName } = this.props;
    if (moduleName === "TL") {
      switch (item.status) {
        case "INITIATED":
          return `/tradelicense-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
        default:
          return `/tradelicence/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
      }
    } else if (moduleName === "FIRENOC") {
      switch (item.fireNOCDetails.status) {
        case "INITIATED":
          return `/fire-noc/apply?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`;
        default:
          return `/fire-noc/search-preview?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`;
      }
    } else if (moduleName === "BPAREG") {
      switch (item.status) {
        case "INITIATED":
          return `/bpastakeholder-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
        default:
          return `/bpastakeholder/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
      }
    }
  };
  render() {
    const {
      searchResults,
      onActionClick,
      classes,
      city,
      applicationName,
      applicationNumber,
      status,
      statusPrefix
    } = this.props;
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
                          labelKey={applicationNumber.label}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={get(item, applicationNumber.jsonPath)}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <Label
                          labelKey={city.label}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={get(item, city.jsonPath)}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <Label
                          labelKey={applicationName.label}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={get(item, applicationName.jsonPath)}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item xs={6}>
                        <Label
                          labelKey={status.label}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Label
                          labelKey={`${statusPrefix}${get(
                            item,
                            status.jsonPath
                          )}`}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Link to={this.onCardClick(item)}>
                      <div>
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
  )(SingleApplicationedcr)
);
