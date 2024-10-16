import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/interfaces/response.interface';
import { Comment } from 'src/interfaces/comment.interface';
import { environment } from 'src/environments/environment';
import { AddComment } from 'src/interfaces/addcomment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/Comment`;

  constructor(private http: HttpClient) {}

  addComment(comment: AddComment): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.apiUrl, comment);
  }

  updateComment(comment: AddComment): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(this.apiUrl, comment);
  }

  deleteComment(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.apiUrl}/${id}`);
  }

  getCommentsByTicketId(ticketId: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUrl}/ticket/${ticketId}`);
  }
}
