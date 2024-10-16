import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Comment } from 'src/interfaces/comment.interface';
import Swal from 'sweetalert2';
import { TicketService } from 'src/app/Services/ticket.service';
import { CommentService } from 'src/app/Services/comment.service';
import { DepartmentService } from 'src/app/Services/department.service';
import { CreateOrUpdateTicketDto, PrioritiyStatusEnum, TicketStatusEnum } from 'src/interfaces/ticket.interface';
import { AddComment } from 'src/interfaces/addcomment.interface';
import { UserService } from 'src/app/Services/user.services';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

interface MediaPreview {
  type: 'image' | 'video';
  url: string;
}

@Component({
  selector: 'app-create-or-edit-ticket',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgbCarouselModule],
  templateUrl: './create-or-edit-ticket.component.html',
  styleUrl: './create-or-edit-ticket.component.scss',
  providers: [NgbCarouselConfig] // add NgbCarouselConfig to the component providers
})
export class CreateOrEditTicketComponent implements OnInit, AfterViewInit {
  @Input() ticketId?: number;
  loading = false;
  ticketForm!: FormGroup;
  departments: any[] = [];
  users: any[] = [];
  previewUrl: MediaPreview[] = [];
  previewUrlComment: string | ArrayBuffer | null = null;
  comments: any[] = [];
  priorityOptions: { [key: number]: string } = {};
  statusOptions: { [key: number]: string } = {};
  uplloadedFiles:File[]=[]
  constructor(
    private modalService: NgbActiveModal,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private commentService: CommentService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private config: NgbCarouselConfig
  ) {
    this.initEnumMappings();
    this.config.interval = 0; // set to 0 to disable auto-sliding
    this.config.wrap = false;
    this.config.keyboard = false;
    this.config.pauseOnHover = false;
  }

  ngOnInit(): void {

    if (this.ticketId) {
      this.loadUsers();
      this.loadTicket();
      this.loadComments();
    }
    this.loadDepartments();
    this.initForm();
  }

  initEnumMappings(): void {
    // Create mappings for TicketStatusEnum
    for (const [key, value] of Object.entries(TicketStatusEnum)) {
      if (!isNaN(Number(value))) {
        this.statusOptions[Number(value)] = key;
      }
    }

    // Create mappings for PrioritiyStatusEnum
    for (const [key, value] of Object.entries(PrioritiyStatusEnum)) {
      if (!isNaN(Number(value))) {
        this.priorityOptions[Number(value)] = key;
      }
    }
  }

