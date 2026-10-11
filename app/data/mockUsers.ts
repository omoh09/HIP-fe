export type Invoice = {
  id: string;
  clientId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Profile = {
  companyName: string;
  address: string;
  phone: string;
  website?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  token: string;
  invoices: Invoice[];
  clients: Client[];
  profile: Profile;
};

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'nomay12627@iotrama.com',
    name: 'Alice Johnson',
    phone: '+1234567890',
    role: 'user',
    token: 'fake-token-1',
    invoices: [
      { id: 'inv1', clientId: 'c1', amount: 500, dueDate: '2025-01-15', status: 'unpaid' },
      { id: 'inv2', clientId: 'c2', amount: 1200, dueDate: '2025-02-01', status: 'paid' },
    ],
    clients: [
      { id: 'c1', name: 'Company One', email: 'client1@example.com', phone: '+11111111' },
      { id: 'c2', name: 'Company Two', email: 'client2@example.com', phone: '+22222222' },
    ],
    profile: {
      companyName: 'Alice Co.',
      address: '123 Main St, City, Country',
      phone: '+1234567890',
      website: 'https://aliceco.com',
    },
  },
  {
    id: '2',
    email: 'user2@example.com',
    name: 'Bob Smith',
    phone: '+1987654321',
    role: 'user',
    token: 'fake-token-2',
    invoices: [
      { id: 'inv3', clientId: 'c3', amount: 750, dueDate: '2025-01-20', status: 'overdue' },
    ],
    clients: [
      { id: 'c3', name: 'Company Three', email: 'client3@example.com', phone: '+33333333' },
    ],
    profile: {
      companyName: 'Bob LLC',
      address: '456 Second St, City, Country',
      phone: '+1987654321',
    },
  },
];
