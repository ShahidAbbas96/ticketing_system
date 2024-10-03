import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../Services/user.services';
import { DepartmentService } from '../../../Services/department.service';

import { RegionService } from '../../../Services/region.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { forkJoin, of } from 'rxjs';
import { RoleService } from 'src/app/Services/role.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-or-edit-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-or-edit-user.component.html',
  styleUrl: './create-or-edit-user.component.scss'
})
export class CreateOrEditUserComponent implements OnInit {
  @Input() userId?: number;
  userForm!: FormGroup;
  loading = false;
  imagePreview: string | ArrayBuffer | null = null;
  passwordVisible: boolean = false;
  departments: any[] = [];
  roles: any[] = [];
  regions: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private roleService: RoleService,
    private regionService: RegionService,
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadInitialData();
  }

  initForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      username: ['', Validators.required],
      password: ['', this.userId ? [] : Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      departmentId: ['', Validators.required],
      roleId: ['', Validators.required],
      regionId: ['', Validators.required],
      image: [null],
    });
  }

  loadInitialData() {
    this.loading = true;
    forkJoin({
      departments: this.departmentService.getAllDepartments(1, 1000),
      roles: this.roleService.getAllRoles(1, 1000),
      regions: this.regionService.getAllRegions(""),
      user: this.userId ? this.userService.getUserById(this.userId) : of(null)
    }).subscribe({
      next: (results: any) => {
        console.log(results);
        this.departments = results.departments.data;
        this.roles = results.roles.data.roles;
        this.regions = results.regions.data;

        if (results.user && results.user.status) {
          this.patchUserForm(results.user.data);
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.handleError('Failed to load initial data');
      }
    });
  }

  patchUserForm(user: any) {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.userName,
      password: user.password,
      email: user.email,
      phoneNumber: user.phoneNumber,
      departmentId: user.department.id,
      roleId: user.role.id,
      regionId: user.region.id,
      image: user.imageUrl
    });
    this.imagePreview = user.imageUrl;
  }

  // ... (keep other methods like closeModal, onImageUpload, togglePasswordVisibility)

  save() {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.loading = true;
    if (this.userId) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser() {
    this.userService.createUser(this.userForm.value).subscribe({
      next: (response) => {
        if (response.status) {
          this.showSuccessMessage('User created successfully');
          this.activeModal.close('added');
        } else {
          this.handleError(response.message || 'Error creating user');
        }
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.handleError('Error creating user');
      }
    });
  }

  updateUser() {
    const userData = { ...this.userForm.value, id: this.userId };
    this.userService.updateUser(userData).subscribe({
      next: (response) => {
        if (response.status) {
          this.showSuccessMessage('User updated successfully');
          this.activeModal.close('updated');
        } else {
          this.handleError(response.message || 'Error updating user');
        }
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.handleError('Error updating user');
      }
    });
  }

  private handleError(message: string): void {
   Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
  });
  this.loading = false;
  this.closeModal();
  }

  private showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    });
    this.closeModal();
  }

  private showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  // ... (keep handleSuccess method)

  closeModal(): void {
    this.activeModal.dismiss();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  onImageUpload(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.userForm.patchValue({ image: file });
      this.userForm.get('image')?.markAsTouched();
      this.readFile(file);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.userForm.patchValue({ image: e.target?.result });
    };
    reader.readAsDataURL(file);
  }
}
