import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { CreateOrUpdateTicketDto } from 'src/interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/Ticket`;

  constructor(private http: HttpClient) {}

  createTicket(ticket: CreateOrUpdateTicketDto): Observable<ResponseModel> {
    const formData = new FormData();
    Object.keys(ticket).forEach(key => {
      if (key === 'Attachments' && ticket.Attachments) {
        for (let i = 0; i < ticket.Attachments.length; i++) {
          formData.append('Attachments', ticket.Attachments[i]);
        }
      } else if (ticket[key as keyof CreateOrUpdateTicketDto] !== null && ticket[key as keyof CreateOrUpdateTicketDto] !== undefined) {
        formData.append(key, String(ticket[key as keyof CreateOrUpdateTicketDto]));
      }
    });

    // Log for debugging
    formData.forEach((value, key) => {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    });
    
    return this.http.post<ResponseModel>(this.apiUrl, formData, {
      headers: { 'Accept': 'application/json' }
    });
  }

  deleteTicket(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(this.apiUrl, { params: { id: id.toString() } });
  }

  getAllTickets(pageNo: number, pageSize: number, userId: string, roleId: string, searchString?: string): Observable<ResponseModel> {
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('userId', userId)
      .set('roleId', roleId);

    if (searchString) {
      params = params.set('searchString', searchString);
    }

    return this.http.get<ResponseModel>(`${this.apiUrl}/getAll`, { params });
  }
  getAllCountByStatus(userId: string, roleId: string): Observable<ResponseModel> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('roleId', roleId);

    return this.http.get<ResponseModel>(`${this.apiUrl}/getAllCountByStatus`, { params });
  }

  getTicketById(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.apiUrl}`, { params: { id: id.toString() } });
  }

  updateTicket(ticket: CreateOrUpdateTicketDto): Observable<ResponseModel> {
    const formData = new FormData();
    Object.keys(ticket).forEach(key => {
      debugger;
      if (key === 'Attachments' && ticket.Attachments) {
        for (let i = 0; i < ticket.Attachments.length; i++) {
          formData.append('Attachments', ticket.Attachments[i]);
        }
      } else if (ticket[key as keyof CreateOrUpdateTicketDto] !== null && ticket[key as keyof CreateOrUpdateTicketDto] !== undefined) {
        formData.append(key, String(ticket[key as keyof CreateOrUpdateTicketDto]));
      }
    });
    return this.http.put<ResponseModel>(this.apiUrl, formData);
  }
}
