import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CreateOrEditTicketComponent } from '../create-or-edit-ticket/create-or-edit-ticket.component';
import Swal from 'sweetalert2';
import { TicketService } from 'src/app/Services/ticket.service';
import { CreateOrUpdateTicketDto, TicketStatusEnum, PrioritiyStatusEnum } from 'src/interfaces/ticket.interface';
import { AuthService } from 'src/app/Services/auth.service';
import { ExcelExportService } from 'src/app/Services/excel-export.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/Services/user.services';
import { RegionService } from 'src/app/Services/region.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ticket-listing',
  standalone: true,
  imports: [SharedModule, CommonModule, NgbPaginationModule, NgbDatepickerModule],
  templateUrl: './ticket-listing.component.html',
  styleUrl: './ticket-listing.component.scss'
})
export class TicketListingComponent implements OnInit {
  @ViewChild('statusUpdateModal') statusUpdateModal: any;

  modalService: NgbModal;
  ticketService: TicketService;
  excelExportService: ExcelExportService;
  authService: AuthService;
  fb: FormBuilder;
  userService: UserService;
  regionService: RegionService;

  // Data properties
  allTickets: any[] = [];
  filteredTickets: any[] = [];
  selectedTicket: any = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 1000000;
  totalItems = 0;
  
  // Filter properties
  filterForm!: FormGroup;
  searchTerm = '';
  selectedStatus: TicketStatusEnum | '' = '';
  dateRange = {
    startDate: null as any,
    endDate: null as any
  };
  
  // User info
  userId: string | null = null;
  roleId: string | null = null;
  departmentId: string | null = null;
  
  // Status update
  statusUpdateForm!: FormGroup;
  
  // Loading states
  isLoading = false;
  isUpdatingStatus = false;
  isFilterDataLoading = false;

  // Filter data
  users: any[] = [];
  regions: any[] = [];

  // Enums for template
  TicketStatusEnum = TicketStatusEnum;

  constructor(
    modalService: NgbModal, 
    ticketService: TicketService, 
    authService: AuthService, 
    excelExportService: ExcelExportService,
    fb: FormBuilder,
    userService: UserService,
    regionService: RegionService
  ) {
    this.modalService = modalService;
    this.ticketService = ticketService;
    this.excelExportService = excelExportService;
    this.authService = authService;
    this.fb = fb;
    this.userService = userService;
    this.regionService = regionService;
    
    this.userId = authService.getDecodedToken()?.userId || '';
    this.roleId = authService.getDecodedToken()?.role || '';
    this.departmentId = authService.getDecodedToken()?.departmentId || '';
    
    this.initializeForms();
    this.loadFilterData();
  }

  ngOnInit() {
    this.loadTickets();
  }

