import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Transaction {
  id: string;
  accountId: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer In' | 'Transfer Out';
  amount: number;
  timestamp: Date;
  description?: string;
  relatedAccountId?: string; // For transfers
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly TRANSACTIONS_STORAGE_KEY = 'bankingTransactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadTransactions());
  public transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();

  constructor() { }
  private loadTransactions(): Transaction[] {
    const transactionsString = localStorage.getItem(this.TRANSACTIONS_STORAGE_KEY);
    // Parse date strings back to Date objects
    return transactionsString ? JSON.parse(transactionsString).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) })) : [];
  }

  private saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions); // Notify subscribers
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: 'TRN-' + Date.now() + Math.floor(Math.random() * 1000),
      timestamp: new Date()
    };
    const currentTransactions = this.loadTransactions();
    currentTransactions.push(newTransaction);
    this.saveTransactions(currentTransactions);
  }

  getTransactionsForAccount(accountId: string): Transaction[] {
    const allTransactions = this.loadTransactions();
    return allTransactions.filter(t => t.accountId === accountId)
                          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Newest first
  }
}
