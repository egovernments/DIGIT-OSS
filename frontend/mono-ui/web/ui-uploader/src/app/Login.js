import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import axios from "axios";
import * as apiEndpoints from "../constants/ApiEndpoints";
import { AppBar } from "material-ui";
import { connect } from "react-redux";
import { loginUser, userLoginSuccess } from "./actions";
import { Redirect } from "react-router-dom";
import { persistInLocalStorage } from "../utils";

class UserLogin extends Component {
  constructor() {
    super();
    this.state = {
      cities: []
    };
  }
  handleClick() {
    let { history } = this.props;
    if (this.state) {
      const username = this.state.username;
      const password = this.state.password;
      const tenantId = this.state.tenantId;
      const usertype = "EMPLOYEE";
      const tenantSel = {};
      tenantSel["tenant-id"] = this.state.tenantId;
      persistInLocalStorage(tenantSel);
      this.props.loginUser(username, password, usertype, history);

      history.push("/file-uploader");
    }
  }

  componentDidMount() {
    this.fetchoption();
  }

  fetchoption() {
    fetch(
      window.location.origin +
        "/egov-mdms-service/v1/_get?moduleName=tenant&masterName=tenants&tenantId=pb",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      }
    )
      .then(response => response.json())
      .then(response => {
        let optionItems = response.MdmsRes.tenant.tenants.map(element => {
          return { code: element.code, name: element.city.name };
        });
        this.setState({
          cities: optionItems,
          tenantId: optionItems[0].code
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    let { authenticated } = this.props;
    if (authenticated) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <center>
          <AppBar showMenuIconButton={false} title="Employee Uploader" />
          <TextField
            type="username"
            floatingLabelText="Username"
            onChange={(event, newValue) =>
              this.setState({ username: newValue })
            }
          />
          <br />
          <TextField
            type="password"
            floatingLabelText="Password"
            onChange={(event, newValue) =>
              this.setState({ password: newValue })
            }
          />
          <br />
          <br />
          <label>
            Please Select City:
            <select
              onChange={event =>
                this.setState({ tenantId: event.target.value })
              }
            >
              {this.state.cities.map(item => {
                return (
                  <option key={item.code} value={item.code}>
                    {item.name}{" "}
                  </option>
                );
              })}
            </select>
          </label>
          <br />
          <br />
          <RaisedButton
            label="Submit"
            primary={true}
            onClick={event => this.handleClick()}
          />
        </center>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  userInfo: state.auth.userInfo
});

const mapDispatchToProps = dispatch => ({
  loginUser: (username, password, usertype, history) =>
    dispatch(loginUser(username, password, usertype, history)),
  userLoginSuccess: () => dispatch(userLoginSuccess())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLogin);
