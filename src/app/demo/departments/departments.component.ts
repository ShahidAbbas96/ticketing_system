import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '../../Services/department.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import { CreateOrEditDepartmentComponent } from './create-or-edit-department/create-or-edit-department.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [SharedModule,CommonModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  departments: any[] = [];
  pageNo: number = 1;
  pageSize: number = 1000;
  searchString: string = '';
  totalCount: number = 0;
  Math = Math;

  constructor(
    private modalService: NgbModal,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getAllDepartments(this.pageNo, this.pageSize, this.searchString)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.status) {
            this.departments = response.data;
            this.totalCount = response.totalCount || 0;
          }
        },
        error: (error) => {
          console.error('Error loading departments:', error);
        }
      });
  }

  onPageChange(page: number) {
    this.pageNo = page;
    this.loadDepartments();
  }

  addDepartment() {
    const modalRef = this.modalService.open(CreateOrEditDepartmentComponent);
    modalRef.result.then(
      (result) => {
        if (result === 'added') {
          this.loadDepartments();
        }
      },
      () => {}
    );
  }

  editDepartment(id: number) {
    const modalRef = this.modalService.open(CreateOrEditDepartmentComponent);
    modalRef.componentInstance.departmentId = id;
    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.loadDepartments();
        }
      },
      () => {}
    );
  }

  deleteDepartment(id: number) {
    this.departmentService.deleteDepartment(id).subscribe((response) => {
      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Department deleted successfully'
        });
        this.loadDepartments();
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something Went Wrong'
        });
      }
    });
  }
}
