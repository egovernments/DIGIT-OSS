import React, { Component } from "react";
import { Link } from "react-router-dom";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import { connect } from "react-redux";
import { TextFieldIcon, Icon } from "components";
import SearchIcon from "material-ui/svg-icons/action/search";
import { split, orderBy, some } from "lodash";
import "./index.css";

const styles = {
  menuStyle: {
    marginLeft: "-40px",
    width: "120px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },

  inputStyle: {
    color: "white !important",
    marginTop: "0px",
    marginLeft: "-10px",
  },
  fibreIconStyle: {
    height: "10px",
    width: "10px",
    margin: "20px 8px 24px 0px",
  },
  arrowIconStyle: {
    right: "-10px",
  },
};

// const

class ActionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      path: "",
      menuItems: [],
    };
    // this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentDidMount() {
    let pathParam = {
      path: "",
      parentMenu: true,
    };
    this.menuChange(pathParam);
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
  addMenuItems = (path, splitArray, menuItems, index) => {
    let { actionList } = this.props;
    if (splitArray.length > 1) {
      if (!some(menuItems, { name: splitArray[0] })) {
        menuItems.push({
          path: path != "" ? path + "." + splitArray[0] : "",
          name: splitArray[0],
          url: "",
          queryParams: actionList[index].queryParams,
          orderNumber: actionList[index].orderNumber,
          navigationURL: actionList[index].navigationURL,
        });
      }
    } else {
      menuItems.push({
        path: path != "" ? path + "." + splitArray[0] : "",
        name: actionList[index].displayName,
        url: actionList[index].url,
        queryParams: actionList[index].queryParams,
        orderNumber: actionList[index].orderNumber,
        navigationURL: actionList[index].navigationURL,
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
    let { actionList } = this.props;
    let menuItems = [];
    for (var i = 0; i < actionList.length; i++) {
      if (actionList[i].path !== "") {
        if (path && !path.parentMenu && actionList[i].path.startsWith(path + ".")) {
          let splitArray = actionList[i].path.split(path + ".")[1].split(".");
          this.addMenuItems(path, splitArray, menuItems, i);
        } else if (pathParam && pathParam.parentMenu) {
          let splitArray = actionList[i].path.split(".");
          this.addMenuItems(path, splitArray, menuItems, i);
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

      setRoute("/employee/all-complaints");
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

  render() {
    let { handleToggle, actionList } = this.props;
    let { searchText, modules, items, changeModulesActions, path, menuItems } = this.state;
    let { changeLevel, menuChange, changeRoute } = this;

    const showMenuItem = () => {
      if (searchText.length == 0) {
        return menuItems.map((item, index) => {
          if (!item.url) {
            return (
              <MenuItem
                key={index}
                style={{ whiteSpace: "initial" }}
                leftIcon={
                  <Icon name="fiber-manual-record" action="av" color="#ffffff" style={styles.fibreIconStyle} className="material-icons whiteColor" />
                }
                primaryText={
                  <div className="menuStyle whiteColor" style={styles.menuStyle}>
                    <span className="onHoverText hidden-xs">{item.name || ""}</span>
                    <span>{item.name || ""}</span>
                  </div>
                }
                rightIcon={
                  <Icon
                    name="chevron-right"
                    action="navigation"
                    color="#ffffff"
                    className="material-icons whiteColor"
                    style={styles.arrowIconStyle}
                  />
                }
                onTouchTap={() => {
                  let pathParam = {
                    path: !item.path ? item.name : item.path,
                    parentPath: false,
                  };
                  menuChange(pathParam);
                }}
              />
            );
          } else {
            if (item.navigationURL) {
              return (
                <Link key={index} to={`/employee/${item.navigationURL}`}>
                  <MenuItem
                    style={{ whiteSpace: "initial" }}
                    key={index}
                    onTouchTap={() => {
                      document.title = item.name;
                    }}
                    leftIcon={
                      <Icon
                        name="fiber-manual-record"
                        action="av"
                        color="#ffffff"
                        style={styles.fibreIconStyle}
                        className="material-icons whiteColor"
                      />
                    }
                    primaryText={
                      <div className="menuStyle whiteColor" style={styles.menuStyle}>
                        <span className="onHoverText hidden-xs">{item.name || ""}</span>
                        <span>{item.name || ""}</span>
                      </div>
                    }
                  />
                </Link>
              );
            }
          }
        });
      } else {
        return actionList.map((item, index) => {
          if (item.path && item.url && item.displayName.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
            if (item.navigationURL) {
              return (
                <Link key={index} to={`/employee/${item.navigationURL}`}>
                  <MenuItem
                    style={{ whiteSpace: "initial" }}
                    onTouchTap={() => {
                      document.title = item.displayName;
                    }}
                    leftIcon={
                      <Icon
                        name="fiber-manual-record"
                        action="av"
                        color="#ffffff"
                        style={styles.fibreIconStyle}
                        className="material-icons whiteColor"
                      />
                    }
                    primaryText={
                      <div className="menuStyle whiteColor" style={styles.menuStyle}>
                        <span className="onHoverText  hidden-xs">{item.displayName || ""}</span>
                        <span>{item.displayName || ""}</span>
                      </div>
                    }
                  />
                </Link>
              );
            }
          }
        });
      }
    };

    return (
      <div ref={this.setWrapperRef}>
        <div className="whiteColor" style={{ marginTop: "22px" }}>
          Quick Actions
        </div>
        {
          <TextFieldIcon
            hintText="Search"
            onChange={this.handleChange}
            value={searchText}
            className="actionMenuSearchBox"
            inputStyle={styles.inputStyle}
            iconPosition="before"
            Icon={SearchIcon}
            hintStyle={{ color: "#767676", fontSize: "14px", marginLeft: "-10px" }}
            iconStyle={{ height: "18px", width: "18px", top: "16px" }}
          />
        }

        <Menu disableAutoFocus={true} desktop={true} width="193" className="actionMenuMenu" menuItemStyle={{ width: "193px", paddingLeft: "0" }}>
          {(path || searchText) && (
            <div
              className="pull-left whiteColor pointerCursor"
              // style={{ marginLeft: 12, marginBottom: 10, cursor: 'pointer' }}
              onTouchTap={() => {
                changeLevel(path);
              }}
            >
              <Icon name="arrow-back" action="navigation" color="#ffffff" />
            </div>
          )}
          {path && (
            <div
              className="pull-right pointerCursor"
              // style={{ marginRight: 12, marginBottom: 10, cursor: 'pointer' }}
              onTouchTap={() => {
                changeLevel("");
              }}
            >
              <Icon name="home" action="action" color="#ffffff" />
            </div>
          )}

          <div className="clearfix" />

          <div style={{ paddingLeft: "-24px" }}>{showMenuItem()}</div>
        </Menu>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleToggle: (showMenu) => dispatch({ type: "MENU_TOGGLE", showMenu }),
  setRoute: (route) => dispatch({ type: "SET_ROUTE", route }),
});
export default connect(null, mapDispatchToProps)(ActionMenu);
