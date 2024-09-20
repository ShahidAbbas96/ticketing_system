import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-or-edit-department',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-or-edit-user.component.html',
  styleUrl: './create-or-edit-user.component.scss'
})
export class CreateOrEditUserComponent implements OnInit {
  userForm!: FormGroup;
  loading = false;
  imagePreview: string | ArrayBuffer | null = null; 
  passwordVisible = false; 
  modalService:NgbActiveModal;
  @Input() userId!: number;
  name: string = '';
  description: string = '';
  fb:FormBuilder;
  departments = ['HR', 'IT', 'Finance', 'Marketing']; 
  roles = ['Admin', 'Manager', 'Employee']; 
  constructor(modalService:NgbActiveModal,fb: FormBuilder){
     this.modalService=modalService;
     this.fb=fb;
  }
  ngOnInit() {

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', Validators.required],
      role: ['', Validators.required],
      image: [null],
    });
  }
  closeModal(){
    this.modalService.dismiss();
    this.resetFields();
  }
  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files![0];
    
    // Check if the file is an image
    if (file && file.type.startsWith('image/')) {
      this.userForm.patchValue({ image: file });
      this.userForm.get('image')!.updateValueAndValidity();
  
      // File preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      // Alert the user and reset the file input
      alert('Please select a valid image file.');
      input.value = '';  // Clear the file input
      this.userForm.patchValue({ image: null });  // Reset the form control value
    }
  }
  

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  save() {
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    // Add your save logic here (e.g., API call)
    console.log(this.userForm.value);
    this.loading = false;
    this.closeModal();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Saved SuccessFully",
      showConfirmButton: false,
      timer: 1500
    });
  }


  resetFields() {
    this.name = '';
    this.description = '';
  }
}
