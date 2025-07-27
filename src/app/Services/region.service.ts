import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/interfaces/response.interface';
import { Region } from 'src/interfaces/region.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllRegions(searchString?: string, pageNo: number = 1, pageSize: number = 100): Observable<ResponseModel> {
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());

    if (searchString) {
      params = params.set('searchString', searchString);
    }

    return this.http.get<ResponseModel>(`${this.apiUrl}/Region/getAll`, { params });
  }

  getRegionById(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUrl}/Region`, { params: { id: id.toString() } });
  }

  createRegion(region: Region): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUrl}/Region`, region);
  }

  updateRegion(region: Region): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.apiUrl}/Region`, region);
  }

  deleteRegion(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.apiUrl}/Region`, { params: { id: id.toString() } });
  }
}
