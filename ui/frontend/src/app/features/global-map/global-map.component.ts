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
              color: '#e0efef',
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
              hue: '#1900ff',
            },
            {
              color: '#c0e8e8',
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
              color: '#7dcdcd',
            },
          ],
        },
      ],
    };
    this.map = new google.maps.Map(document.getElementById('map')!, mapOptions);

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.addMarker(event.latLng);
    });
  }

  addMarker(location: any) {
    new google.maps.Marker({
      position: location,
      map: this.map,
    });
  }
}
