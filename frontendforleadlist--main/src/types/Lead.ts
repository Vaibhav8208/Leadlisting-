
export interface Lead {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
  assignee: string;
  createdDate: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
}

export const statuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
export const priorities = ['low', 'medium', 'high'];
export const users = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh'];
