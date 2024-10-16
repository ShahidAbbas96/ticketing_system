import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CreateOrEditTicketComponent } from './create-or-edit-ticket/create-or-edit-ticket.component';
import Swal from 'sweetalert2';
import { TicketService } from 'src/app/Services/ticket.service';
import { CreateOrUpdateTicketDto, TicketStatusEnum, PrioritiyStatusEnum } from 'src/interfaces/ticket.interface';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent implements OnInit {
  modalService: NgbModal;
  ticketService: TicketService;
  
  openTickets: any[] = [];
  inProgressTickets: any[] = [];
  closedTickets: any[] = [];
  resolvedTickets: any[] = [];
  userId: string | null = null;
  roleId: string | null = null;
  constructor(modalService: NgbModal, ticketService: TicketService,authService:AuthService) {
    this.modalService = modalService;
    this.ticketService = ticketService;
    this.userId = authService.getDecodedToken()?.userId||'';
    this.roleId = authService.getDecodedToken()?.role||'';
  }

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    // Assuming you have the userId and roleId available. Replace with actual values.

    this.ticketService.getAllTickets(1, 100, this.userId ?? '', this.roleId ?? '').subscribe({
      next: (response) => {
        if (response.status) {
          const allTickets = response.data.tickets as CreateOrUpdateTicketDto[];
          this.categorizeTickets(allTickets);
        } else {
          console.error('Failed to load tickets:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
      }
    });
  }

  categorizeTickets(tickets: any) {
    debugger;
    console.log(tickets);
    if (tickets.length > 0) {
      this.openTickets = tickets.filter((t: CreateOrUpdateTicketDto) => t.ticketStatus === TicketStatusEnum.Open);
      this.inProgressTickets = tickets.filter((t: CreateOrUpdateTicketDto) => t.ticketStatus === TicketStatusEnum.InProgress);
      this.closedTickets = tickets.filter((t: CreateOrUpdateTicketDto) => t.ticketStatus === TicketStatusEnum.Closed);
      this.resolvedTickets = tickets.filter((t: CreateOrUpdateTicketDto) => t.ticketStatus === TicketStatusEnum.Resolved);
    }
    console.log(this.openTickets);
  }

  shortenDescription(description: string): string {
    const wordLimit = 20;
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  }

  addTicket() {
    const modalRef = this.modalService.open(CreateOrEditTicketComponent, { size: 'lg' });
  }

  editTicket(id: number) {
    console.log(id);
    const modalRef = this.modalService.open(CreateOrEditTicketComponent, { size: 'lg' });
    modalRef.componentInstance.ticketId = id;
    
    modalRef.result.then((result) => {
      if (result) {
        // Ticket was updated
        this.loadTickets();
      }
    }, (reason) => {
      // Modal was dismissed
    });
  }

  deleteTicket(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.ticketService.deleteTicket(id).subscribe({
          next: (response) => {
            if (response.status) {
              Swal.fire('Deleted!', 'Your ticket has been deleted.', 'success');
              this.loadTickets();
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error deleting ticket:', error);
            Swal.fire('Error', 'Failed to delete ticket', 'error');
          }
        });
      }
    });
  }

  getPriorityText(priority: PrioritiyStatusEnum): string {
    switch (priority) {
      case PrioritiyStatusEnum.Low:
        return 'Low';
      case PrioritiyStatusEnum.Medium:
        return 'Medium';
      case PrioritiyStatusEnum.High:
        return 'High';
      case PrioritiyStatusEnum.Critical:
        return 'Critical';
      default:
        return 'Undefined';
    }
  }

  getPriorityClass(priority: PrioritiyStatusEnum): string {
    switch (priority) {
      case PrioritiyStatusEnum.Low:
        return 'bg-secondary';
      case PrioritiyStatusEnum.Medium:
        return 'bg-primary';
      case PrioritiyStatusEnum.High:
        return 'bg-warning';
      case PrioritiyStatusEnum.Critical:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
