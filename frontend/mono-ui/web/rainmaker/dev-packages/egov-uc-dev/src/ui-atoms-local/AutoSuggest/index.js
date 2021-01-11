import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import "./index.css";
import { sortDropdownLabels, sortDropdownNames } from "egov-ui-framework/ui-utils/commons";

const getSuggestions = suggestions => {
  return (
    suggestions &&
    suggestions.length > 0 &&
    suggestions.map(suggestion => ({
      value: suggestion.code,
      label: suggestion.name
    })).sort(sortDropdownLabels)
  );
};

const styles = theme => ({
  ac_root: {
    flexGrow: 1,
    height: 250
  },
  ac_input: {
    display: "flex",
    padding: 0
  },
  ac_valueContainer: {
    display: "flex",
    // flexWrap: "wrap",
    flex: 1,
    alignItems: "center"
  },
  ac_noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  ac_singleValue: {
    fontSize: 16,
    marginBottom: 2
  },
  ac_placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16,
    color: "rgba(162, 162, 162, 0.77)"
  },
  ac_paper: {
    position: "absolute",
    zIndex: 1105,
    left: 0,
    right: 0,
    marginTop: theme.spacing.unit
  },
  ac_divider: {
    height: theme.spacing.unit * 2
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.ac_noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.ac_input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
      helperText={props.selectProps.helperText}
      error={props.selectProps.error}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.ac_placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.ac_singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.ac_valueContainer}>
      {props.children}
    </div>
  );
}

function Menu(props) {
  const { className } = props.selectProps.menuProps;
  return (
    <Paper
      square
      className={className ? className : props.selectProps.classes.ac_paper}
      {...props.innerProps}
      style={{}}
    >
      <div style={{}}>{props.children}</div>
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class IntegrationReactSelect extends React.Component {
  state = {
    single: null
  };

  componentDidMount = () => {
    const { fieldValue } = this.props;
    if (fieldValue && fieldValue.code) {
      this.setState({ single: fieldValue });
    }
  };

  handleChange = name => value => {
    this.setState({
      [name]: value
    });
    this.props.onSelect(value);
  };

  render() {
    const {
      classes,
      theme,
      suggestions,
      label,
      placeholder,
      fullwidth = true,
      required = true,
      value,
      className,
      inputLabelProps = {
        shrink: true
      },
      ...rest
    } = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };
    return (
      <div className={classes.root}>
        <Select
          classes={classes}
          styles={selectStyles}
          textFieldProps={{
            label: label,
            InputLabelProps: inputLabelProps,
            required: required,
            fullWidth: fullwidth
          }}
          menuProps={{
            className: className
          }}
          options={getSuggestions(suggestions) || []}
          components={components}
          value={value}
          placeholder={placeholder}
          {...rest}
          onChange={this.handleChange("single")}
        />
      </div>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);
