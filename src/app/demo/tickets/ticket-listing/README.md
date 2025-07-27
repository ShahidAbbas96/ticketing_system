# Ticket Listing Component

A comprehensive ticket management component that provides a table view of all tickets with advanced filtering, pagination, and status update functionality.

## Features

### 📊 Table View

- Responsive table displaying all ticket information
- Sortable columns for better data organization
- Hover effects and visual feedback
- Compact and readable design

### 🔍 Advanced Filtering

- **Search**: Search across ticket title, description, and assignee names
- **Status Filter**: Filter by ticket status (Open, In Progress, Resolved, Closed)
- **Priority Filter**: Filter by priority level (Low, Medium, High, Critical)
- **Date Range**: Filter tickets by creation date range
- **Clear Filters**: One-click filter reset

### 📄 Pagination

- Server-side pagination support
- Configurable page size (default: 10 items per page)
- Navigation controls with boundary links
- Page size indicator

### 🔄 Status Update

- Quick status update modal
- Support for all ticket statuses
- Optional comment field for status changes
- Real-time updates without page refresh

### 🎯 Actions

- **Edit**: Open ticket in edit modal
- **Update Status**: Quick status change
- **Delete**: Remove ticket with confirmation
- **Export**: Export filtered data to Excel

### 📱 Responsive Design

- Mobile-friendly interface
- Adaptive table layout
- Touch-friendly controls
- Optimized for all screen sizes

## Usage

### Navigation

Access the component via:

- Main navigation menu: "Ticket Listing"
- From existing tickets page: "View Table Listing" button
- Direct URL: `/ticket-listing`

### Permissions

- **View**: All authenticated users
- **Edit/Delete**: Based on user role permissions
- **Add New**: Role ID "5" (Admin)

## Technical Details

### Dependencies

- Angular 18+
- NgBootstrap for UI components
- Reactive Forms for filtering
- SweetAlert2 for notifications
- Excel export service

### Key Methods

- `loadTickets()`: Fetch tickets from API
- `applyFilters()`: Apply search and filter criteria
- `updateTicketStatus()`: Update ticket status
- `exportToExcel()`: Export data to Excel format

### Data Flow

1. Component initializes and loads tickets
2. Filters are applied client-side for performance
3. Pagination handles large datasets
4. Status updates trigger API calls
5. Real-time UI updates after operations

## Styling

The component uses:

- Bootstrap 5 classes for layout
- Custom SCSS for enhanced styling
- Consistent color scheme with the application
- Responsive breakpoints for mobile optimization

## API Integration

Integrates with existing `TicketService`:

- `getAllTickets()`: Fetch paginated ticket data
- `updateTicket()`: Update ticket information
- `deleteTicket()`: Remove ticket

## Future Enhancements

Potential improvements:

- Column sorting functionality
- Bulk operations (delete, status update)
- Advanced date filtering options
- Export format options (PDF, CSV)
- Real-time updates via WebSocket
- Custom column visibility settings
