import { Marker } from 'react-leaflet';

class CustomMarker extends Marker {
  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

export default CustomMarker;
