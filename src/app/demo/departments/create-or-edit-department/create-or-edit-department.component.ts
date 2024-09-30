import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from 'src/app/Services/department.service';
import { Department } from 'src/interfaces/department.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-or-edit-department',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-or-edit-department.component.html',
  styleUrl: './create-or-edit-department.component.scss'
})
export class CreateOrEditDepartmentComponent implements OnInit {
  @Input() departmentId?: number;
  loading = false;
  department: Department = { name: '', description: '', createdBy: 1 };

  constructor(
    private activeModal: NgbActiveModal,  // Rename modalService to activeModal
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    if (this.departmentId) {
      this.loadDepartment();
    }
  }

  loadDepartment() {
    this.loading = true;
    this.departmentService.getDepartmentById(this.departmentId!).subscribe(
      (resp) => {
        if (resp.status) {
          this.department = resp.data;
          this.loading = false;
        } else {
          this.loading = false;
          Swal.fire('Error', 'Failed to load department details', 'error');
          this.activeModal.dismiss();
        }
      },
      (error) => {
        console.error('Error loading department:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load department details', 'error');
      }
    );
  }

  closeModal(result?: string) {
    this.activeModal.close(result);
    this.resetFields();
  }

  save() {
    this.loading = true;
    if (this.department.name && this.department.description) {
      if (this.departmentId) {
        this.updateDepartment();
      } else {
        this.createDepartment();
      }
    } else {
      this.loading = false;
      Swal.fire('Error', 'Please fill out both fields.', 'error');
    }
  }

  createDepartment() {
    this.departmentService.createDepartment(this.department).subscribe(
      (response) => {
        if (response.status) {
          this.handleSuccess('Department Added Successfully');
          this.closeModal('added');  // Pass 'added' as result
        } else {
          response.message?this.handleError(response.message):this.handleError('Error while Adding Department');
        }
      },
      (error) => {
        this.handleError('Error creating department');
      }
    );
  }

  updateDepartment() {
    if (this.departmentId === undefined) {
      this.handleError('Department ID is undefined');
      return;
    }

    this.departmentService.updateDepartment(this.department).subscribe(
      (response) => {
        if (response.status) {
          this.handleSuccess('Department updated successfully');
          this.closeModal('updated');  // Pass 'updated' as result
        } else {
          this.handleError('Error updating department');
        }
      },
      (error) => {
        this.handleError('Error updating department');
      }
    );
  }

  handleSuccess(message: string) {
    this.loading = false;
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  handleError(message: string) {
    this.loading = false;
    console.error(message);
    Swal.fire('Error', message, 'error');
  }

  resetFields() {
    this.department = { name: '', description: '', createdBy: 1 };
  }
}
