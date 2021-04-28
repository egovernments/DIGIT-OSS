import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Icon from "egov-ui-kit/components/Icon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Label from "egov-ui-kit/utils/translationNode";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import "./index.css";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: "12.5%",
  },
  paper: {
    borderRadius: 0,
    marginTop: 0,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    cursor: "pointer",
  },
  icon: {
    color: "#fe7a51",
  },
  item: {
    padding: 8,
  },
});

class ServiceList extends React.Component {
  state = {
    actionList: [],
  };
  componentWillReceiveProps(nextProps) {
    const { menu } = nextProps;
    const list = menu && menu.filter((item) => item.url === "card" && item.name.startsWith("rainmaker-citizen"));
    this.setState({
      actionList: list,
    });
  }
  render() {
    const { classes, history, setRoute } = this.props;
    const { actionList } = this.state;
    return (
      <Grid container>
        <Hidden smUp>
          {actionList.map((service) => {
            const translatedLabel = service.displayName.toUpperCase().replace(/[.:\-\s]/g, "_");

            return (
              <Grid item xs={3} sm={1} align="center">
                <Card
                  className={classes.paper}
                  /* onClick={(e) => {
                    history.push(service.navigationURL);
                  }} */
                  onClick={() => setRoute(service.navigationURL)}
                >
                  <CardContent classes={{ root: "card-content-style" }}>
                    <Icon className="service-icon" action={service.leftIcon.split(":")[0]} name={service.leftIcon.split(":")[1]} />
                    <Label className="service-label-cont" label={`ACTION_TEST_${translatedLabel}`} fontSize={12} color="rgba(0, 0, 0, 0.87)" />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Hidden>

        <Hidden xsDown>
          {actionList.map((service) => {
            const translatedLabel = service.displayName.toUpperCase().replace(/[.:\-\s]/g, "_");
            return (
              <Grid className={classes.root} item align="center">
                <Card
                  className={`${classes.paper} service-module-style`}
                  /* onClick={(e) => {
                    history.push(service.navigationURL);
                  }} */
                  onClick={() => setRoute(service.navigationURL)}
                >
                  <CardContent classes={{ root: "card-content-style" }}>
                    <Icon className="service-icon" action={service.leftIcon.split(":")[0]} name={service.leftIcon.split(":")[1]} />
                    <Label className="service-label-cont" label={`ACTION_TEST_${translatedLabel}`} fontSize={14} color="rgba(0, 0, 0, 0.87)" />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Hidden>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, app } = state;
  const { menu } = app;
  const { userInfo } = auth;
  const name = auth && userInfo.name;

  return { name, menu };
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(ServiceList)
);
