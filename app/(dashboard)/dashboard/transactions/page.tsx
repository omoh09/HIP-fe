'use client';

import useSWR from 'swr';
import { Transaction } from '@/lib/types/transaction';

export default function TransactionsPage() {
  const { data } = useSWR<Transaction[]>('/api/transactions');

  return (
    <div>
      <h1 className="text-xl font-semibold">Transactions</h1>
      {data?.map(tx => (
        <div key={tx.id} className="border p-3 rounded">
          <div>{tx.reference}</div>
          <div>₦{tx.amount}</div>
          <div>{tx.status}</div>
        </div>
      ))}
    </div>
  );
}
