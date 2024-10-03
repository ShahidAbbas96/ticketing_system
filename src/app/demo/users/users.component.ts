import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { CreateOrEditUserComponent } from './create-or-edit-user/create-or-edit-user.component';
import { UserService } from '../../Services/user.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  pageNo: number = 1;
  pageSize: number = 10;
  searchString: string = '';
  totalCount: number = 0;
  Math = Math; // Add this line to make Math available in the template

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers(this.pageNo, this.pageSize, this.searchString)
      .subscribe({
        next: (response) => {
          if (response.status) {
            // Ensure that response.data is an array
            this.users = Array.isArray(response.data.users) ? response.data.users : [];
            console.log(this.users);
            this.totalCount = response.totalCount || 0;
          } else {
            // Handle the case where the response status is false
            this.users = [];
            this.totalCount = 0;
          }
        },
        error: (error) => {
          console.error('Error loading users:', error);
          // Reset users and totalCount in case of error
          this.users = [];
          this.totalCount = 0;
        }
      });
  }

  onPageChange(page: number) {
    this.pageNo = page;
    this.loadUsers();
  }

  addUser() {
    const modalRef = this.modalService.open(CreateOrEditUserComponent, { size: 'lg' });
    modalRef.result.then(
      (result) => {
        if (result === 'added') {
          this.loadUsers();
        }
      },
      () => {}
    );
  }

  editUser(id: number) {
    const modalRef = this.modalService.open(CreateOrEditUserComponent, { size: 'lg' });
    modalRef.componentInstance.userId = id;
    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.loadUsers();
        }
      },
      () => {}
    );
  }

  deleteUser(id: number) {
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
        this.userService.deleteUser(id).subscribe({
          next: (response) => {
            if (response.status) {
              Swal.fire({
                title: "Deleted!",
                text: "The user has been deleted.",
                icon: "success"
              });
              this.loadUsers();
            } else {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the user.",
                icon: "error"
              });
            }
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            Swal.fire({
              title: "Error",
              text: "An error occurred while deleting the user.",
              icon: "error"
            });
          }
        });
      }
    });
  }
}
