import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { withStyles } from "@material-ui/core/styles";
import "./index.css"
import Icon from "egov-ui-framework/ui-atoms/Icon";

const styles = theme => ({
  root: {
  },
  paper: {
    marginRight: theme.spacing.unit * 2
  },
  button: {
    borderBottom : "1px solid rgb(0,0,0,0.12)"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class MenuListComposition extends React.Component {
  state = {
    open: false
  };

  handleToggle = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    const { classes, data } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.root} data-html2canvas-ignore={true}>
        <div>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            {...data.props}
          >
            {data.leftIcon && <Icon className={classes.leftIcon} iconName={data.leftIcon} />}
              <LabelContainer labelName={data.label.labelName} labelKey={data.label.labelKey} style={{color:data.props.style.color}}/>
              <span style={{marginLeft:30 ,color : data.props.color}}> |  </span>
            <Icon className={classes.rightIcon} iconName={data.rightIcon} />
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal={false}>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList className="menu-list-style">
                      {data.menu.map((item, key) => {
                        const { labelName, labelKey } = item;
                        return (
                          <MenuItem key={key} onClick={item.link} className={classes.button}>
                            {item.leftIcon && <Icon
                              className={classes.leftIcon}
                              iconName={item.leftIcon}
                            />}
                            <LabelContainer
                              labelName={labelName}
                              labelKey={labelKey}
                            />
                            <Icon
                              className={classes.leftIcon}
                              iconName={item.rightIcon}
                            />
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

MenuListComposition.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuListComposition);
