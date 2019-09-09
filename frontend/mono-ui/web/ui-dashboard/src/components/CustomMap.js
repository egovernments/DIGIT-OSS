import find from 'lodash/find';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, LayersControl, Marker, Tooltip, GeoJSON } from 'react-leaflet';
import Card, { CardContent } from 'material-ui/Card';
import hash from 'object-hash';
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';
import StatsMapControl from './StatsMapControl';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

class CustomMap extends Component {
  static getColorCode(val) {
    let color = '';
    if (val > 1000) color = '#800026';
    else if (val > 500) color = '#BD0026';
    else if (val > 200) color = '#E31A1C';
    else if (val > 100) color = '#FC4E2A';
    else if (val > 50) color = '#FD8D3C';
    else if (val > 20) color = '#FEB24C';
    else color = '#FFEDA0';

    return color;
  }

  constructor(props) {
    super(props);

    this.color = this.color.bind(this);
    this.style = this.style.bind(this);
    this.highlightMap = this.highlightMap.bind(this);
    this.resetHighlightMap = this.resetHighlightMap.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
  }

  onEachFeature(feature, layer) {
    const { plots } = this.props;
    const featureProps = feature.properties;
    const name = featureProps.name.toUpperCase();
    let count = 0;
    if (featureProps && featureProps.name) {
      const data = find(plots, o => o.key.toUpperCase() === featureProps.name.toUpperCase());
      if (data) {
        count = data.doc_count;
      }
    }
    layer.bindPopup(`<b>SLA Breach</b> <br /> ${name} : ${count}`);
    layer.on({
      mouseover: this.highlightMap,
      mouseout: this.resetHighlightMap,
      click: this.props.handleGisNav,
    });
  }

  color(name) {
    const obj = find(this.props.plots, o => o.key.toUpperCase() === name.toUpperCase());
    let d = 0;
    if (obj) d = obj.doc_count;
    return CustomMap.getColorCode(d);
  }

  style(feature) {
    return {
      fillColor: this.color(feature.properties.name),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  }

  highlightMap(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
    layer.openPopup();
  }

  resetHighlightMap(e) {
    const layer = e.target;
    layer.closePopup();
    layer.setStyle(this.style(layer.feature));
    // this.setState({ selectedLayer: null });
  }

  render() {
    const { geoJson, plots } = this.props;
    const mapboxAccessToken =
      'pk.eyJ1Ijoibml0aGluMTk5MiIsImEiOiJjamRrNjUyemYxODdtMndwcnNkbGZnYmhnIn0.NjrYH2oEChJQfAStLKhqvA';
    // const zoomLevel = geoJson.label === 'State' ? 6 : 9;

    // const layer = this.state.selectedLayer;
    // let districtRecord;
    // if (layer) {
    //   districtRecord = find(plots, o => o.key.toUpperCase() === layer.name.toUpperCase());
    // // }
    // const position = [geoJson.latitude, geoJson.longtitude];
    let markers = [];
    if (geoJson && geoJson.division === 'District') {
      markers = geoJson.geoJson.features.map((element) => {
        const center = centroid(element);
        return (
          <Marker position={[center.geometry.coordinates[1], center.geometry.coordinates[0]]}>
            <Tooltip>
              <span>{element.properties.name}</span>
            </Tooltip>
          </Marker>
        );
      });
    }
    const bboxArray = bbox(geoJson.geoJson);
    const corner1 = [bboxArray[1], bboxArray[0]];
    const corner2 = [bboxArray[3], bboxArray[2]];
    return (
      <Card raised style={{ minWidth: '100px' }}>
        <CardContent>
          <Map
            // center={position}
            // zoom={zoomLevel}
            bounds={[corner1, corner2]}
            style={{ height: '415px', width: '100%' }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Map White" checked>
                <TileLayer
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  url={`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mapboxAccessToken}`}
                  id="mapbox.light"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Map Dark">
                <TileLayer
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  url={`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mapboxAccessToken}`}
                  id="mapbox.dark"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Map Street View">
                <TileLayer
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  url={`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mapboxAccessToken}`}
                  id="mapbox.streets"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            {markers}
            {geoJson && (
              <GeoJSON
                key={hash(plots)}
                data={geoJson.geoJson}
                style={this.style}
                onEachFeature={this.onEachFeature}
              />
            )}
            <StatsMapControl />
          </Map>
        </CardContent>
      </Card>
    );
  }
}

CustomMap.propTypes = {
  plots: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    doc_count: PropTypes.number.isRequired,
  })).isRequired,
  geoJson: PropTypes.shape({
    division: PropTypes.string.isRequired,
    geoJson: PropTypes.object.isRequired,
  }).isRequired,
  handleGisNav: PropTypes.func.isRequired,
};

export default CustomMap;
