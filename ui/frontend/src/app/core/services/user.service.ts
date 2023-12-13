import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http: HttpClient = inject(HttpClient);

    
}