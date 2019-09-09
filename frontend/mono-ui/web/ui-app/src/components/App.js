import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Grid, Row, Col } from 'react-bootstrap';
import Drawer from 'material-ui/Drawer';

import { withRouter } from 'react-router';

import Header from './common/Header';
import Footer from './common/Footer';
import Snackbar from 'material-ui/Snackbar';
import LoadingIndicator from './common/LoadingIndicator';
import router from '../router';
import Api from '../api/api';
import CustomMenu from './common/CustomMenu';
import classnames from 'classnames';
import UiLogo from './framework/components/UiLogo';

window.urlCheck = false;
class App extends Component {
  // constructor(props) {
  //     super(props);
  //     // this.getOtp = this.getOtp.bind(this);
  //     // this.validateOtp = this.validateOtp.bind(this);
  //     // this.callLogin = this.callLogin.bind(this);
  // }

  // componentDidUpdate(prevProps) {
  //   // const { location} = this.props;
  //   // console.log(location);
  //
  //   // if (window.localStorage.getItem("token")) {
  //   //     this.props.history.replace(location.location);
  //   // }
  //   // else {
  //   //     this.props.history.replace("/");
  //   // }
  //
  //   // console.log(this.props);
  //   // console.log(match);
  //   // const isLoggingOut = prevProps.isLoggedIn && !this.props.isLoggedIn
  //   // const isLoggingIn = !prevProps.isLoggedIn && this.props.isLoggedIn
  //   //
  //   // if (isLoggingIn) {
  //   //   dispatch(navigateTo(redirectUrl))
  //   // } else if (isLoggingOut) {
  //   //
  //   //   // do any kind of cleanup or post-logout redirection here
  //   // }
  // }

