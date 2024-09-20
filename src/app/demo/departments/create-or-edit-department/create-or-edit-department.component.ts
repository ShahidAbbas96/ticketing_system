import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-or-edit-department',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-or-edit-department.component.html',
  styleUrl: './create-or-edit-department.component.scss'
})
export class CreateOrEditDepartmentComponent implements OnInit {
  modalService:NgbActiveModal;
  @Input() departmentId!: number;
  loading = false; 
  name: string = '';
  description: string = '';
  constructor(modalService:NgbActiveModal){
     this.modalService=modalService;
  }
  ngOnInit() {
    if(this.departmentId){
      this.name="HR";
      this.description="HR Department deals with human resource"
    }
  }
  closeModal(){
    this.modalService.dismiss();
    this.resetFields();
  }
  save() {
    this.loading = true; 
    if (this.name && this.description) {
      // Logic to save the data (e.g., send it to a service or API)
      console.log('Name:', this.name);
      console.log('Description:', this.description);
      this.loading = false; 
      // Close modal and reset fields after saving
      this.closeModal();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Saved SuccessFully",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      alert('Please fill out both fields.');
    }
  }

  resetFields() {
    this.name = '';
    this.description = '';
  }
}
