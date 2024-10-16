export enum TicketStatusEnum {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3
}

export enum PrioritiyStatusEnum {
  Low,
  Medium,
  High,
  Critical
}

export interface CreateOrUpdateTicketDto {
  Id?: number;
  Title: string;
  DepartmentId: number;
  ticketStatus: TicketStatusEnum;
  Priority: PrioritiyStatusEnum;
  DueDate: Date;
  Description: string;
  AssigneeId?: number;
  Attachments?: File[];
  CreatedBy: number;
  UpdatedBy?: number;
}
