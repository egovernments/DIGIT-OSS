import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { Screen } from "modules/common";
import React, { Component } from "react";
import { connect } from "react-redux";
import "./index.css";
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  menu: {
    width: 200,
  },

});

class PushLocalization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelName: '',
      labelMsg: '',
      locale: '',
      module: '',
    };
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  localizaionSubmit = async () => {
    const { labelName, labelMsg, module, locale } = this.state;
    const { toggleSnackbarAndSetText } = this.props;

    if (labelName && labelMsg && module && locale) {
      const requestBody = {
        "tenantId": "pb",
        "messages": [
          {
            "code": this.state.labelName,
            "message": this.state.labelMsg,
            "module": this.state.module,
            "locale": this.state.locale
          }]
      }
      try {
        const submit = await httpRequest(
          "post",
          "localization/messages/v1/_upsert",
          "_upsert",
          [],
          requestBody
        );
        if (submit) {
          toggleSnackbarAndSetText(
            true,
            {
              labelKey: "Message updated successfully",
            },
            "success"
          )
        }

      }
      catch (e) {
      }
    } else {
      toggleSnackbarAndSetText(
        true,
        {
          labelKey: "Please fill all the fields",
        },
        "warning"
      )

    }

  }


  render() {
    const { classes } = this.props;
    return (
      <Screen>
        <h2>Push Localization</h2>
        <TextField
          id="name"
          label="code"
          className={classes.textField}
          value={this.state.labelName}
          onChange={this.handleChange('labelName')}
          margin="normal"
          required="true"
        />
        <TextField
          id="name"
          label="message"
          className={classes.textField}
          value={this.state.labelMsg}
          onChange={this.handleChange('labelMsg')}
          margin="normal"
          required="true"
        />
        <TextField
          id="name"
          label="locale"
          className={classes.textField}
          value={this.state.locae}
          onChange={this.handleChange('locale')}
          margin="normal"
          required="true"
        />
        <TextField
          id="name"
          label="module"
          className={classes.textField}
          value={this.state.module}
          onChange={this.handleChange('module')}
          margin="normal"
          required="true"
        />
        <div onClick={this.localizaionSubmit}>
          <Button variant="contained" color="secondary" className={classes.button}>
            Submit
        </Button>
        </div>

      </Screen>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, variant) =>
      dispatch(toggleSnackbarAndSetText(open, message, variant))
  };
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(PushLocalization)
);

