import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/* global google */
import _ from 'lodash';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import SearchBox from 'react-google-maps/lib/places/SearchBox';

var axios = require('axios');
var _this;
var addressHolder;


const INPUT_STYLE = {
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `9px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};
/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
const AsyncGettingStartedExampleGoogleMap = _.flowRight(withScriptjs, withGoogleMap)(props => (
  <GoogleMap options={{ scrollwheel: false }} ref={props.onMapMounted} defaultZoom={11} center={props.center}  onBoundsChanged={props.onBoundsChanged}>
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Search"
      inputStyle={INPUT_STYLE}
    />
    {props.markers.map((marker, index) => <Marker position={marker.position} key={index} />)}
  </GoogleMap>
));

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 10,
      center: { lat: 19.076 , lng: 72.8777 },
      markers: [
        {
          position: { lat: 19.076, lng: 72.8777 },
        },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lat && nextProps.lng) {
      this.setState({ center: { lat: nextProps.lat, lng: nextProps.lng } });
      this.setState({
        markers: [{ position: { lat: nextProps.lat, lng: nextProps.lng } }],
      });
      }
    if(!this.props.select && nextProps.select){
      //console.log("select props");
       //this.props.handler(this.state.center.lat(), this.state.center.lng());
      if(this.state.markers && this.state.markers.length>0 && this.state.markers[0].position){
        //console.log(this.state.markers);
      this.props.handler(this.state.markers[0].position.lat(), this.state.markers[0].position.lng());
     }
     else{
       //console.log(this.state.markers);
      this.props.handler(null, null)
     }
      }
  }

  handleMapMounted = this.handleMapMounted.bind(this);
  handleBoundsChanged = this.handleBoundsChanged.bind(this);
  handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
  handlePlacesChanged = this.handlePlacesChanged.bind(this);

  handleMapMounted(map) {
    this._map = map;
  }

  handleBoundsChanged() {
      //console.log("handleBoundsChanged");
    let tempArray = [];
    tempArray.push(this._map.getCenter());

    // Add a marker for each place returned from search bar
    const markers = tempArray.map(place => ({
      position: this._map.getCenter(),
    }));
    //disable the select button if no marker is there
    if(!markers || (markers && markers.length<=0)){
      this.props.disableselect();
    }
    else{
      this.props.enableselect();
    }
    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;
    // console.log(mapCenter);
    // console.log(markers);
    // console.log(mapCenter.lat(),mapCenter.lng());

    this.setState({
      //center: mapCenter,
      markers,
    });

  }

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
  }

  handlePlacesChanged() {
    console.log("places changed");
    const places = this._searchBox.getPlaces();

    // Add a marker for each place returned from search bar
    const markers = places.map(place => ({
      position: place.geometry.location,
    }));
//disable the select button if no marker is there
    if(!markers || (markers && markers.length<=0)){
      this.props.disableselect();
    }
    else{
      this.props.enableselect();
    }
    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position :this.state.center;

    this.setState({
      center: mapCenter,
      markers,
    });
    }

  render() {
    return (
      <AsyncGettingStartedExampleGoogleMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDrxvgg2flbGdU9Fxn6thCbNf3VhLnxuFY"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        center={this.state.center}
        onMapMounted={this.handleMapMounted}
        onBoundsChanged={() => {
          //console.log("Bounds Changed");
          this.handleBoundsChanged();
          //this.props.handler(this.state.center.lat(), this.state.center.lng());
        }}
        onSearchBoxMounted={this.handleSearchBoxMounted}
        bounds={this.state.bounds}
        onPlacesChanged={() => {
          this.handlePlacesChanged();
          //this.props.handler(this.state.center.lat(), this.state.center.lng());
        }}
        markers={this.state.markers}
      />
    );
  }
}

export default class UigoogleMaps extends Component {

   state = {
    open: false,
    select:false,
    selectEnabled:true,
  };

    handleOpen = () => {
      this.setState({ open: true });
    };

   handleClose = () => {
      this.setState({ open: false });
    };

    handleSelect = () => {
      console.log("handle select");
        this.setState({ select: true });
       };

  getAddress = (lat, lng,item) => {
    console.log("getaddress");
    let self = this;
    if(lat != null && lng != null){
    axios
      .post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true')
      .then(function(response) {
        addressHolder = response.data.results[0] ? response.data.results[0].formatted_address : '';
        console.log(addressHolder);
        self.props.handler(
          { target: { value: addressHolder } },
          item.jsonPathAddress,
          item.isRequired ? true : false,
          '',
          item.requiredErrMsg,
          item.patternErrMsg
        );
      });
    }
    else{
      self.props.handler(
        { target: { value: null } },
        item.jsonPathAddress,
        item.isRequired ? true : false,
        '',
        item.requiredErrMsg,
        item.patternErrMsg
      );
    }
      this.setState({select:false,open:false});
      };

  renderMaps = item => {
    //console.log("renderMaps");
    let enableSelect=this.state.selectEnabled;
    switch (this.props.ui) {
      case 'google':
        const actions = [<FlatButton label="Select" primary={true} onClick={this.handleSelect} disabled={!enableSelect}/>,
                        <FlatButton label="Close" primary={true} onClick={this.handleClose} />,
                        <FlatButton label="Clear" primary={true} onClick={()=>{
                          console.log(item);
                          let self = this;
                          this.props.handler(
                            { target: { value: null } },
                            item.jsonPathLng,
                            item.isRequired ? true : false,
                            '',
                            item.requiredErrMsg,
                            item.patternErrMsg
                          );
                          this.props.handler(
                            { target: { value: null } },
                            item.jsonPathLat,
                            item.isRequired ? true : false,
                            '',
                            item.requiredErrMsg,
                            item.patternErrMsg
                          );
                          self.props.handler(
                            { target: { value: null } },
                            item.jsonPathAddress,
                            item.isRequired ? true : false,
                            '',
                            item.requiredErrMsg,
                            item.patternErrMsg
                          );
                        } }/>];
        return (

          <div>
          <style dangerouslySetInnerHTML={{__html: `
          .pac-container {   z-index: 10000 !important}
        `}} />
          {(item.hideTextarea) ? <div style={{ height:'30px' }}></div> :
            <TextField
              floatingLabelFixed={true}
              floatingLabelText={
                <span>
                  {item.label} <span style={{ color: '#FF0000', fontSize: '18px' }}>{item.isRequired ? ' *' : ''}</span>
                </span>
              }
              style={{ width: '70%', padding: '0px' }}
              textareaStyle={{ color: 'black' }}
              className="custom-form-control-for-textarea"
              disabled={true}
              multiLine={true}
              value={this.props.getVal(item.jsonPathAddress)}
            />  }
            <FlatButton
              id={item.label.split('.').join('-')}
              style={{ width: '20%' }}
              icon={<img src="./temp/images/map_logo.png" height="37px" width="30%" />}
              type={item.uiType || 'button'}
              primary={typeof item.primary != 'undefined' ? item.primary : true}
              secondary={item.secondary || false}
              onClick={this.handleOpen}
              disabled={item.isDisabled ? true : false}
            />
            <Dialog title="Google Maps" style={{ width: '90%', height: '90%' }} actions={actions} modal={true} open={this.state.open}>
              <div style={{ width: '100%', height: 400 }}>
                <SimpleMap
                  markers={[]}
                  select={this.state.select}
                  handler={(lat, lng) => {
                    let self = this;
                    this.props.handler(
                      { target: { value: lng } },
                      item.jsonPathLng,
                      item.isRequired ? true : false,
                      '',
                      item.requiredErrMsg,
                      item.patternErrMsg
                    );
                    this.props.handler(
                      { target: { value: lat } },
                      item.jsonPathLat,
                      item.isRequired ? true : false,
                      '',
                      item.requiredErrMsg,
                      item.patternErrMsg
                    );

                    this.getAddress(lat, lng, item);
                  }}
                  disableselect={
                    () => {
                      if(this.state.selectEnabled){
                      this.setState({
                        selectEnabled:false,
                      });
                    }
                  }
                  }
                  enableselect={
                    () => {
                      if(!this.state.selectEnabled){
                      this.setState({
                        selectEnabled:true,
                      });
                    }
                    }
                  }
                />
              </div>
            </Dialog>
          </div>
        );
    }
  };

  render() {
    return this.renderMaps(this.props.item);
  }
}
