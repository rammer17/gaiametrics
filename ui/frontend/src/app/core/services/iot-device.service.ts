import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import {
  IoTDeviceCreateRequest,
  IoTDeviceGetResponse,
} from "../models/iot-device.model";

@Injectable({
  providedIn: "root",
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

  create(body: IoTDeviceCreateRequest): Observable<any> {
    return this.http.post<any>(`/api/IoTDevice/Register`, body);
  }
}
