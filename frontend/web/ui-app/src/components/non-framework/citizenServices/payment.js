import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
import Api from '../../../api/api';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: {},
    };
  }

  componentDidMount() {
    let { msg } = this.props.match.params;
    // console.log(msg);
    msg = decodeURIComponent((msg + '').replace(/\+/g, '%20'));
    // console.log(msg);
    let splitArray = msg.split('|');
    let { setRoute } = this.props;
    let paymentGateWayResponse = {};

    for (var i = 0; i < splitArray.length; i++) {
      // splitArray[i].split(":")[0]
      // splitArray[i].split(":")[1]
      paymentGateWayResponse[splitArray[i].split(':')[0]] = splitArray[i].split(':')[1];
      // this.setState({msg:{
      //   [splitArray[i].split("=")[0]]:[splitArray[i].split("=")[1]]
      // }});
    }

    console.log(paymentGateWayResponse);
    window.localStorage.setItem('paymentGateWayResponse', JSON.stringify(paymentGateWayResponse));
    if (paymentGateWayResponse['status'] != 'failed') {
      if (
        (window.localStorage.getItem('workflow') == 'create' ||
          window.localStorage.getItem('workflow') == 'fireNoc' ||
          window.localStorage.getItem('workflow') == 'tl') &&
        (window.localStorage.getItem('ack') == '' || window.localStorage.getItem('ack') == undefined)
      ) {
        setRoute(
          '/non-framework/citizenServices/' +
            window.localStorage.getItem('workflow') +
            '/pay/' +
            window.localStorage.getItem('moduleName') +
            '/success'
        );
      } else if (window.localStorage.getItem('workflow') == 'view') {
        setRoute(
          '/non-framework/citizenServices/' +
            window.localStorage.getItem('workflow') +
            '/pay/' +
            window.localStorage.getItem('moduleName') +
            '/' +
            window.localStorage.getItem('ack') +
            '/success'
        );
      } else if (window.localStorage.getItem('workflow') == 'fireNoc') {
        setRoute(
          '/non-framework/citizenServices/' +
            window.localStorage.getItem('workflow') +
            '/pay/' +
            window.localStorage.getItem('moduleName') +
            '/' +
            window.localStorage.getItem('ack') +
            '/success'
        );
      } else {
        setRoute(
          '/non-framework-cs/citizenServices/' +
            window.localStorage.getItem('workflow') +
            '/pay/' +
            window.localStorage.getItem('moduleName') +
            '/success'
        );
      }
    } else {
      if (
        (window.localStorage.getItem('workflow') == 'create' ||
          window.localStorage.getItem('workflow') == 'fireNoc' ||
          window.localStorage.getItem('workflow') == 'tl') &&
        (window.localStorage.getItem('ack') == '' || window.localStorage.getItem('ack') == undefined)
      ) {
        let ServiceRequest = JSON.parse(localStorage.response).serviceReq;
        ServiceRequest.backendServiceDetails = null;
        ServiceRequest.status = 'PAYMENTFAILED';
        Api.commonApiPost(
          '/citizen-services/v1/requests/_update',
          {},
          { serviceReq: ServiceRequest },
          null,
          true,
          false,
          null,
          JSON.parse(localStorage.userRequest)
        ).then(function(res) {}, function(err) {});
      }

      alert('Payment failed');
      setRoute('/prd/dashboard');
    }
    this.setState({ msg: this.props.match.params.msg });
  }

  render() {
    let { msg } = this.state;
    return (
      <Card>
        <CardHeader />
        <CardText style={{ textAlign: 'center' }}>
          <h4>Gateway response redirecting please wait .....</h4>
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
