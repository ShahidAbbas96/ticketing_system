import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { CreateOrEditUserComponent } from './create-or-edit-user/create-or-edit-user.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  modalService:NgbModal;
  constructor(modalService:NgbModal){
     this.modalService=modalService;
  }
  addUser(){
    this.modalService.open(CreateOrEditUserComponent, { size: 'lg' });
  }
  editUser(id:number){
    const modalRef = this.modalService.open(CreateOrEditUserComponent, { size: 'lg' });
    modalRef.componentInstance.userId = id; //
  }
  deleteUser(id:number){
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
