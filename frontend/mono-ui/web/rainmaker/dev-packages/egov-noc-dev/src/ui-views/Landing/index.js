import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Drawer,
  Div,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Typegraphy,
  Icon,
  Main
} from "egov-ui-framework/ui-atoms";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import RenderRoutes from "egov-ui-framework/ui-molecules/RenderRoutes";
import appRoutes from "../../ui-config/routes/mihy";
import styles from "./css";
import { compose } from "recompose";
import { connect } from "react-redux";
import { logout } from "egov-ui-framework/ui-redux/auth/actions";

class Landing extends React.Component {
  state = {
    mobileOpen: false
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  logout = async () => {};

  render() {
    const { classes, theme, match, logout } = this.props;

    const drawer = (
      <Div>
        <Div className={classes.toolbar} />

        <List>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component="a" href="#simple-list">
            <ListItemText primary="Edit Profile" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Contact Us" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              logout();
            }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
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
              Rainmaker
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
        <Main className={classes.content}>
          <div className={classes.toolbar} />
          <RenderRoutes basePath={match.url} routes={appRoutes} />
        </Main>
      </Div>
    );
  }
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withStyles(styles, { withTheme: true })
)(Landing);
