// Типы для личного кабинета клиента

export interface ClientData {
  id: number;
  inn: string;
  name: string;
  email?: string;
  phone?: string;
  managerId?: number;
  manager?: {
    id: number;
    firstName: string;
    lastName: string;
    position?: string;
    phone?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionData {
  token: string;
  role: 'CLIENT';
  client: ClientData;
}

export interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate?: string;
  description?: string;
}

export interface Contract {
  id: number;
  number: string;
  title: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  description?: string;
  amount?: number;
  pdfUrl?: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: number;
  ticketId: number;
  authorId: number;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface DashboardStats {
  contractsCount: number;
  activeTicketsCount: number;
  balance: number;
  pendingInvoicesCount: number;
}
