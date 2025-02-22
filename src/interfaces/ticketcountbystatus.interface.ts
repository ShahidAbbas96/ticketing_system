export interface TicketCountByStatus {
    open: number;
    closed: number;
    inProgress:number;
    overdue:number;
    currentMonth:TicketCountByStatus;
  }
  export interface DashboradCart{
    background:string;
    title:string;
    text:string;
    number:Number;
    no: Number;
  }