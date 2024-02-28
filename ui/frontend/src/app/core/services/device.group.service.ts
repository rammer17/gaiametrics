import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import {
  DeviceGroupGetResponse,
  DeviceGroupCreateRequest,
} from "../models/device-group.model";

@Injectable({
  providedIn: "root",
})
export class DeviceGroupService {
  private readonly http: HttpClient = inject(HttpClient);

  getAll(): Observable<DeviceGroupGetResponse[]> {
    return this.http.get<DeviceGroupGetResponse[]>(`/api/DeviceGroup/GetAll`);
  }

  getAllNoLoader(): Observable<DeviceGroupGetResponse[]> {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<DeviceGroupGetResponse[]>(`/api/DeviceGroup/GetAll`, {
      headers: headers,
    });
  }

  create(body: DeviceGroupCreateRequest): Observable<any> {
    return this.http.post<any>(`/api/DeviceGroup/Register`, body);
  }

  update(body: DeviceGroupCreateRequest): Observable<any> {
    return this.http.post<any>(`/api/DeviceGroup/Update `, body);
  }

  delete(body: number): Observable<any> {
    return this.http.delete<any>(`/api/DeviceGroup/Delete?id=${body}`);
  }
}
