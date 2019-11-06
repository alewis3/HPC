import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
  };

  onMarkerClick = (props, marker, e) =>
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true
  });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={11}
        style={mapStyles}
        initialCenter={{ lat: 30.266666, lng: -97.733330}}
      >
        <Marker position={{ lat: 30.2297, lng: -97.7539}}
                name={'Homeowner'}
                onClick={this.onMarkerClick}
                icon={{url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"}} 
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
        <Marker position={{lat: 30.2477, lng: -97.7181}}
                name={'Business Owner'}
                onClick={this.onMarkerClick}
                icon={{url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}} 
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA21oeXAPbop6Qh1YCvpK9oNrSSqwCVsaY'
}) (MapContainer);

// add style heere to mimic 'container'
const mapStyles = {
  width: '100%',
  height: '100vh',
};