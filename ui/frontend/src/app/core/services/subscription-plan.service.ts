import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SubscriptionPlanCreateRequest,
  SubscriptionPlanGetAllResponse,
} from '../models/subscription-plan.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlanService {
  private readonly http: HttpClient = inject(HttpClient);

  getAll(): Observable<SubscriptionPlanGetAllResponse[]> {
    return this.http.get<SubscriptionPlanGetAllResponse[]>(
      `/api/SubscriptionPlan/GetAll`
    );
  }

  create(body: SubscriptionPlanCreateRequest): Observable<any> {
    return this.http.post<any>(`/api/SubscriptionPlan/Create`, body);
  }

  delete(body: number): Observable<any> {
    return this.http.delete<any>(`/api/SubscriptionPlan/Delete?id=${body}`);
  }
}
