import L from 'leaflet';
import { MapControl } from 'react-leaflet';
import CustomMap from './CustomMap';

export default class StatsMapControl extends MapControl {
  // note we're extending MapControl from react-leaflet, not Component from react

  createLeafletElement() {}

  componentWillMount() {
    const statsControl = L.control({ position: 'bottomright' });

    statsControl.onAdd = function genContent() {
      const div = L.DomUtil.create('div', 'info legend');
      const ranges = [0, 20, 50, 100, 200, 500, 1000];

      div.innerHTML = '<div style="font-weight:bold; padding-bottom:5px;">SLA Breached</div>';

      for (let index = 0; index < ranges.length; index += 1) {
        div.innerHTML += `<div><span class="map-legend-square" style="background:${CustomMap.getColorCode(ranges[index] + 1)}"></span><span> ${ranges[index]}${
          ranges[index + 1] ? `&ndash;${ranges[index + 1]}` : '+'
        }</span></div><br>`;
      }

      return div;
    };

    this.leafletElement = statsControl;
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   const jsx = this.updateJsx(nextProps.selectedLayer, nextProps.slaBreachedVal);
  //   ReactDOM.render(jsx, this.leafletElement.getContainer());
  //   return true;
  // }
}
