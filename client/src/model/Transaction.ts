export interface Transaction {
  checked?: boolean;
  id?: number;
  description: string;
  category: string;
  amount: number;
  date: Date;
}