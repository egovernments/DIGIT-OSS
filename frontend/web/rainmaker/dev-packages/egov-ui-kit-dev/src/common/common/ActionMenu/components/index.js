import React, { Component } from "react";
import { Link } from "react-router-dom";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import { connect } from "react-redux";
import { Icon } from "components";
import get from "lodash/get";
import { split, orderBy, some } from "lodash";
import { fetchFromLocalStorage } from "egov-ui-kit/utils/commons";
import { TextFieldIcon } from "components";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Tooltip from "@material-ui/core/Tooltip";
import Label from "egov-ui-kit/utils/translationNode";
import { localStorageSet, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";

const styles = {
  inputStyle: {
    color: "white !important",
    marginTop: "0px",
    marginLeft: "-10px",
  },
  fibreIconStyle: {
    height: "21px",
    width: "21px",
    margin: 0,
    position: "relative",
  },
  arrowIconStyle: {
    right: "-10px",
  },
  defaultMenuItemStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 0,
    padding: 0,
    paddingLeft: 0,
  },
  inputIconStyle: {
    margin: "0",
    bottom: "15px",
    top: "auto",
    right: "6px",
  },
  textFieldStyle: {
    height: "auto",
    textIndent: "15px",
  },
  inputStyle: {
    color: "#FE7A51",
    bottom: "5px",
    height: "auto",
    paddingLeft: "5px",
    textIndent: "5px",
    marginTop: 0,
  },
};

class ActionMenuComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      path: "",
      menuItems: [],
      selectedMenuIndex: 0,
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidMount() {
    // for better reusability moving out
    this.initialMenuUpdate();
  }
  initialMenuUpdate() {
    let pathParam = {};
    const menuPath = fetchFromLocalStorage("menuPath");
    pathParam = {
      path: "",
      parentMenu: true,
    };
    const url = get(window, "location.pathname")
      .split("/")
      .pop();
    if (url !== "inbox" && menuPath) {
      const menupathArray = menuPath && menuPath.split(".");
      if (menupathArray && menupathArray.length > 1) {
        menupathArray.pop();
        pathParam = {
          path: menupathArray.join("."),
          parentMenu: false,
        };
      }
    }
    let { actionListArr } = this.props;

    if (actionListArr) {
      this.menuChange(pathParam);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.activeRoutePath != this.props.activeRoutePath) {
      this.initialMenuUpdate();
      this.setState({
        searchText: "",
      });
    }
    /**
     * Reset menu after arraylist changes
     */
    if (nextProps && nextProps.actionListArr != this.props.actionListArr) {
      this.initialMenuUpdate();
    }
  }
  changeModulesActions(modules, items) {
    this.setState({
      modules,
      items,
    });
  }

  handleChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  };
  addMenuItems = (path, splitArray, menuItems, index, leftIcon) => {
    let { role, actionListArr } = this.props;
    let actionList = actionListArr;
    //Check if this is last level menu
    if (splitArray.length > 1) {
      if (!some(menuItems, { name: splitArray[0] })) {
        menuItems.push({
          path: path != "" ? path + "." + splitArray[0] : "",
          name: splitArray[0],
          url: "",
          queryParams: actionList[index].queryParams,
          orderNumber: actionList[index].orderNumber,
          navigationURL: actionList[index].navigationURL,
          leftIcon,
        });
      }
    } else {
      menuItems.push({
        path: path != "" ? path + "." + splitArray[0] : "",
        name: actionList[index].displayName, // Displayname in last level menuItem
        url: actionList[index].url,
        queryParams: actionList[index].queryParams,
        orderNumber: actionList[index].orderNumber,
        navigationURL: actionList[index].navigationURL,
        leftIcon,
      });
    }
    menuItems = orderBy(menuItems, ["orderNumber"], ["asc"]);
    this.setState({
      menuItems,
      path,
    });
  };
  menuChange = (pathParam) => {
    let path = pathParam.path;
    let { role, actionListArr } = this.props;
    let actionList = actionListArr;
    let menuItems = [];
    for (var i = 0; i < (actionList && actionList.length); i++) {
      if (actionList[i].path !== "") {
        if (path && !path.parentMenu && actionList[i].path.startsWith(path + ".")) {
          let splitArray = actionList[i].path.split(path + ".")[1].split(".");
          let leftIconArray = actionList[i].leftIcon.split(".");
          let leftIcon =
            leftIconArray &&
            (leftIconArray.length > path.split(".").length
              ? leftIconArray[path.split(".").length]
              : leftIconArray.length >= 1
              ? leftIconArray[leftIconArray.length - 1]
              : null);
          this.addMenuItems(path, splitArray, menuItems, i, leftIcon);
        } else if (pathParam && pathParam.parentMenu && actionList[i].navigationURL) {
          let splitArray = actionList[i].path.split(".");
          let leftIconArray = actionList[i].leftIcon.split(".");
          let leftIcon = leftIconArray && leftIconArray.length >= 1 ? leftIconArray[0] : null;
          this.addMenuItems(path, splitArray, menuItems, i, leftIcon);
        }
      }
    }
  };

  changeLevel = (path) => {
    let { searchText } = this.state;
    let { setRoute } = this.props;

    if (!path) {
      let pathParam = {
        path: "",
        parentMenu: true,
      };
      this.menuChange(pathParam);
      setRoute("/");
    } else {
      let splitArray = split(path, ".");
      var x = splitArray.slice(0, splitArray.length - 1).join(".");
      if (x != "" && splitArray.length > 1) {
        let pathParam = {
          path: x,
          parentMenu: false,
        };
        this.menuChange(pathParam);
      } else {
        let pathParam = {
          path: "",
          parentMenu: true,
        };
        this.menuChange(pathParam);
      }
    }
  };

  changeRoute = (route) => {
    let { setRoute } = this.props;
    setRoute(route);
  };

  renderLeftIcon(leftIcon = [], item) {
    let { menuDrawerOpen } = this.props;
    if (leftIcon.length >= 2) {
      return (
        <Icon
          name={leftIcon[1]}
          action={leftIcon[0]}
          // color="rgba(255, 255, 255, 0.87)"
          style={styles.fibreIconStyle}
          className={`iconClassHover menu-right-icon material-icons whiteColor custom-style-for-${item.leftIcon.name}`}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    let { role, actionListArr, activeRoutePath, updateActiveRoute, toggleDrawer, menuDrawerOpen } = this.props;
    let { searchText, path, menuItems } = this.state;
    let { changeLevel, menuChange } = this;
    let actionList = actionListArr;
    let menuTitle = path.split(".");
    let activeItmem = localStorageGet("menuName");
    const showMenuItem = () => {
      const navigationURL = window.location.href.split("/").pop();
      if (searchText.length == 0) {
        return menuItems.map((item, index) => {
          let iconLeft;
          if (item.leftIcon) {
            iconLeft = item.leftIcon.split(":");
          }
          if (!item.url) {
            return (
              <div className="sideMenuItem">
                {/* <Tooltip
                  id={"menu-toggle-tooltip"}
                  title={<Label defaultLabel={menuDrawerOpen ? "" : item.name} label={menuDrawerOpen ? "" : `ACTION_TEST_${item.name}`} />}
                  placement="right"
                > */}
                <MenuItem
                  key={index}
                  id={item.name.toUpperCase().replace(/[\s]/g, "-") + "-" + index}
                  innerDivStyle={styles.defaultMenuItemStyle}
                  style={{ whiteSpace: "initial" }}
                  leftIcon={this.renderLeftIcon(iconLeft, item)}
                  primaryText={
                    <Label
                      className="menuStyle with-childs menu-label-style"
                      //defaultLabel={item.name}
                      label={item.name ? `ACTION_TEST_${item.name.toUpperCase().replace(/[.:-\s\/]/g, "_")}` : ""}
                      // color="rgba(255, 255, 255, 0.87)"
                    />
                  }
                  rightIcon={
                    <Icon
                      name="chevron-right"
                      action="navigation"
                    //  color="rgba(255, 255, 255, 0.87)"
                    className="iconClassHover material-icons whiteColor menu-right-icon"
                      style={styles.arrowIconStyle}
                    />
                  }
                  onClick={() => {
                    let pathParam = {
                      path: !item.path ? item.name : item.path,
                      parentPath: false,
                    };
                    toggleDrawer && toggleDrawer();
                    menuChange(pathParam);
                  }}
                />
                {/* </Tooltip> */}
              </div>
            );
          } else {
            if (item.navigationURL && item.navigationURL !== "newTab") {
              return (
                <Link
                  style={{ textDecoration: "none" }}
                  key={index}
                  to={item.navigationURL === "/" ? `${item.navigationURL}` : `/${item.navigationURL}`}
                >
                  <div className={`sideMenuItem ${activeItmem == item.name ? "selected" : ""}`}>
                    {/* <Tooltip
                      id={"menu-toggle-tooltip"}
                      title={<Label defaultLabel={menuDrawerOpen ? "" : item.name} label={menuDrawerOpen ? "" : `ACTION_TEST_${item.name}`} />}
                      placement="right"
                    > */}
                    <MenuItem
                      innerDivStyle={styles.defaultMenuItemStyle}
                      style={{ whiteSpace: "initial" }}
                      key={index}
                      id={item.name.toUpperCase().replace(/[\s]/g, "-") + "-" + index}
                      onClick={() => {
                        //  localStorageSet("menuPath", item.path);
                        updateActiveRoute(item.path, item.name);
                        document.title = item.name;
                        toggleDrawer && toggleDrawer();
                        if (window.location.href.indexOf(item.navigationURL) > 0 && item.navigationURL.startsWith("integration")) {
                          window.location.reload();
                        }
                      }}
                      leftIcon={this.renderLeftIcon(iconLeft, item)}
                      primaryText={
                        <Label
                          className="menuStyle"
                          //defaultLabel={item.name}
                          label={item.name ? `ACTION_TEST_${item.name.toUpperCase().replace(/[.:-\s\/]/g, "_")}` : ""}
                     //   color="rgba(255, 255, 255, 0.87)"
                        />
                      }
                    />
                    {/* </Tooltip> */}
                  </div>
                </Link>
              );
            } else {
              return (
                <a href={item.url} target="_blank">
                  <div className="sideMenuItem">
                    {/* <Tooltip
                      id={"menu-toggle-tooltip"}
                      title={<Label defaultLabel={menuDrawerOpen ? "" : item.name} label={menuDrawerOpen ? "" : `ACTION_TEST_${item.name}`} />}
                      placement="right"
                    > */}
                    <MenuItem
                      innerDivStyle={styles.defaultMenuItemStyle}
                      style={{ whiteSpace: "initial" }}
                      id={item.name.toUpperCase().replace(/[\s]/g, "-") + "-" + index}
                      key={index}
                      onClick={() => {
                        localStorageSet("menuPath", item.path);
                        document.title = item.name;
                      }}
                      leftIcon={this.renderLeftIcon(iconLeft, item)}
                      primaryText={
                        <Label
                          className="menuStyle"
                          //defaultLabel={item.name}
                          label={item.name ? `ACTION_TEST_${item.name.toUpperCase().replace(/[.:-\s\/]/g, "_")}` : ""}
                         // color="rgba(255, 255, 255, 0.87)"
                        />
                      }
                    />
                    {/* </Tooltip> */}
                  </div>
                </a>
              );
            }
          }
        });
      } else {
        return (
          actionList &&
          actionList.map((item, index) => {
            let iconLeft;
            if (item.leftIcon) {
              iconLeft = item.leftIcon.split(":");
            }
            if (item.path && item.url && item.displayName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              if (item.navigationURL) {
                return (
                  <Link
                    style={{ textDecoration: "none" }}
                    key={index}
                    to={item.navigationURL === "/" ? `${item.navigationURL}` : `/${item.navigationURL}`}
                  >
                    <div className="sideMenuItem">
                      {/* <Tooltip
                        id={"menu-toggle-tooltip"}
                        title={<Label defaultLabel={menuDrawerOpen ? "" : item.name} label={menuDrawerOpen ? "" : `ACTION_TEST_${item.name}`} />}
                        placement="right"
                      > */}
                      <MenuItem
                        innerDivStyle={styles.defaultMenuItemStyle}
                        style={{ whiteSpace: "initial" }}
                        id={item.name.toUpperCase().replace(/[\s]/g, "-") + "-" + index}
                        onClick={() => {
                          document.title = item.displayName;
                          toggleDrawer && toggleDrawer();
                          updateActiveRoute(item.path, item.displayName);
                        }}
                        leftIcon={this.renderLeftIcon(iconLeft, item)}
                        primaryText={
                          <Label
                            className="menuStyle"
                            //defaultLabel={item.displayName}
                            label={item.name ? `ACTION_TEST_${item.displayName.toUpperCase().replace(/[.:-\s\/]/g, "_")}` : ""}
                           // color="rgba(255, 255, 255, 0.87)"
                          />
                        }
                      />
                      {/* </Tooltip> */}
                    </div>
                  </Link>
                );
              }
            }
          })
        );
      }
    };

    return actionList ? (
      <div ref={this.setWrapperRef}>
        <div className="whiteColor" />
        <div className="menu-item-title">
          <Label
              className="menuStyle"
            label={
              menuTitle && menuTitle[menuTitle.length - 1]
                ? `ACTION_TEST_${menuTitle[menuTitle.length - 1].toUpperCase().replace(/[.:-\s\/]/g, "_")}`
                : ""
            }
          />
        </div>
        <Menu
          disableAutoFocus={true}
          desktop={true}
          autoWidth={false}
          style={{ width: "100%" }}
          className="actionMenuMenu"
          menuItemStyle={{ paddingLeft: "0", width: "100%" }}
        >
          {!path && (
            <div
              className="menu-search-container"
              onClick={() => {
                toggleDrawer && toggleDrawer();
              }}
            >
              <TextFieldIcon
                className="menu-label-style"
                value={searchText}
                hintText={<Label label="PT_SEARCH_BUTTON" className="menuStyle" />}
                iconStyle={styles.inputIconStyle}
                inputStyle={styles.inputStyle}
                textFieldStyle={styles.textFieldStyle}
                iconPosition="before"
                onChange={(e) => {
                  this.handleChange(e);
                }}
              />
            </div>
          )}
          {(path || searchText) && (
            <div
              className="pull-left whiteColor pointerCursor"
              onClick={() => {
                toggleDrawer && toggleDrawer();
                changeLevel(path);
              }}
            >
              <Icon  className = "menu-right-icon" name="arrow-back" action="navigation" />
            </div>
          )}
          {path && (
            // <Tooltip
            //   id={"menu-toggle-tooltip"}
            //   title={<Label defaultLabel={"Home"} label={menuDrawerOpen ? "" : "CS_HOME_HEADER_HOME"} />}
            //   placement="right"
            // >
            <div
              className="pull-right pointerCursor"
              onClick={() => {
                // changeLevel("");
                updateActiveRoute("Home", "Home");
                this.changeRoute("/");
              }}
            >
              <Icon  className = "menu-label-style" name="home" action="action" />
            </div>
            // </Tooltip>
          )}

          <div className="clearfix" />

          <div style={{ paddingLeft: "-24px" }}>{showMenuItem()}</div>
          {toggleDrawer ? (
            <div className="sideMenuItem drawer-collapse-menu-item">
              {/* <Tooltip
                id={"menu-toggle-tooltip"}
                title={<Label defaultLabel={"Expand Menu"} label={menuDrawerOpen ? "" : "COMMON_ACTION_TEST_EXPAND_MENU"} />}
                placement="right"
              > */}
              <MenuItem
                innerDivStyle={styles.defaultMenuItemStyle}
                style={{ whiteSpace: "initial" }}
                onClick={() => {
                  toggleDrawer && toggleDrawer(false);
                }}
                leftIcon={
                  menuDrawerOpen ? (
                    <ChevronLeftIcon style={styles.fibreIconStyle} className="iconClassHover material-icons whiteColor" />
                  ) : (
                    <ChevronRightIcon style={styles.fibreIconStyle} className="iconClassHover material-icons whiteColor" />
                  )
                }
                primaryText={
                  <Label
                    className="menuStyle"
                    defaultLabel="COMMON_ACTION_TEST_COLLAPSE"
                    label={menuDrawerOpen ? "COMMON_ACTION_TEST_COLLAPSE" : ""}
                  //  color="rgba(255, 255, 255, 0.87)"

                  />
                }
              />
              {/* </Tooltip> */}
            </div>
          ) : (
            ""
          )}
        </Menu>
      </div>
    ) : null;
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleToggle: (showMenu) => dispatch({ type: "MENU_TOGGLE", showMenu }),
  setRoute: (route) => dispatch({ type: "SET_ROUTE", route }),
});
export default connect(
  null,
  mapDispatchToProps
)(ActionMenuComp);