  // componentWillUpdate()
  // {
  //   // console.log("hit");
  //     const { location} = this.props;
  //     console.log(location);
  //
  //     if (window.localStorage.getItem("token")) {
  //         this.props.history.replace(location.location);
  //     }
  //     else {
  //         this.props.history.replace("/");
  //     }
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // console.log("Login");
      this.props.history.replace(nextProps.redirectTo);
      this.props.onRedirect();
    }

    // console.log(this.props.location);
    // if (!window.localStorage.getItem("token") && this.props.location.pathname!="/") {
    //     // console.log("Login");
    //   // if (this.props.location.pathname=="/pgr/createGrievance") {
    //   //     this.props.history.replace("/pgr/createGrievance");
    //   // } else {
    //     this.props.history.replace("/");
    //
    //   // }
    //   // this.props.onRedirect();
    // }

    // if (this.props.location.pathname=="/pgr/createGrievance") {
    //     this.props.history.replace("/pgr/createGrievance");
    // }
  }

  componentWillMount() {
    let { setTenantInfo, setActionList } = this.props;
    // let commonState=JSON.parse(window.localStorage.getItem("reduxPersist:common"));
    // console.log(commonState);
    //if (!window.localStorage.getItem("token")) {
    //window.location.href = "/";
    //}

    // this.props.setLabels(agent.labels.getLabels());
    // const token = window.localStorage.getItem('jwt');
    // const userId = window.localStorage.getItem('userId');
    // const type = window.localStorage.getItem('type');
    //
    // let currentUser = window.localStorage.getItem('currentUser');
    //
    // if(currentUser) {
    //     currentUser = JSON.parse(currentUser);
    // }
    //
    // if (token) {
    //     // agent.setToken(token);
    //     // agent.setUserId(userId);
    //     // agent.setType(type);
    // }

    // api.commonApiPost("user/oauth/token",{tenantId:"default",
    //     username:"narasappa",
    //     password:"demo",
    //     grant_type:"password",
    //     scope:"read"}).then((response)=>{
    //       console.log(response);
    //     },(err)=> {
    //     console.log(err);
    //   });

    // this.props.onLoad(!currentUser
    //     ? agent.Auth.login((this.props.auth.userName || "9999999999"), (this.props.auth.password || "demo"))
    //     : {UserRequest: currentUser}, token);

    // console.log("hit");

    if (localStorage.getItem('token') && localStorage.getItem('userRequest')) {
      this.props.onLoad({ UserRequest: JSON.parse(localStorage.getItem('userRequest')) }, localStorage.getItem('token'));
      Api.commonApiPost('tenant/v1/tenant/_search', {
        code: localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default',
      }).then(
        function(res) {
          // console.log(res);
          setActionList(JSON.parse(localStorage.getItem('actions')));
          setTenantInfo(res.tenant);
        },
        function(err) {
          console.log(err);
        }
      );
    } else {
      var hash = window.location.hash.split('/');
      var urlCode = hash[1];
      if (hash[1].match('/?')) {
        var codeArray = hash[1].split('?');
        urlCode = codeArray[0];
      }
      Api.commonApiPost(
        'tenant/v1/tenant/_search',
        {
          code: hash[1] ? urlCode : 'default',
          tenantId: hash[1] ? urlCode : 'default',
        },
        {},
        true
      ).then(
        function(res) {
          // console.log(res);
          setTenantInfo(res.tenant);
        },
        function(err) {
          console.log(err);
        }
      );
    }
  }

  handleClose = () => {
    this.props.toggleDailogAndSetText(false, '');
  };

  render() {
    console.log('LifeCycle: App: render');
    var {
      toggleDailogAndSetText,
      toggleSnackbarAndSetText,
      isDialogOpen,
      msg,
      isSnackBarOpen,
      toastMsg,
      loadingStatus,
      isSuccess,
      isError,
      showMenu,
      actionList,
    } = this.props;

    const actions = [<FlatButton label="Ok" primary={true} onTouchTap={this.handleClose} />];
    return (
      <div className="App">
        {/*<Drawer className="drawer-backGround" docked={true} open={showMenu ||false} >
           {actionList && actionList.length>0 && <CustomMenu menuItems={[]} actionList={actionList} />}
          </Drawer>*/}

        <div className={classnames('app-content', { expanded: showMenu || false })}>
          <Header />
          {router}
            <div className="row">
              <div className="col-md-12 text-right">
                  <UiLogo src={require("../images/logo.png")} alt="logo"/>
              </div>
            </div>
          <Footer />
        </div>

        {msg && (
          <Dialog
            style={{ zIndex: 2000 }}
            actions={actions}
            modal={true}
            open={isDialogOpen}
            onRequestClose={() => toggleDailogAndSetText(false, '')}
          >
            {msg}
          </Dialog>
        )}
        {toastMsg && (
          <Snackbar
            open={isSnackBarOpen}
            message={toastMsg}
            style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
            bodyStyle={{
              pointerEvents: 'initial',
              maxWidth: 'none',
              backgroundColor: isSuccess ? '#3ca23c' : isError ? '#e83e36' : 'rgb(95, 92, 98)',
              textAlign: 'center',
            }}
            autoHideDuration={6000}
            onRequestClose={() => toggleSnackbarAndSetText(false, '', false, false)}
          />
        )}
        <LoadingIndicator status={loadingStatus || 'hide'} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // labels: state.labels,
  // appLoaded: state.common.appLoaded,
  // appName: state.common.appName,
  // currentUser: state.common.currentUser,
  // route:state.common.route,
  redirectTo: state.common.redirectTo,
  token: state.common.token,
  // pleaseWait: state.common.pleaseWait,
  // token:state.common.token,
  isDialogOpen: state.form.dialogOpen,
  msg: state.form.msg,
  isSnackBarOpen: state.form.snackbarOpen,
  toastMsg: state.form.toastMsg,
  loadingStatus: state.form.loadingStatus,
  isSuccess: state.form.isSuccess,
  isError: state.form.isError,
  showMenu: state.common.showMenu,
  actionList: state.common.actionList,
});

// this.props.appLoaded

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) => dispatch({ type: 'APP_LOAD', payload, token, skipTracking: true }),
  onRedirect: () => dispatch({ type: 'REDIRECT' }),
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  // setLabels: payload => dispatch({type: 'LABELS', payload}),
  // onUpdateAuth: (value, key) => dispatch({type: 'UPDATE_FIELD_AUTH', key, value}),
  // onLogin: (username, password) => {
  //     dispatch({
  //         type: 'LOGIN',
  //         payload: []//agent.Auth.login(username, password)
  //     })
  // },
  // updateError: (error) =>
  //     dispatch({
  //         type: 'UPDATE_ERROR',
  //         error
  //     }),
  // setPleaseWait: (pleaseWait) =>
  //     dispatch({
  //         type: 'PLEASE_WAIT',
  //         pleaseWait
  //     }),
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg, isSuccess, isError) => {
    dispatch({
      type: 'TOGGLE_SNACKBAR_AND_SET_TEXT',
      snackbarState,
      toastMsg,
      isSuccess,
      isError,
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  setTenantInfo: tenantInfo => {
    dispatch({ type: 'SET_TENANT_INFO', tenantInfo });
  },
  setActionList: actionList => {
    dispatch({ type: 'SET_ACTION_LIST', actionList });
  },
});

// App.contextTypes = {
//     router: React.PropTypes.object.isRequired
// };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
