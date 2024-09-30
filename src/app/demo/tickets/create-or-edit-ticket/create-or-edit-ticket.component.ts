import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Comment } from 'src/interfaces/comment.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-or-edit-department',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-or-edit-ticket.component.html',
  styleUrl: './create-or-edit-ticket.component.scss'
})
export class CreateOrEditTicketComponent implements OnInit {
  modalService:NgbActiveModal;
  @Input() ticketId!: number;
  loading = false; 
  ticketForm!: FormGroup;
  departments = ['IT', 'HR', 'Finance']; // Example departments
  users = ['test1', 'Test2', 'Test 3']; // Example departments
  previewUrl: string | ArrayBuffer | null = null;
  previewUrlComment: string | ArrayBuffer | null = null;
  editingIndex: number | null = null;
  fb:FormBuilder;
  comments: Comment[] = []; // Store comments
  constructor(modalService:NgbActiveModal,fb: FormBuilder){
    this.modalService=modalService;
    this.fb=fb;
 }

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      department: ['', [Validators.required]],
      assignee: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['1', [Validators.required]],
      dueDate: ['', [Validators.required]],
      attachment: [null],
      commentText:['']
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.ticketForm.patchValue({ attachment: file });
      };
      reader.readAsDataURL(file);
    }
  }

  isImage(url: string | ArrayBuffer | null): boolean {
    return typeof url === 'string' && url.startsWith('data:image/');
  }

  isVideo(url: string | ArrayBuffer | null): boolean {
    return typeof url === 'string' && url.startsWith('data:video/');
  }
  closeModal(){
    this.modalService.dismiss();
    this.resetFields();
  }
  getStatusBadge() {
    const status = this.ticketForm.get('status')?.value;
    return status === 'open' ? 'bg-primary' : 'bg-warning';
  }
  onFileSelectedComment(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrlComment = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
 
  // Getter for comment text
  get commentText() {
    return this.ticketForm.get('commentText');
  }

  save() {
    this.loading = true; 
    // if (this.name && this.description) {
    //   // Logic to save the data (e.g., send it to a service or API)
    //   console.log('Name:', this.name);
    //   console.log('Description:', this.description);
    //   this.loading = false; 
    //   // Close modal and reset fields after saving
    //   this.closeModal();
    //   Swal.fire({
    //     position: "top-end",
    //     icon: "success",
    //     title: "Saved SuccessFully",
    //     showConfirmButton: false,
    //     timer: 1500
    //   });
    // } else {
    //   alert('Please fill out both fields.');
    // }
  }

  resetFields() {
    // this.name = '';
    // this.description = '';
  }

  editMode: number | null = null; // Track the comment being edited
  editText: string = '';
  editCommentId: number | null = null;
  editedCommentText: string = '';

  addComment() {
    const commentText = this.commentText?.value;
    var dateTime = new Date();
    if (commentText) {
      this.comments.push({ text: commentText, adeddBy: "John", adeddOn: dateTime, userImageUrl: "assets/images/user/avatar-1.jpg", id: this.comments.length + 1 });
      this.commentText.setValue(''); // Clear the input
    }
  }

  startEditComment(commentId: number, commentText: string) {
    this.editCommentId = commentId;
    this.editedCommentText = commentText; // Initialize with the current comment text
  }

  saveEditedComment() {
    if (this.editCommentId !== null) {
      const commentIndex = this.comments.findIndex(c => c.id === this.editCommentId);
      if (commentIndex !== -1) {
        this.comments[commentIndex].text = this.editedCommentText;
      }
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editCommentId = null;
    this.editedCommentText = '';
  }

  deleteComment(commentId: number) {
    this.comments = this.comments.filter(comment => comment.id !== commentId);
  }
}
