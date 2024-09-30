import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CreateOrEditTicketComponent } from './create-or-edit-ticket/create-or-edit-ticket.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent {
  modalService:NgbModal;
  openTickets = [
    { title: 'Open Ticket 1', description: 'Description of open ticket 1 that is quite long and should be shortened in the display',status:'Open' },
    { title: 'Open Ticket 2', description: 'Description of open ticket 2',status:'Open' }
  ];

  inProgressTickets = [
    { title: 'In-Progress Ticket 1', description: 'Description of in-progress ticket 1 that also needs to be shortened for the display',status:'InProgress' }
  ];

  closedTickets = [
    { title: 'Closed Ticket 1', description: 'Description of closed ticket 1' ,status:'Closed' }
  ];

  overdueTickets = [
    { title: 'Overdue Ticket 1', description: 'Description of overdue ticket 1 that is really long and needs to be shortened' ,status:'OverDue' }
  ];
  shortenDescription(description: string): string {
    const wordLimit = 20;
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  }
  constructor(modalService:NgbModal){
     this.modalService=modalService;
  }
  addTicket(){
    this.modalService.open(CreateOrEditTicketComponent,{ size: 'lg' });
  }
  editDepartment(id:number){
    const modalRef = this.modalService.open(CreateOrEditTicketComponent);
    modalRef.componentInstance.departmentId = id; //
  }
  deleteDepartment(id:number){
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
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }
}
