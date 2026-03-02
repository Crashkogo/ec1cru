// Типы для личного кабинета клиента

export interface ManagerData {
  id: number;
  firstName: string;
  lastName: string;
  department?: string | null;  // "1C" | "TECH"
  photoUrl?: string | null;
  position?: string;
  phone?: string;
  email?: string;
}

export interface ClientData {
  id: number;
  inn: string;
  name: string;
  email?: string;
  phone?: string;
  managerId?: number | null;
  manager?: ManagerData | null;
  managerTechId?: number | null;
  managerTech?: ManagerData | null;
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

export interface ClientEmployee {
  id: number;
  clientId: number;
  name: string;
  position: string;
  phone?: string | null;
  email?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
