import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    width: 200,
    fontSize: "14px"
  },
  inputStyles: {
    fontSize: "14px !important"
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  inputLabelStyles: {
    color: "blue"
  },
  inputStyles: {
    fontSize: 14
  }
});

class DatePickerUi extends React.Component {
  render() {
    const {
      classes,
      onChange,
      value,
      label,
      placeholder,
      ...rest
    } = this.props;
    return (
      <TextField
        label={label}
        type="date"
        InputProps={{ classes: { input: classes.inputStyles } }}
        InputLabelProps={{
          shrink: true
          // style: { color: "#FE7A51" },
          // classes: { root: classes.inputStyles }
        }}
        // defaultValue="2017-05-24"
        value={value}
        onChange={onChange}
        fullWidth={true}
      />
    );
  }
}

export default withStyles(styles)(DatePickerUi);
