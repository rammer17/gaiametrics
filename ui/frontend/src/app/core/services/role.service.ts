import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import {
  RoleCreateRequest,
  RoleGetResponse,
  RoleUpdateRequest,
} from "../models/role.model";
import { GlobalResponse } from "../models/global-response.model";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private readonly http: HttpClient = inject(HttpClient);

  getAll(): Observable<RoleGetResponse[]> {
    return this.http.get<RoleGetResponse[]>(`/api/Role/GetAll`);
  }

  createRole(body: RoleCreateRequest): Observable<GlobalResponse> {
    return this.http.post<GlobalResponse>(`/api/Role/Add`, body);
  }

  updateRole(body: RoleUpdateRequest): Observable<GlobalResponse> {
    return this.http.put<GlobalResponse>(`/api/Role/Update`, body);
  }

  deleteRole(id: number): Observable<GlobalResponse> {
    let queryParams = new HttpParams().set('id', id)
    return this.http.delete<GlobalResponse>(`/api/Role/Delete`, {params: queryParams})
  }
}
