import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/interfaces/response.interface';
import { Department } from 'src/interfaces/department.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
    private apiUrl = environment.apiUrl	;

  constructor(private http: HttpClient) {}

  getAllDepartments(pageNo: number, pageSize: number, searchString?: string): Observable<ResponseModel> {
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());

    if (searchString) {
      params = params.set('searchString', searchString);
    }

    return this.http.get<ResponseModel>(`${environment.apiUrl}/Department/getAll`, { params });
  }

  getDepartmentById(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUrl}/Department?id=${id}`);
  }

  createDepartment(department: Department): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUrl}/Department`, department);
  }

  updateDepartment( department: Department): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.apiUrl}/Department`, department);
  }

  deleteDepartment(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.apiUrl}/Department?id=${id}`);
  }
}