  initializeForms() {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      status: [''],
      startDate: [null],
      endDate: [null],
      region: [''],
      user: ['']
    });

    this.statusUpdateForm = this.fb.group({
      status: [''],
      comment: ['']
    });

    // Subscribe to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadFilterData() {
    this.isFilterDataLoading = true;
    
    // Load users for all users except roleId 5
    const userObservable = this.roleId !== "5" ? 
      this.userService.getAllUsers(1, 100, "", false) : 
      Promise.resolve({ status: true, data: { users: [] } });
    
    // Load regions with specific API call (pageSize=100)
    const regionObservable = this.regionService.getAllRegions("", 1, 100);
    
    forkJoin({
      users: userObservable,
      regions: regionObservable
    }).subscribe({
      next: (results) => {
        if (results.users.status) {
          // Handle different response structures
          this.users = results.users.data?.users || results.users.data || [];
        }
        if (results.regions.status) {
          this.regions = results.regions.data || [];
        }
        this.isFilterDataLoading = false;
      },
      error: (error) => {
        console.error('Error loading filter data:', error);
        this.isFilterDataLoading = false;
      }
    });
  }

  // Get unique regions from tickets data
  getUniqueRegions(): string[] {
    if (!this.allTickets || this.allTickets.length === 0) return [];
    const regions = this.allTickets.map(ticket => ticket.region).filter(region => region);
    return [...new Set(regions)];
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getAllTickets(this.currentPage, this.pageSize, this.userId ?? '', this.roleId ?? '', this.searchTerm).subscribe({
      next: (response) => {
        if (response.status) {
          this.allTickets = response.data.tickets || [];
          this.totalItems = response.data.totalCount || this.allTickets.length;
          console.log('Loaded tickets:', this.allTickets);
          
          // Debug status values
          this.allTickets.forEach((ticket, index) => {
            console.log(`Ticket ${index + 1} (ID: ${ticket.id}) status:`, ticket.ticketStatus, 'type:', typeof ticket.ticketStatus);
          });
          
          this.applyFilters();
        } else {
          console.error('Failed to load tickets:', response.message);
          Swal.fire('Error', response.message, 'error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        Swal.fire('Error', 'Failed to load tickets', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.allTickets];

    // Search filter
    const searchTerm = this.filterForm.get('searchTerm')?.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title?.toLowerCase().includes(searchTerm) ||
        ticket.description?.toLowerCase().includes(searchTerm) ||
        ticket.user?.firstName?.toLowerCase().includes(searchTerm) ||
        ticket.user?.lastName?.toLowerCase().includes(searchTerm) ||
        ticket.region?.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    const status = this.filterForm.get('status')?.value;
    if (status !== '' && status !== null) {
      const statusNum = parseInt(status);
      filtered = filtered.filter(ticket => ticket.ticketStatus === statusNum);
    }

    // Region filter
    const region = this.filterForm.get('region')?.value;
    if (region !== '' && region !== null) {
      filtered = filtered.filter(ticket => ticket.region === region);
    }

    // User filter
    const user = this.filterForm.get('user')?.value;
    if (user !== '' && user !== null) {
      const userId = parseInt(user);
      filtered = filtered.filter(ticket => ticket.createdBy === userId);
    }

    // Date range filter
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(ticket => new Date(ticket.createdDateTime) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(ticket => new Date(ticket.createdDateTime) <= end);
    }

    this.filteredTickets = filtered;
    this.totalItems = filtered.length;
  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTickets();
  }

  openStatusUpdateModal(ticket: any) {
    this.selectedTicket = ticket;
    this.statusUpdateForm.patchValue({
      status: ticket.ticketStatus,
      comment: ''
    });
    this.modalService.open(this.statusUpdateModal, { size: 'md' });
  }

  updateTicketStatus() {
    if (!this.selectedTicket || !this.statusUpdateForm.valid) {
      return;
    }

    this.isUpdatingStatus = true;
    const updateData = {
      ...this.selectedTicket,
      ticketStatus: this.statusUpdateForm.get('status')?.value,
      UpdatedBy: this.userId
    };

    this.ticketService.updateTicket(updateData).subscribe({
      next: (response) => {
        if (response.status) {
          Swal.fire('Success', 'Ticket status updated successfully', 'success');
          this.modalService.dismissAll();
          this.loadTickets();
        } else {
          Swal.fire('Error', response.message, 'error');
        }
        this.isUpdatingStatus = false;
      },
      error: (error) => {
        console.error('Error updating ticket status:', error);
        Swal.fire('Error', 'Failed to update ticket status', 'error');
        this.isUpdatingStatus = false;
      }
    });
  }

  addTicket() {
    const modalRef = this.modalService.open(CreateOrEditTicketComponent, { size: 'lg' });
    modalRef.result.then(
      () => {
        this.loadTickets();
      },
      () => {
        // Handle dismissal if needed
      }
    );
  }

  editTicket(id: number) {
    const modalRef = this.modalService.open(CreateOrEditTicketComponent, { size: 'lg' });
    modalRef.componentInstance.ticketId = id;
    
    modalRef.result.then(
      () => {
        this.loadTickets();
      },
      () => {
        // Handle dismissal if needed
      }
    );
  }

  deleteTicket(id: number) {
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
        this.ticketService.deleteTicket(id).subscribe({
          next: (response) => {
            if (response.status) {
              Swal.fire('Deleted!', 'Your ticket has been deleted.', 'success');
              this.loadTickets();
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: (error) => {
            console.error('Error deleting ticket:', error);
            Swal.fire('Error', 'Failed to delete ticket', 'error');
          }
        });
      }
    });
  }



  getStatusText(status: TicketStatusEnum | string | number): string {
    debugger;
    let statusNum: number;
    
    if (typeof status === 'string') {
      statusNum = parseInt(status);
    } else if (typeof status === 'number') {
      statusNum = status;
    } else {
      statusNum = status;
    }
    
    switch (statusNum) {
      case TicketStatusEnum.Open:
        return 'Open';
      case TicketStatusEnum.InProgress:
        return 'In Progress';
      case TicketStatusEnum.Resolved:
        return 'Resolved';
      case TicketStatusEnum.Closed:
        return 'Closed';
      default:
        console.log('Unknown status value:', status, 'type:', typeof status);
        return 'Undefined';
    }
  }



  getStatusClass(status: TicketStatusEnum | string | number): string {
    let statusNum: number;
    
    if (typeof status === 'string') {
      statusNum = parseInt(status);
    } else if (typeof status === 'number') {
      statusNum = status;
    } else {
      statusNum = status;
    }
    
    switch (statusNum) {
      case TicketStatusEnum.Open:
        return 'badge-secondary';
      case TicketStatusEnum.InProgress:
        return 'badge-warning';
      case TicketStatusEnum.Resolved:
        return 'badge-primary';
      case TicketStatusEnum.Closed:
        return 'badge-success';
      default:
        console.log('Unknown status class value:', status, 'type:', typeof status);
        return 'badge-secondary';
    }
  }

  exportToExcel(): void {
    const exportData = this.filteredTickets.map(({ assigneeId, id, ...item }) => ({
      TicketNumber: id,
      Subject: item.title,
      Status: this.getStatusText(item.ticketStatus),
      Description: item.description,
      CreatedDate: item.createdDateTime,
      DueDate: item.dueDate,
      FinancialCost: item.financialCost,
      ClosedDate: item.closedDate,
      Region: item.region || '-',
      Assignee: item.user?.firstName + " " + item.user?.lastName || 'Unassigned'
    }));

    this.excelExportService.exportToExcel(exportData, 'ticketsReport');
  }

  getStatusOptions() {
    return Object.values(TicketStatusEnum).filter(value => typeof value === 'number') as TicketStatusEnum[];
  }



  isOverdue(dueDate: string | Date): boolean {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }
} 