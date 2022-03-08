import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/user/register`, user)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error.error);
        })
      );
  }

  loginUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/user/login`, user)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error.error);
        })
      );
  }
}