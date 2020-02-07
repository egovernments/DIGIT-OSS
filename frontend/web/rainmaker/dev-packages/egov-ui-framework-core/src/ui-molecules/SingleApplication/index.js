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
import { checkValueForNA } from "../../ui-config/screens/specs/utils";
const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};

class SingleApplication extends React.Component {
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
      if (item.serviceType === "BPAREG") {
        switch (item.status) {
          case "INITIATED":
            return `/bpastakeholder-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
          default:
            return `/bpastakeholder/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
        }
      } else {
        switch (item.status) {
          case "Inprogress":
          case "Initiated":
            return `/egov-bpa/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
          default:
            return `/egov-bpa/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`;
        }        
      }
    } else if (moduleName === "PT-MUTATION") {
      switch (item.fireNOCDetails.status) {
        case "INITIATED":
          return `/pt-mutation/apply?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`;
        default:
          return `/pt-mutation/search-preview?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`;
      }
    }
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
      LabelKey = `${content.prefix}${get(item, content.jsonPath,"").replace(
        /[._:-\s\/]/g,
        "_"
      )}${content.suffix}`;
    } else if (content.prefix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath,"").replace(
        /[._:-\s\/]/g,
        "_"
      )}`;
    } else if (content.suffix) {
      LabelKey = `${get(item, content.jsonPath,"").replace(/[._:-\s\/]/g, "_")}${
        content.suffix
      }`;
    } else {
      LabelKey = `${get(item, content.jsonPath,"")}`;
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
                    <Link to={this.onCardClick(item)}>
                      <div>
                        <Label
                          labelKey={ item.status==="APPROVED"&&moduleName === "TL" ? "TL_VIEW_DETAILS_RENEWAL":"TL_VIEW_DETAILS"}
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
  )(SingleApplication)
);
