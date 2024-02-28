import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RoleCreateRequest,
  RoleGetResponse,
  RoleUpdateRequest,
} from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http: HttpClient = inject(HttpClient);

  getAll(): Observable<RoleGetResponse[]> {
    return this.http.get<RoleGetResponse[]>(`/api/Role/GetAll`);
  }

  createRole(body: RoleCreateRequest): Observable<any> {
    return this.http.post<any>(`/api/Role/Add`, body);
  }

  updateRole(body: RoleUpdateRequest): Observable<any> {
    return this.http.put<any>(`/api/Role/Update`, body);
  }

  deleteRole(id: number): Observable<any> {
    let queryParams = new HttpParams().set('id', id);
    return this.http.delete<any>(`/api/Role/Delete`, {
      params: queryParams,
    });
  }
}
