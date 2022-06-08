import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { withRouter } from 'react-router';
import Api from '../../api/api';
import { logo, tenantName } from './temp/local';
import { getTitleCase } from '../framework/utility/utility';
import $ from 'jquery';
import classnames from 'classnames';
import CustomMenu from './CustomMenu';

var tenantContent = {
  details: {
    panavel: {
      name: 'Panvel',
      logo: './temp/images/panvelLogo.jpg',
    },
    default: {
      name: 'My City',
      logo: './temp/images/yourCity.jpg',
    },
  },
};

const getTenantId = () => {
  if (localStorage.getItem('tenantId')) {
    return localStorage.getItem('tenantId');
  }

  return window.location.hash.split('#/')[1];
};

const getThemefile = function(tenantId, cb) {
  $.ajax({
    url: 'https://raw.githubusercontent.com/abhiegov/test/master/tenantDetails.json?timestamp=' + new Date().getTime(),
    success: function(res) {
      var tenantContext = JSON.parse(res)['details'][tenantId];
      cb(tenantContext);
    },
    error: function() {
      var tenantContext = tenantContent[tenantId];
      cb(tenantContext);
    },
  });
};

const Logo = props => {
  /*if(props.tenantInfo && props.tenantInfo[0] && props.tenantInfo[0].imageId) {

  } else */
  // if(props.tenantInfo.length>0 && props.tenantInfo[0].hasOwnProperty("logoId") && props.tenantInfo[0].logoId) {
  //   return (<img width="64" src={require(props.tenantInfo[0].logoId+".png")} style={styles.mainLogo} alt="logo"/>);
  // } else {
  //   // if(logo[getTenantId()]) {
  //   //     return (<img width="64" src={logo[getTenantId()]} style={styles.mainLogo} alt="logo"/>);
  //   // } else if(logo["default"]) {
  //   //     return (<img width="64" src={logo["default"]} style={styles.mainLogo} alt="logo"/>);
  //   // } else {
  //       return (<img width="64" src={require("../../images/headerLogo.png")} style={styles.mainLogo} alt="logo"/>);
  //   // }
  // }
  return (
    <div
      style={{
        fontSize: '15px',
        marginLeft: '0px',
        lineHeight: '21px',
      }}
    >
      <span style={{ color: 'orange' }}>Government of Maharashtra</span>
      <br />
      <span style={{ color: 'black' }}>{'महाराष्ट्र शासन'}</span>
      <br />
      <span style={{ color: 'green' }}>Integrated Citizen Services Portal</span>
    </div>
  );
};

const getTitle = (tenantInfo, tenantContext) => {
  if (tenantContext) {
    return tenantContext.name;
  } else
    return tenantInfo && tenantInfo[0] && tenantInfo[0].city && tenantInfo[0].city.name
      ? getTitleCase(tenantInfo[0].city.name)
      : tenantName[getTenantId()] || 'My City';
};

