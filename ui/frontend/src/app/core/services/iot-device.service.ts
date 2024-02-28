import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IoTDeviceCreateRequest,
  IoTDeviceGetResponse,
} from '../models/iot-device.model';

@Injectable({
  providedIn: 'root',
})
export class IoTDeviceService {
  private readonly http: HttpClient = inject(HttpClient);

  getAll(): Observable<IoTDeviceGetResponse[]> {
    return this.http.get<IoTDeviceGetResponse[]>(`/api/IoTDevice/GetAll`);
  }
  getAllNoLoader(): Observable<IoTDeviceGetResponse[]> {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<IoTDeviceGetResponse[]>(`/api/IoTDevice/GetAll`, {
      headers: headers,
    });
  }

  get(id: number): Observable<IoTDeviceGetResponse> {
    const queryParams = new HttpParams().set('id', id);
    return this.http.get<IoTDeviceGetResponse>(`/api/IoTDevice/Get`, {
      params: queryParams,
    });
  }

  getNoLoader(id: number): Observable<IoTDeviceGetResponse> {
    const queryParams = new HttpParams().set('id', id);
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<IoTDeviceGetResponse>(`/api/IoTDevice/Get`, {
      params: queryParams,
      headers: headers,
    });
  }

  create(body: IoTDeviceCreateRequest): Observable<any> {
    return this.http.post<any>(`/api/IoTDevice/Register`, body);
  }
}
