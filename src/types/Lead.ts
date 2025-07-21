
export interface Lead {
  id: number;
  companyName: string;
  email: string;
  contactPerson: string;
  phone:string;
  assignee: string;
  priority: string;
  status: string;
  notes?: string;
  nextFollowUpDate?: string; // ✅ match backend naming
}

// New type for creating lead (no id)
export type NewLead = Omit<Lead, 'id'>;

export const statuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
export const priorities = ['low', 'medium', 'high'];
export const users = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh'];
