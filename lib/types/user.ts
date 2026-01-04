export type User = {
  id: number;
  name?: string;
  email: string;
  role: 'owner' | 'member';
  createdAt: string;
  updatedAt: string;
};