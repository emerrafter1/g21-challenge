export type DocumentType =
  | "Financial Promotion"
  | "DDQ Response"
  | "Risk Assessment";
export type Priority = "Low" | "Medium" | "High";
export type Status = "Pending" | "In Review" | "Completed";

export interface ReviewRequest {
  id: string;
  clientName: string;
  documentTitle: string;
  documentType: DocumentType;
  priority: Priority;
  dueDate: string;
  notes?: string;
  status: Status;
  createdAt: string;
}

export type FormData = {
  clientName: string;
  documentTitle: string;
  documentType: string;
  priority: string;
  dueDate: string;
  notes: string;
  file: File | null;
};
