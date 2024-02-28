import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  UserGetResponse,
  UserSignInRequest,
  UserSignUpRequest,
} from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http: HttpClient = inject(HttpClient);

  signUp(body: UserSignUpRequest): Observable<any> {
    return this.http.post<any>(`/api/User/Register`, body);
  }

  signIn(body: UserSignInRequest): Observable<any> {
    return this.http.post<any>(`/api/User/Login`, body);
  }

  get(): Observable<UserGetResponse> {
    return this.http.get<UserGetResponse>(`/api/User/Get`);
  }

  getAll(): Observable<UserGetResponse[]> {
    return this.http.get<UserGetResponse[]>(`/api/User/GetAll`);
  }

  getAllNoLoader(): Observable<UserGetResponse[]> {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<UserGetResponse[]>(`/api/User/GetAll`, {
      headers: headers,
    });
  }
}
