import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/interfaces/response.interface';
import { Role } from 'src/interfaces/role.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllRoles(pageNo: number, pageSize: number, searchString?: string): Observable<ResponseModel> {
    let includeDeleted = false;
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('includeDeleted', includeDeleted.toString());

    if (searchString) {
      params = params.set('searchString', searchString);
    }

    return this.http.get<ResponseModel>(`${this.apiUrl}/Roles`, { params });
  }

  getRoleById(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUrl}/Role/${id}`);
  }

  createRole(role: Role): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUrl}/Role`, role);
  }

  updateRole(role: Role): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.apiUrl}/Role`, role);
  }

  deleteRole(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.apiUrl}/Role`, { params: { id: id.toString() } });
  }

  restoreRole(id: number): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.apiUrl}/Role/${id}`, {});
  }
}
