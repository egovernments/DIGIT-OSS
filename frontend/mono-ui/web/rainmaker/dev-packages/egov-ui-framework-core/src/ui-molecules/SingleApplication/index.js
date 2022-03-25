import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { epochToDate, getApplicationType } from "egov-ui-kit/utils/commons";
import { localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import React from "react";
import { connect } from "react-redux";
import { checkValueForNA } from "../../ui-config/screens/specs/utils";
import Label from "../../ui-containers/LabelContainer";
import "./index.css";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};


class SingleApplication extends React.Component {

  setBusinessServiceDataToLocalStorage = async (queryObject) => {
    const { toggleSnackbar } = this.props;
    try {
      const payload = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_search", "_search", queryObject);
      localStorageSet("businessServiceData", JSON.stringify(get(payload, "BusinessServices")));
      return get(payload, "BusinessServices");
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Not authorized to access Business Service!",
          labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE",
        },
        "error"
      );
    }
  };

  onCardClick = async (item) => {
    const { moduleName, toggleSnackbar, setRoute } = this.props;
    if (moduleName === "TL") {
      const wfCode = get(item, "workflowCode");
      const businessServiceQueryObject = [
        { key: "tenantId", value: get(item, "tenantId") },
        {
          key: "businessServices",
          value: wfCode
        }
      ];
      this.setBusinessServiceDataToLocalStorage(businessServiceQueryObject);
      switch (item.status) {
        case "INITIATED":
          
          if(item.applicationType=="RENEWAL"){
            setRoute(`/tradelicense-citizen/apply?applicationNumber=${item.applicationNumber}&licenseNumber=${item.licenseNumber}&action=EDITRENEWAL&tenantId=${item.tenantId}`);
          }else{
            setRoute(`/tradelicense-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
          }
          break;
        default:
          setRoute(`/tradelicence/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "FIRENOC") {
      switch (item.fireNOCDetails.status) {
        case "INITIATED":
          setRoute(`/fire-noc/apply?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`);
        default:
          setRoute(`/fire-noc/search-preview?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "BPAREG") {
      const userInfo = JSON.parse(getUserInfo());
      const roles = get(userInfo, "roles");
      if (item.serviceType === "BPAREG") {
        switch (item.status) {
          case "INITIATED":
            setRoute(`/bpastakeholder-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
            break;
          default:
            setRoute(`/bpastakeholder/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
        }
      } else if(item.serviceType === "BPA_OC") {
        switch (item.appStatus) {
          case "INITIATED":
            if(roles && roles.length == 1 && roles[0].code == "CITIZEN") {
              setRoute(`/oc-bpa/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}&type=${item.type}`);
            } else {
              setRoute(`/oc-bpa/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
            }
            break;
          default:
            setRoute(`/oc-bpa/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}&type=${item.type}`);
        }
      } else {
        switch (item.appStatus) {
          case "INITIATED":
            if(roles && roles.length == 1 && roles[0].code == "CITIZEN") {
              setRoute(`/egov-bpa/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}&type=${item.type}`);
            } else {
              setRoute(`/egov-bpa/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
            }
            break;
          default:
            setRoute(`/egov-bpa/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}&type=${item.type}`);
        }
      }
    } else if (moduleName === "PT-MUTATION") {
      if (item.acknowldgementNumber) {
        const businessService = await getApplicationType(item.acknowldgementNumber, item.tenantId, item.creationReason)
        if (businessService) {
          // navigateToApplication(businessService, this.props.history, item.acknowldgementNumber, item.tenantId, item.propertyId);
          if (businessService == 'PT.MUTATION') {
            setRoute("/pt-mutation/search-preview?applicationNumber=" + item.acknowldgementNumber + "&propertyId=" + item.propertyId + "&tenantId=" + item.tenantId);
          } else if (businessService == 'PT.CREATE') {
            setRoute("/property-tax/application-preview?propertyId=" + item.propertyId + "&applicationNumber=" + item.acknowldgementNumber + "&tenantId=" + item.tenantId + "&type=property");
          }else if (businessService == 'PT.UPDATE') {
            setRoute("/property-tax/application-preview?propertyId=" + item.propertyId + "&applicationNumber=" + item.acknowldgementNumber + "&tenantId=" + item.tenantId + "&type=updateProperty");
          }else if (businessService == 'PT.LEGACY') {
            setRoute("/property-tax/application-preview?propertyId=" + item.propertyId + "&applicationNumber=" + item.acknowldgementNumber + "&tenantId=" + item.tenantId + "&type=legacy");
          } 
        } else {
          toggleSnackbar(
            true,
            {
              labelName: "Business service returns empty response!",
              labelKey: "Business service returns empty response!",
            },
            "error"
          );
        }
      }
    }
  };

  onButtonCLick = () => {
    const { setRoute, homeURL } = this.props;
    setRoute(homeURL);
  };
  generatevalidity = (item) => {
    const validFrom = item.validFrom ? convertEpochToDate(get(item, "validFrom")) : "NA";
    const validTo = item.validTo ? convertEpochToDate(get(item, "validTo")) : "NA";
    const validity = validFrom + " - " + validTo;
    return validity;
  }
  generateLabelKey = (content, item) => {
    let LabelKey = "";
    if (content.prefix && content.suffix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath, "").replace(
        /[._:-\s\/]/g,
        "_"
      )}${content.suffix}`;
    } else if (content.prefix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath, "").replace(
        /[._:-\s\/]/g,
        "_"
      )}`;
    } else if (content.suffix) {
      LabelKey = `${get(item, content.jsonPath, "").replace(/[._:-\s\/]/g, "_")}${
        content.suffix
        }`;
    } else {
      LabelKey = content.label === "PT_MUTATION_CREATION_DATE" ? `${epochToDate(get(item, content.jsonPath, ""))}` : `${get(item, content.jsonPath, "")}`;
    }
    return LabelKey;
  };

  render() {
    const { searchResults, classes, contents, moduleName, setRoute } = this.props;
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
                    {moduleName === "TL" &&
                      <div>
                        <Grid container style={{ marginBottom: 12 }}>
                          <Grid item xs={6}>
                            <Label
                              labelKey="TL_COMMON_TABLE_VALIDITY"
                              fontSize={14}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.60"
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Label
                              labelKey={this.generatevalidity(item)}
                              fontSize={14}
                              checkValueForNA={checkValueForNA}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.87"
                              }}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }

                    {/* <Link to={this.onCardClick(item)}> */}
                    <div style={{ cursor: "pointer" }} onClick={() => {
                      const url = this.onCardClick(item);
                      // setRoute(url);
                    }}>
                      <Label
                        labelKey={(item.status === "APPROVED" || item.status === "EXPIRED") && moduleName === "TL" ? "TL_VIEW_DETAILS_RENEWAL" : "TL_VIEW_DETAILS"}
                        textTransform={"uppercase"}
                        style={{
                          color: "#fe7a51",
                          fontSize: 14,
                          textTransform: "uppercase"
                        }}
                      />
                    </div>
                    {/* </Link> */}
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
  const searchResultsRaw = get(
    state.screenConfiguration.preparedFinalObject,
    "searchResults",
    []
  );
  let searchResults = orderBy(
    searchResultsRaw,
    ["auditDetails.lastModifiedTime"],
    ["desc"]);
  searchResults = searchResults ? searchResults : searchResultsRaw;
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, searchResults };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path)),
    toggleSnackbar: (open, message, type) => dispatch(toggleSnackbar(open, message, type))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleApplication)
);
