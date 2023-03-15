import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Label from "../../ui-containers-local/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.css"
import { getDomainLink } from "../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";
import { handleAddress } from "../../ui-config/screens/specs/wns/searchResource/functions";

const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};



class MyConnections extends React.Component {
  
  getConnectionDetails = data => {
    store.dispatch(
      setRoute(
        `/wns/connection-details?connectionNumber=${data.connectionNo}&tenantId=${data.property.tenantId}&service=${data.service.toUpperCase()}&connectionType=${data.connectionType}`
      )
    );
  }

  getViewBillDetails = data => {
    store.dispatch(
      setRoute(
        `/wns/viewBill?connectionNumber=${data.connectionNo}&tenantId=${data.property.tenantId}&service=${data.service.toUpperCase()}&connectionType=${data.connectionType}`
      )
    );
  }

  // getConnectionDetails = data => {
  //   window.location.href = `${getDomainLink()}/wns/connection-details?connectionNumber=${data.connectionNo}&tenantId=${data.property.tenantId}&service=${data.service.toUpperCase()}&connectionType=${data.connectionType}`
  // }

  // getViewBillDetails = data => {
  //   window.location.href = `${getDomainLink()}/wns/viewBill?connectionNumber=${data.connectionNo}&tenantId=${data.property.tenantId}&service=${data.service.toUpperCase()}&connectionType=${data.connectionType}`
  // }


  render() {
    const { myConnectionResults, classes } = this.props;
    return (
      <div className="application-card">
        {myConnectionResults && myConnectionResults.length > 0 ? (
          myConnectionResults.map(item => {

            let formatAddress =handleAddress(item);

            return (
              <div>
                <Card className={classes.card}>
                  <CardContent>
                    <div>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_SERVICE"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <LabelContainer
                            labelName={item.service}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid>
                      {/* <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_APPLICATION_NO"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <LabelContainer
                            labelName={item.applicationNo}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid> */}
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_CONSUMER_NO"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <div className="linkStyle" onClick={() => this.getConnectionDetails(item)}>
                            <a> <Label
                              labelName={item.connectionNo}
                              fontSize={14}
                              style={{ fontSize: 14 }}
                            />
                            </a>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_STATUS"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <Label
                            labelName={item.status}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_OWNER_NAME"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          {(item.property && item.property.owners && item.property.owners !== "NA") ?
                            (<div><LabelContainer
                              labelName={item.property.owners.map(owner => owner.name).join(",")}
                              fontSize={14}
                              style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                            /></div>) :
                            (<div></div>)
                          }

                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTION_ADDRESS"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          {(item.property && item.property.address && formatAddress) ?
                            (<Label
                              labelName={formatAddress}
                              fontSize={14}
                              style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                            />) :
                            (<div></div>)
                          }

                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_DUE"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <Label
                            labelName={item.due ? item.due : "0"} onClick={() => item.due && this.getViewBillDetails(item)}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid>
                      <div>
                        {item.due === "NA" ?
                          (<div></div>)
                          : item.due === 0 ?
                            (<div> <LabelContainer
                              labelKey="WS_COMMON_PAID_LABEL"
                              style={{ color: '#008000', textTransform: 'uppercase', fontWeight: 400 }}
                            /></div>) :
                            !item.due ? (<div></div>) :
                            (<div className="linkStyle" onClick={() => this.getViewBillDetails(item)}>
                              <LabelContainer
                                labelKey="CS_COMMON_PAY"
                                style={{
                                  color: "#fe7a51",
                                  fontSize: 14,
                                }}
                              />
                            </div>)
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        ) : (
            <div style={{
              display: "flex",
              width: "100%",
              height: "50vh",
              alignItems: 'center',
              justifyContent: "center",
              textAlign: "center"
            }}>
              <LabelContainer
                labelKey={"No results Found!"}
                style={{ marginBottom: 10 }}
              />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const myConnectionResults = get(
    state.screenConfiguration.preparedFinalObject,
    "myConnectionResults",
    []
  );
  const myConnectionDue = get(
    state.screenConfiguration.preparedFinalObject,
    "myConnectionDue",
    []
  );
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, myConnectionResults, myConnectionDue };
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
  )(MyConnections)
);