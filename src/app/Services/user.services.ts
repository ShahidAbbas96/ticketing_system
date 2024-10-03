import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/interfaces/response.interface';
import { AddUser, EditUser } from 'src/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(pageNo: number, pageSize: number, searchString?: string, includeDeleted: boolean = false): Observable<ResponseModel> {
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('includeDeleted', includeDeleted.toString());

    if (searchString) {
      params = params.set('searchString', searchString);
    }

    return this.http.get<ResponseModel>(`${this.apiUrl}/Users`, { params });
  }

  getUserById(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUrl}/Users/${id}`);
  }

  createUser(user: AddUser): Observable<ResponseModel> {
    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      if (key === 'image' && user.image) {
        const processImage = (imageData: string) => {
          const byteString = atob(imageData.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          const blob = new Blob([ab], { type: 'image/jpeg' }); // Adjust type if needed
          const file = new File([blob], "image.jpg", { type: 'image/jpeg' }); // Adjust type if needed
          formData.append('Image', file);
        };

        if (typeof user.image === 'string') {
          processImage(user.image);
        } else if (user.image instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = e.target?.result as string;
            processImage(base64String);
          };
          reader.readAsDataURL(user.image);
        } else {
          console.error('Unsupported image format');
        }
      } else if (user[key as keyof AddUser] !== null && user[key as keyof AddUser] !== undefined) {
        formData.append(key, String(user[key as keyof AddUser]));
      }
    });
    
    return this.http.post<ResponseModel>(`${this.apiUrl}/Users`, formData);
  }

  updateUser(user: EditUser): Observable<ResponseModel> {
    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      if (key === 'image' && user.image) {
        const processImage = (imageData: string) => {
          const byteString = atob(imageData.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          const blob = new Blob([ab], { type: 'image/jpeg' }); // Adjust type if needed
          const file = new File([blob], "image.jpg", { type: 'image/jpeg' }); // Adjust type if needed
          formData.append('Image', file);
        };

        if (typeof user.image === 'string') {
          processImage(user.image);
        } else if (user.image instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = e.target?.result as string;
            processImage(base64String);
          };
          reader.readAsDataURL(user.image);
        } else {
          console.error('Unsupported image format');
        }
      } else if (user[key as keyof AddUser] !== null && user[key as keyof AddUser] !== undefined) {
        formData.append(key, String(user[key as keyof AddUser]));
      }
    });
    return this.http.put<ResponseModel>(`${this.apiUrl}/Users`, formData);
  }

  deleteUser(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.apiUrl}/Users`, { params: { id: id.toString() } });
  }

  restoreUser(id: number): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.apiUrl}/Users/${id}`, {});
  }
}
