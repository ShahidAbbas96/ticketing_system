export interface AddComment {
    id?: number;
    text: string;
    ticketId: number;
    createdBy: number;
    updatedBy?: number;
  }