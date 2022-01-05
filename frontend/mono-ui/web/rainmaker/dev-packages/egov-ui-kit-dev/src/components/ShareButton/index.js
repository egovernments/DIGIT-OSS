import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withStyles } from "@material-ui/core/styles";
import ShareIcon from "@material-ui/icons/Share";
import DialogWithTextBox from "../DialogWithTextBox";
import { sendMessageTo, sendMessageMedia } from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";
import { httpRequest } from "egov-ui-kit/utils/api";

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: 999,
  },
  menuItem: {
    zIndex: 99999,
  },
});

class MenuListComposition extends React.Component {
  state = {
    open: false,
    popOpen: false,
    lableText: "",
  };

  handleToggle = () => {
    this.setState((state) => ({ open: !state.open }));
  };

  handleClose = (event) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  componentDidMount() {
    this.props.onLoadFn();
  }
  popUp = (elem) => {
    this.setState({ lableText: elem });
    this.setState({ popOpen: true });
    this.props.sendMessageMedia(elem.toUpperCase());
  };

  closeDialog = () => {
    this.setState({ popOpen: false });
  };

  onSend = async (val) => {
    this.props.sendMessageTo(val);
    this.setState({ popOpen: false });
    const ShareMetaData = this.props;
    const payload = await httpRequest("/egov-ui-transform-service/share/v1/_create", "", [], ShareMetaData);
  };
  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const defaultShare = ["SMS", "Email", "Whatsapp"];
    const { extraShare } = this.props;
    const shareList = extraShare && extraShare instanceof Array ? [...defaultShare, ...extraShare] : defaultShare;
    return (
      <div className={classes.root}>
        <div className={classes.menuItem}>
          <Button
            buttonRef={(node) => {
              this.anchorEl = node;
            }}
            variant="fab"
            className={classes.fab}
            aria-owns={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            <ShareIcon />
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow {...TransitionProps} id="menu-list-grow" style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {shareList.map((elem, index) => (
                        <MenuItem key={index} value={index} onClick={(e) => this.popUp(elem)}>
                          {elem}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <DialogWithTextBox
            lableText={this.state.lableText}
            popOpen={this.state.popOpen}
            closeDialog={this.closeDialog}
            onSend={(a) => this.onSend(a)}
          />
        </div>
      </div>
    );
  }
}

MenuListComposition.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessageTo: (message) => dispatch(sendMessageTo(message)),
    sendMessageMedia: (message) => dispatch(sendMessageMedia(message)),
  };
};

const mapStateToProps = (state) => {
  const { complaints } = state;
  const { ShareMetaData } = complaints;
  return { ShareMetaData };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MenuListComposition));
