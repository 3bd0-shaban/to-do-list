export interface Task {
  id?: number;
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  completed?: boolean;
}