const RightIcon = props => {
  if (props.token) {
    return (
      <div>
        <span style={{ color: '#555', verticalAlign: 'super' }}>{'मराठी'}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span style={{ color: '#555', verticalAlign: 'super' }}>{'English'}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <i style={{ color: '#555', verticalAlign: 'sub' }} className="material-icons">
          account_circle
        </i>&nbsp;
        <span style={{ color: '#555', verticalAlign: 'super' }}>
          {window.localStorage.getItem('userRequest') ? JSON.parse(window.localStorage.getItem('userRequest')).name : ''}
        </span>
        <IconMenu
          iconButtonElement={
            <IconButton style={{ color: '#555' }}>
              <i className="material-icons">more_vert</i>
            </IconButton>
          }
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <MenuItem
            primaryText="Sign Out"
            onClick={e => {
              props.showHome && props.handleToggle();
              props.signOut();
              clearInterval(window.timeObject);
              // console.log(window.timeObject);
            }}
            leftIcon={
              <i style={{ color: '#555' }} className="material-icons">
                lock
              </i>
            }
          />
        </IconMenu>
        <i
          onClick={e => {
            if (localStorage.getItem('token')) {
              props.setRoute('/prd/dashboard');
            } else {
              props.setRoute('/' + (localStorage.getItem('tenantId') || 'default'));
            }
          }}
          className="material-icons"
          style={{ color: '#555', cursor: 'pointer' }}
        >
          home
        </i>
        {/* <img src={require("../../images/logo@2x.png")} style={styles.rightIcon} alt="right icon"/> */}
      </div>
    );
  } else if (window.location.hash === '#/') {
    return <div />;
    // <img src={require("../../images/logo@2x.png")} style={styles.rightIcon} alt="right icon"/>
    // )
  } else {
    return (
      <div>
        {props.showHome && (
          <i
            onClick={() => {
              if (localStorage.getItem('token')) {
                props.setRoute('/prd/dashboard');
              } else {
                props.setRoute('/' + (localStorage.getItem('tenantId') || 'default'));
              }
            }}
            className="material-icons"
            style={{ color: '#555', cursor: 'pointer' }}
          >
            home
          </i>
        )}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {/* <img src={require("../../images/logo@2x.png")} style={styles.rightIcon} alt="right icon"/> */}
      </div>
    );
  }
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      menuItems: [],
      reRender: false,
      tenantContext: {},
    };
  }

  signOut = e => {
    let { logout } = this.props;
    var locale = localStorage.getItem('locale');
    var lang_response = localStorage.getItem('lang_response');
    var tenantId = localStorage.getItem('tenantId');

    Api.commonApiPost('/user/_logout', {
      access_token: localStorage.getItem('token'),
    }).then(
      function(response) {
        document.title = 'Egov';
        localStorage.clear();
        localStorage.setItem('locale', locale);
        localStorage.setItem('lang_response', lang_response);
        localStorage.setItem('tenantId', tenantId);
        logout(tenantId);
      },
      function(err) {
        document.title = 'Dashboard';
        localStorage.clear();
        localStorage.setItem('locale', locale);
        localStorage.setItem('lang_response', lang_response);
      }
    );
  };

  // handleToggle = () => {
  //   var self = this;
  //   self.props.handleToggle(self.props.showMenu);
  // };

  initDat() {}

  componentDidMount() {
    var self = this;
    // getThemefile(getTenantId(), function(context) {
    //     self.setState({
    //         reRender: true,
    //         tenantContext: context
    //     });
    // });

    //When api ready asssign api response to menuItems
    let menuItems = [];
    this.setState({ menuItems });
  }

  render() {
    let { tenantContext } = this.state;
    let { showMenu, actionList, menuDontToggle, handleToggle } = this.props;
    return (
      <div className="Header">
        {/*showMenu && <div className="drawer-backGround">
            {actionList && actionList.length>0 && <CustomMenu menuItems={[]} actionList={actionList} />}
        </div>*/}
        <AppBar
          onLeftIconButtonTouchTap={handleToggle}
          iconElementLeft={
            this.props.token && this.props.currentUser.type !== 'CITIZEN' ? (
              <IconButton>
                <i className="material-icons icon-left-style">menu</i>
              </IconButton>
            ) : (
              <div />
            )
          }
          className="app-bar-bg"
          title={
            <div>
              <Logo tenantInfo={this.props.tenantInfo} tenantContext={tenantContext} />{' '}
            </div>
          }
          iconElementRight={
            <RightIcon
              showHome={this.props.showHome}
              signOut={this.signOut}
              showMenu={showMenu}
              token={this.props.token}
              logout={this.props.logout}
              setRoute={this.props.setRoute}
              handleToggle={this.props.handleToggle}
            />
          }
        />

        <Drawer width={256} containerClassName="drawer-backGround" open={showMenu}>
          {actionList && actionList.length > 0 && <CustomMenu menuItems={[]} actionList={actionList} />}
        </Drawer>
      </div>
    );
  }
}

//

const mapStateToProps = state => ({
  labels: state.labels,
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  // redirectTo: state.common.redirectTo,
  token: state.common.token,
  pleaseWait: state.common.pleaseWait,
  // isDialogOpen: state.form.dialogOpen,
  // msg: state.form.msg,
  showMenu: state.common.showMenu || false,
  actionList: state.common.actionList,
  showHome: state.common.showHome,
  tenantInfo: state.common.tenantInfo || [],
});

// this.props.appLoaded

const mapDispatchToProps = dispatch => ({
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  handleToggle: () => dispatch({ type: 'MENU_TOGGLE' }),
  // onLoad: (payload, token) => dispatch({type: 'APP_LOAD', payload, token, skipTracking: true}),
  // onRedirect: () => dispatch({type: 'REDIRECT'}),
  setLabels: payload => dispatch({ type: 'LABELS', payload }),
  logout: tenantId => dispatch({ type: 'LOGOUT', tenantId }),
  menuDontToggle: state => dispatch({ type: 'MENU_DONT_TOGGLE', state }),
  // onUpdateAuth: (value, key) => dispatch({type: 'UPDATE_FIELD_AUTH', key, value}),
  // onLogin: (username, password) => {
  //     dispatch({
  //         type: 'LOGIN',
  //         payload: []//agent.Auth.login(username, password)
  //     })
  // },
  //   updateError: (error) =>
  //       dispatch({
  //           type: 'UPDATE_ERROR',
  //           error
  //       }),
  //   setPleaseWait: (pleaseWait) =>
  //       dispatch({
  //           type: 'PLEASE_WAIT',
  //           pleaseWait
  //       }),
  //  toggleDailogAndSetText: (dailogState,msg) => {
  //         dispatch({type: "TOGGLE_DAILOG_AND_SET_TEXT", dailogState,msg});
  //       }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
// import IconButton from 'material-ui/IconButton';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// WEBPACK FOOTER //
// ./src/components/common/Header.js
// getTitle(this.props.tenantInfo, tenantContext)
