import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CreateOrEditDepartmentComponent } from './create-or-edit-department/create-or-edit-department.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {
  modalService:NgbModal;
  constructor(modalService:NgbModal){
     this.modalService=modalService;
  }
  addDepartment(){
    this.modalService.open(CreateOrEditDepartmentComponent);
  }
  editDepartment(id:number){
    const modalRef = this.modalService.open(CreateOrEditDepartmentComponent);
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