  initForm(): void {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      assigneeId: [{ value: '', disabled: !this.ticketId }],
      description: ['', [Validators.required]],
      TicketStatus: [{ value: TicketStatusEnum.Open, disabled: !this.ticketId }, [Validators.required]],
      dueDate: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      attachment: [null],
      commentText: [{ value: '', disabled: !this.ticketId }]
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments(1, 100).subscribe({
      next: (response) => {
        if (response.status) {
          this.departments = response.data;
        }
      },
      error: (error) => console.error('Error loading departments:', error)
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers(1, 1000).subscribe({
      next: (response) => {
        if (response.status) {
          this.users = response.data.users;
      
        }
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadTicket(): void {
    if (this.ticketId) {
      this.ticketService.getTicketById(this.ticketId).subscribe({
        next: (response) => {
          if (response.status) {
            const ticket = response.data;
            // Format the date to YYYY-MM-DD
            if (ticket.dueDate) {
              const date = new Date(ticket.dueDate);
              ticket.dueDate = date.toISOString().split('T')[0];
            }
            console.log(ticket);
            this.ticketForm.patchValue(ticket);
            this.ticketForm.get('assigneeId')?.enable();
            this.ticketForm.get('status')?.enable();
            this.previewUrl = (Array.isArray(ticket.attachmentUrl) ? ticket.attachmentUrl : [ticket.attachmentUrl])
              .filter((file: any) => file && typeof file === 'object') // Filter out null, undefined, or non-object values
              .map((file: any) => ({
                file,
                type: file.type && typeof file.type === 'string' && file.type.includes('image') ? 'image' : 'video',
                url: URL.createObjectURL(file as Blob)
              })) || [];
          }
        },
        error: (error) => console.error('Error loading ticket:', error)
      });
    }
  }

  loadComments(): void {
    if (this.ticketId) {
      this.commentService.getCommentsByTicketId(this.ticketId).subscribe({
        next: (response) => {
          if (response.status) {
            this.comments = response.data;
            console.log(this.comments);
          }
        },
        error: (error) => console.error('Error loading comments:', error)
      });
    }
  }

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.uplloadedFiles.push(files[i]);
      }
    }
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const url = reader.result as string;
            const type = file.type.startsWith('image/') ? 'image' : 'video';
            this.previewUrl.push({ type, url });
          }
        };
        reader.readAsDataURL(file);
      }
      
      // Append new files to existing ones
      const currentFiles = this.ticketForm.get('attachment')?.value || [];
      const updatedFiles = currentFiles.concat(Array.from(files));
      this.ticketForm.patchValue({ attachment: updatedFiles });
    }
  }

  isImage(url: string | ArrayBuffer | null): boolean {
    return typeof url === 'string' && url.startsWith('data:image/');
  }

  isVideo(url: string | ArrayBuffer | null): boolean {
    return typeof url === 'string' && url.startsWith('data:video/');
  }

  closeModal(): void {
    this.modalService.dismiss();
  }

  save(): void {
    if (this.ticketForm.valid) {
      this.loading = true;
      const ticketData: CreateOrUpdateTicketDto = this.ticketForm.value;
      ticketData.Attachments = this.uplloadedFiles;
      if (this.ticketId) {
        ticketData.Id = this.ticketId;
        ticketData.CreatedBy = 3;
        this.updateTicket(ticketData);
      } else {
        this.createTicket(ticketData);
      }
    }
  }

  createTicket(ticketData: CreateOrUpdateTicketDto): void {
    this.ticketService.createTicket(ticketData).subscribe({
      next: (response) => {
        if (response.status) {
          Swal.fire('Success', 'Ticket created successfully', 'success');
          this.modalService.close(response.data);
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
        Swal.fire('Error', 'Failed to create ticket', 'error');
      },
      complete: () => this.loading = false
    });
  }

  updateTicket(ticketData: CreateOrUpdateTicketDto): void {
    this.ticketService.updateTicket(ticketData).subscribe({
      next: (response) => {
        if (response.status) {
          Swal.fire('Success', 'Ticket updated successfully', 'success');
          this.modalService.close(response.data);
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error updating ticket:', error);
        Swal.fire('Error', 'Failed to update ticket', 'error');
      },
      complete: () => this.loading = false
    });
  }

  addComment(): void {
    if (!this.ticketId) return; // Prevent adding comments for new tickets

    const commentText = this.ticketForm.get('commentText')?.value;
    if (commentText && this.ticketId) {
      const newComment: AddComment = {
        text: commentText,
        ticketId: this.ticketId,
        createdBy: 1 // Replace with actual user ID
      };
      this.commentService.addComment(newComment).subscribe({
        next: (response) => {
          if (response.status) {
            this.comments.push(response.data);
            this.ticketForm.get('commentText')?.reset();
          } else {
            Swal.fire('Error', response.message, 'error');
          }
        },
        error: (error) => console.error('Error adding comment:', error)
      });
    }
  }

  editComment(comment: Comment) {
    comment.isEditing = true;
    comment.editText = comment.text;
  }

  saveComment(comment: Comment) {
    console.log(comment);
    if (comment.editText !== undefined && comment.id) {
      const newComment: AddComment = {
        text: comment.text,
        id: comment.id,
        ticketId: this.ticketId!,
        createdBy: 1 // Replace with actual user ID
      };
      this.commentService.updateComment(newComment).subscribe({
        next: (response) => {
          if (response.status) {
            comment.isEditing = false;
            Swal.fire('Success', 'Comment updated successfully', 'success');
          } else {
            Swal.fire('Error', response.message || 'Failed to update comment', 'error');
          }
        },
        error: (error) => {
          console.error('Error updating comment:', error);
          Swal.fire('Error', 'Failed to update comment', 'error');
        }
      });
    }
  }

  cancelEdit(comment: Comment) {
    comment.isEditing = false;
    comment.editText = '';
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: (response) => {
        if (response.status) {
          this.comments = this.comments.filter(c => c.id !== commentId);
        } 
      },
      error: (error) => console.error('Error deleting comment:', error)
    });
  }

  isValidPreviewUrl(): boolean {
    return this.previewUrl.length > 0;
  }

  getImageUrl(url: string): string {
    return url;
  }

  removeFile(index: number) {
    this.previewUrl.splice(index, 1);
    // Also remove from uplloadedFiles if necessary
    this.uplloadedFiles.splice(index, 1);
  }

  @ViewChildren('closeButton') closeButtons!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.closeButtons.forEach((button, index) => {
      console.log(`Close button ${index} exists:`, button.nativeElement);
    });
  }

  onButtonClick(event: MouseEvent, index: number) {
    console.log('Button clicked:', index);
    event.preventDefault();
    event.stopPropagation();
    this.removeFile(index);
  }

  @ViewChild('carousel') carousel!: NgbCarousel;

  onRemoveButtonClick(event: MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Remove button clicked for index:', index);
    this.removeFile(index);
  }
}