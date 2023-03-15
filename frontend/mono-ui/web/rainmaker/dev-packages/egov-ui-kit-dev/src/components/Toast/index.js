import React from "react";
import PropTypes from "prop-types";
import Label from "../../utils/translationNode";
import classNames from "classnames";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

// class Toast extends React.Component {
//   render() {
//     const { open = false, autoHideDuration = 4000, error = true, message, variant } = this.props;
//     const { labelKey } = message;
//     return (
//       <Snackbar
//         open={open}
//         id="toast-message"
//         // message={message}
//         message={<Label label={labelKey} color="#fff" />}
//         autoHideDuration={autoHideDuration}
//         style={{ pointerEvents: "none", width: "95%", whiteSpace: "nowrap", justifyContent: "center" }}
//         bodyStyle={{
//           pointerEvents: "initial",
//           maxWidth: "none",
//           lineHeight: "20px",
//           height: "auto",
//           maxHeight: "60px",
//           padding: "5px",
//           whiteSpace: "pre-line",
//           textAlign: "center",
//         }}
//       />
//     );
//   }
// }
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20,
    color: "#ffffff"
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center",
    color: "#ffffff"
  }
});

const MySnackbarContent = props => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const { labelName, labelKey } = message;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          <Label label={labelKey} color="#ffffff"/>
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
});


class Toast extends React.Component  {
  state = {
    open: false,
  };


  handleClose = (event, reason) => {
    const { toggleSnackbarAndSetText } = this.props;
    toggleSnackbarAndSetText(false,"", "");
  };
  
  render() {
    const {  autoHideDuration=5000,classes, open, message, variant } = this.props;
    return (
      <div>
        <Snackbar
          open={open}
          autoHideDuration={autoHideDuration}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            variant={variant? variant:"error"}
            className={classes.margin}
            message={message}
            onClose={this.handleClose}
          />
        </Snackbar>
      </div>
    );
  }
    
}

Toast.propTypes = {
  open: PropTypes.bool,
  variant: PropTypes.string,
  autoHideDuration: PropTypes.number,
  classes: PropTypes.object.isRequired
};



const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, variant) => {
      dispatch(toggleSnackbarAndSetText(open, message, variant));
    }
  };
};

export default withStyles(styles2)(
  connect(
    null,
    mapDispatchToProps
  )(Toast)
);
