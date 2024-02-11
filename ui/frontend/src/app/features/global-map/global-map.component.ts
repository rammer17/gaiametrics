import { Component } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-global-map',
  standalone: true,
  imports: [],
  templateUrl: './global-map.component.html',
  styleUrl: './global-map.component.scss',
})
export class GlobalMapComponent {
  map: any;

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const mapOptions = {
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      disableDoubleClickZoom: true,
      center: { lat: 42.733883, lng: 25.48583 },
      zoom: 8,
      styles: [
        {
          featureType: 'landscape.natural',
          elementType: 'geometry.fill',
          stylers: [
            {
              visibility: 'on',
            },
            {
              color: '#edf8dd',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'geometry.fill',
          stylers: [
            {
              visibility: 'on',
            },
            {
              hue: '#00ff80',
            },
            {
              color: '#d3edb0',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            {
              lightness: 100,
            },
            {
              visibility: 'simplified',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [
            {
              visibility: 'on',
            },
            {
              lightness: 700,
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [
            {
              color: '#b3e857',
            },
          ],
        },
      ],
    };
    this.map = new google.maps.Map(document.getElementById('map')!, mapOptions);

    // Initialize markers
    this.initMarkers();

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.addMarker(event.latLng);
    });
  }

  initMarkers() {
    // Example: Initialize markers at specific locations
    const markerLocations = [{ lat: 42.8767, lng: 25.4988 }];

    markerLocations.forEach((location) => {
      this.addMarker(location);
    });
  }

  addMarker(location: any) {
    new google.maps.Marker({
      position: location,
      map: this.map,
      icon: {
        url: 'https://cdn-icons-png.flaticon.com/512/6432/6432461.png', // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      },
    });
  }
}
