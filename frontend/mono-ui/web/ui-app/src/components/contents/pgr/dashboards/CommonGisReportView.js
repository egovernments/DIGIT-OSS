import React, { Component } from 'react';
import _ from 'lodash';
import GisMapView from './GisMapView';
import { getTenantId, extractManipulateCityAndWardsPath } from './ReportUtils';
import Api from '../.././../../api/api';
import CircularProgress from 'material-ui/CircularProgress';

export default class CommonGisReportView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.doGisReportAPICallsAndUpdates(nextProps.params);
    }
  }

  doGisReportAPICallsAndUpdates = params => {
    this.setState({ isFetchingData: true });
    let _this = this;

    let requestes = [
      Api.commonApiPost('pgr/dashboard/complainttype', params, {
        tenantId: getTenantId(),
      }),
    ];

    if (!this.state.kml && !this.props.kml) {
      requestes = [
        ...requestes,
        Api.commonApiGet('egov-location/boundarys/getshapefile', { tenantId: getTenantId() }, {}),
        Api.commonApiPost('tenant/v1/tenant/_search', { code: getTenantId() }, { tenantId: getTenantId() }),
      ];
    }

    Promise.all(requestes).then(
      responses => {
        try {
          let stateData;

          let { color, totalComplaints } = _this.props;

          color = color || '#ffffff';
          totalComplaints = totalComplaints || _.sumBy(responses[0], 'count');

          if (responses.length === 1) {
            stateData = extractManipulateCityAndWardsPath(
              responses[0],
              this.state.kml || this.props.kml,
              this.state.cityLatLng || this.props.cityLatLng,
              color,
              totalComplaints
            );
          } else {
            let city = responses[2].tenant[0].city;
            let cityLatLng = { lat: city.latitude, lng: city.longitude };
            stateData = extractManipulateCityAndWardsPath(responses[0], responses[1], cityLatLng, color, totalComplaints);
          }
          this.setState({ isFetchingData: false, ...stateData });
        } catch (e) {
          console.log('error', e);
        }
      },
      err => {
        console.log('error', err);
      }
    );
  };

  openWardInfoWindow = boundaryDetails => {
    this.setState({ openBoundaryInfoWindow: boundaryDetails });
  };

  closeWardInfoWindow = () => {
    this.setState({ openBoundaryInfoWindow: undefined });
  };

  constructor() {
    super();
    this.state = {
      isFetchingData: false,
    };
  }

  componentDidMount() {
    this.doGisReportAPICallsAndUpdates(this.props.params);
  }

  render() {
    return (
      <GisMapView
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDrxvgg2flbGdU9Fxn6thCbNf3VhLnxuFY"
        wardsPolygons={this.state.wardsPolygons}
        openInfoWindow={this.openWardInfoWindow}
        closeInfoWindow={this.closeWardInfoWindow}
        boundaryInfoWindowOpened={this.state.openBoundaryInfoWindow}
        loadingElement={
          <div style={{ height: `100%`, textAlign: 'center', padding: 150 }}>
            <CircularProgress />
          </div>
        }
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        center={this.state.cityLatLng}
        onMapMounted={() => {}}
      />
    );
  }
}
