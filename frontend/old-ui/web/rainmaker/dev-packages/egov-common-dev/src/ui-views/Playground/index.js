import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Drawer,
  Div,
  Toolbar,
  Typegraphy,
  Icon
} from "egov-ui-framework/ui-atoms";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import styles from "./css";
import { compose } from "recompose";
import ReactJson from "react-json-view";
import { screenHoc } from "egov-ui-framework/ui-hocs";
import CommonView from "egov-ui-framework/ui-molecules/CommonView";
import defaultScreenConfig from "../../ui-config/screens/specs/egov-common/pay";

const initScreenConfig = defaultScreenConfig;

class Playground extends React.Component {
  state = {
    mobileOpen: false,
    screenConfig: initScreenConfig,
    view: null
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  componentDidMount() {
    const { screenConfig } = this.state;
    this.initScreen(screenConfig);
  }

  initScreen = screenConfig => {
    const hasOwnConfig = true;
    this.setState({
      view: screenHoc({ hasOwnConfig, screenConfig })(CommonView)
    });
  };

  updateScreen = (jsonStatus, action) => {
    this.initScreen(jsonStatus.updated_src);
  };

  render() {
    const { updateScreen } = this;
    const { classes, theme } = this.props;
    const { view: View, screenConfig } = this.state;

    const drawer = (
      <Div>
        <AppBar style={{ backgroundColor: "#880E4F" }}>
          <Toolbar>
            <Typegraphy variant="title" color="inherit" noWrap>
              Screen configuration
            </Typegraphy>
          </Toolbar>
        </AppBar>
        <br />
        <ReactJson
          src={screenConfig}
          displayDataTypes={false}
          collapsed={2}
          onAdd={add => {
            updateScreen(add, "add");
          }}
          onDelete={del => {
            updateScreen(del, "del");
          }}
          onEdit={edit => {
            updateScreen(edit, "edit");
          }}
          onSelect={select => {
            console.log(select);
          }}
        />
      </Div>
    );
    return (
      <Div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <Icon iconName="menu" />
            </IconButton>
            <Typegraphy variant="title" color="inherit" noWrap>
              Mihy Playground
            </Typegraphy>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {View && <View />}
        </main>
      </Div>
    );
  }
}

Playground.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default compose(withStyles(styles, { withTheme: true }))(Playground);
