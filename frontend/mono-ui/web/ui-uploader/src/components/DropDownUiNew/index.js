import React from "react";
import PropTypes from "prop-types";
// import TextField from "material-ui/TextField";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

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
    fontSize: "14px"
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  inputStyles: {
    fontSize: 14
  }
});

class DropDownUi extends React.Component {
  render() {
    const {
      classes,
      onChange,
      value,
      label,
      placeholder,
      options = [],
      ...rest
    } = this.props;

    const renderSelectMenuItems = () => {
      return options.map((value, index) => {
        return (
          <MenuItem key={index} value={value} primaryText={value}>
            {value}
          </MenuItem>
        );
      });
    };

    return (
      <TextField
        label={label}
        select="true"
        placeholder={placeholder}
        InputProps={{ classes: { input: classes.inputStyles } }}
        InputLabelProps={{
          shrink: true
        }}
        underlineShow={false}
        value={value}
        onChange={onChange}
        fullWidth={true}
        {...rest}
      >
        {renderSelectMenuItems()}
      </TextField>
    );
  }
}

export default withStyles(styles)(DropDownUi);
