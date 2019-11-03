import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={11}
        style={mapStyles}
        initialCenter={{ lat: 30.266666, lng: -97.733330}}
      >
        <Marker position={{ lat: 30.2297, lng: -97.7539}}
                icon={{url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"}} />
        <Marker position={{lat: 30.2477, lng: -97.7181}}
                icon={{url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA21oeXAPbop6Qh1YCvpK9oNrSSqwCVsaY'
}) (MapContainer);

const mapStyles = {
  width: '100%',
  height: '100vh',
};