import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseModel } from 'src/interfaces/response.interface';
import { LoginDto } from 'src/interfaces/auth.interface';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name: string;
  role: string;
  imageUrl: string;
  userId: string;
  exp: number;
  departmentId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'jwt_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(loginDto: LoginDto): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUrl}/Auth/Login`, loginDto).pipe(
      tap((response: ResponseModel) => {
        if (response.status && response.data?.token) {
          this.setToken(response.data.token);
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<any>(token);
        return {
          name: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
          role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
          imageUrl: decodedToken['ImageUrl'] || '',
          userId: decodedToken['UserId'] || '',
          departmentId: (decodedToken as any)['DepartmentId'] || '',
          exp: decodedToken['exp'] || 0
        };
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}

// Add this at the top of the file or in a separate constants file
const ClaimTypes = {
  Name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  Role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
};
