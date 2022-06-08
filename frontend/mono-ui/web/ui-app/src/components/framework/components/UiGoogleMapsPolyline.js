import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/* global google */
import _ from 'lodash';
import { withGoogleMap, GoogleMap , Polyline } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import SearchBox from 'react-google-maps/lib/places/SearchBox';

var axios = require('axios');
var _this;
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
  <GoogleMap options={{ scrollwheel: false }} ref={props.onMapMounted} defaultZoom={18} center={props.center}>
    {props.edit && <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Search"
      inputStyle={INPUT_STYLE}
    />}
    <Polyline
      ref={props.onPolylineMounted}
      path={props.polyline}
      strokeColor= 'red'
      strokeOpacity= {0.8}
      strokeWeight= {2}
      fillColor= 'green'
      fillOpacity= {0.35}
      draggable= {props.edit}
      editable= {props.edit}
      />
  </GoogleMap>
));

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 18,
      center: { lat: 19.076 , lng: 72.8777 },
      polyline : [
          {lat: 19.076, lng: 72.8777},
          //{lat: 19.077, lng: 72.8777},
          {lat: 19.077, lng: 72.8778},
          //{lat: 19.076, lng: 72.8778},
          //{lat: 19.076, lng: 72.8777}
          ],
    };
  }
  componentWillMount(){
     let {formData} = this.props;
     console.log(formData);
     if(formData && formData.Asset && formData.Asset.assetAttributesCheck && formData.Asset.assetAttributesCheck["Location(Point to Point)"]){
       if(formData.Asset.assetAttributesCheck["Location(Point to Point)"].GIS){
         let value=formData.Asset.assetAttributesCheck["Location(Point to Point)"].GIS;
         console.log(value);
         let tmparr=[];
         value.map((val)=>{
           //console.log(val);
           let lat=parseFloat(val.lat);
           let lng=parseFloat(val.lng);
           console.log(lat,lng);
           tmparr.push({lat,lng});
         })
         //console.log(tmparr);
         this.setState({
           polyline:tmparr,
           center: tmparr[0],
         });
         //console.log(this.state.polyline);
       }
      }
      else if(formData && formData.hasOwnProperty('Assets') && formData.Assets[0].hasOwnProperty('assetAttributes')){
        let values=formData.Assets[0].assetAttributes;
        if(values){
          console.log(values);
          values.map((val,key)=>{
            if(val && val != null){
            if(val.type == "GIS"){
              let value=val.value;
              console.log(value);
              let tmparr=[];
              value.map((val)=>{
                console.log(val);
                let lat=parseFloat(val.lat);
                let lng=parseFloat(val.lng);
                console.log(lat,lng);
                tmparr.push({lat,lng});
              })
              console.log(tmparr);
              this.setState({
                polyline:tmparr,
                center: tmparr[0],
              });
              console.log(this.state.polyline);
            }
          }
          })
        }
      }
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
    if(!this.props.select && nextProps.select){
      let tempArray=[];
      console.log(this.state.polyline);
      if(this._polyline){
         let path=this._polyline.getPath();
         let pathArray=path.getArray();
         const coords=pathArray.map((path,i)=>{
         let pathvalue=path.toUrlValue(5);
         let latlng=pathvalue.split(',');
         let lat=latlng[0];
         let lng=latlng[1];
         tempArray.push({lat,lng})
         console.log(tempArray);
         });
       this.setState({
        polyline:tempArray,
      });
      }
      this.props.handler(tempArray);
      }

  }

  handleMapMounted = this.handleMapMounted.bind(this);
  handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
  handlePlacesChanged = this.handlePlacesChanged.bind(this);
  handlePolylineMounted=this.handlePolylineMounted.bind(this);
  handleMapMounted(map) {
    this._map = map;
  }
  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
  }
  handlePolylineMounted(polyline) {
    console.log("polyline mounted");
    console.log(polyline);
    this._polyline = polyline;
  }

  handlePlacesChanged() {
    const places = this._searchBox.getPlaces();
    let tempArray=[];
    // Add polyline for the place returned from search bar
    const searchPlace = places.map(place => ({
      position: place.geometry.location,
    }
    ));
    // set map center to  search result
    const mapCenter = searchPlace.length > 0 ? searchPlace[0].position : this.state.center;
    let j=0;
    let k=0;
    for(let i=1;i<=2;i++){
      let lat=j+searchPlace[0].position.lat();
      let lng=k+searchPlace[0].position.lng();
       console.log(lat,lng);
       tempArray.push({lat,lng});
       if(i%2){
         k=k+0.001;
       }
       else {
         j=j+0.001;
       }
    }
    //let lat=searchPlace[0].position.lat();
    //let lng=searchPlace[0].position.lng();
    //tempArray.push({lat,lng});
    this.setState({
      center: mapCenter,
      polyline:tempArray,
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
        onSearchBoxMounted={this.handleSearchBoxMounted}
        onPolylineMounted={this.handlePolylineMounted}
        bounds={this.state.bounds}
        onPlacesChanged={() => {
          this.handlePlacesChanged();
          //this.props.handler(this.state.center.lat(), this.state.center.lng());
        }}
        polyline={this.state.polyline}
        edit={this.props.edit}
        />
    );
  }
}

export default class UigoogleMapsPolyline extends Component {

   state = {
    open: false,
    select:false,
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


  renderMaps = (item,formData,edit) => {

    switch (this.props.ui) {
      case 'google':
      console.log(item);
      console.log(formData);
      const actions = [<FlatButton label="Select" primary={true} onClick={this.handleSelect} disabled={!edit}/>,
                        <FlatButton label="Close" primary={true} onClick={this.handleClose} />,
                        <FlatButton label="Clear" primary={true} disabled={!edit} onClick={()=>{
                          console.log(item);
                          let self = this;
                          this.props.handler(
                            { target: { value: null } },
                            item.jsonPath,
                          item.isRequired ? true : false,
                            '',
                            item.requiredErrMsg,
                            item.patternErrMsg
                          );
                        }} />];
        return (
          <div>
             { edit && <TextField
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
                value={this.props.getVal(item.jsonPath)}
                />}
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
                  select={this.state.select}
                  formData={formData}
                  edit={edit}
                  handler={(polyline) => {
                    console.log(polyline);
                    console.log(item);
                    let self = this;
                    this.props.handler(
                      { target: { value: polyline }},
                      item.jsonPath,
                      item.isRequired ? true : false,
                      '',
                      item.requiredErrMsg,
                      item.patternErrMsg
                    );
                    this.setState({select:false,open:false});
                  }}
                />
              </div>
            </Dialog>
          </div>
        );
    }
  };

  render() {
    console.log(this.props.formData);
    console.log(this.props.item);
    return this.renderMaps(this.props.item,this.props.formData,this.props.edit);
  }
}
