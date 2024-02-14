import { Component, inject } from '@angular/core';
import { IoTDeviceService } from '../../core/services/iot-device.service';
import { take } from 'rxjs';
import { IoTDeviceGetResponse } from '../../core/models/iot-device.model';
import { NgIf } from '@angular/common';
import { ModalComponent } from '../../shared/ng-is-components/modal.components';

declare const google: any;

@Component({
  selector: 'app-global-map',
  standalone: true,
  imports: [ModalComponent, NgIf],
  templateUrl: './global-map.component.html',
  styleUrl: './global-map.component.scss',
})
export class GlobalMapComponent {
  private readonly iotDeviceService: IoTDeviceService =
    inject(IoTDeviceService);

  map: any;
  selectedDevice?: IoTDeviceGetResponse;
  showDeviceInfo: boolean = false;

  ngOnInit(): void {
    this.initMap();
  }

  fetchIoTDevices(): void {
    this.iotDeviceService
      .getAll()
      .pipe(take(1))
      .subscribe((resp: IoTDeviceGetResponse[]) => this.initMarkers(resp));
  }

  onCloseDeviceInfoWindow(): void {
    this.selectedDevice = undefined;
    this.showDeviceInfo = false;
  }

  private initMarkers(iotDevices: IoTDeviceGetResponse[]): void {
    iotDevices.forEach((device) => {
      this.addMarker(device);
    });
  }

  private addMarker(device: IoTDeviceGetResponse): void {
    const marker = new google.maps.Marker({
      position: { lat: device.latitude, lng: device.longtitude },
      map: this.map,
      icon: {
        url: 'https://cdn-icons-png.flaticon.com/512/6432/6432461.png', // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      },
      animation: google.maps.Animation.DROP,
    });

    google.maps.event.addDomListener(marker, 'click', () => {
      console.log(device);
      this.selectedDevice = device;
      this.showDeviceInfo = true;
    });
  }

  private initMap(): void {
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

    this.fetchIoTDevices();
  }
}
