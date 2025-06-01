import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';

export interface Account {
  id: string;
  accountName: string; // Add account name
  type: 'Chequing' | 'Savings';
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly ACCOUNTS_STORAGE_KEY = 'bankingAccounts';
  public accountsSubject = new BehaviorSubject<Account[]>(this.loadAccounts());
  public accounts$: Observable<Account[]> = this.accountsSubject.asObservable();

  constructor() { }

  private loadAccounts(): Account[] {
    const accountsString = localStorage.getItem(this.ACCOUNTS_STORAGE_KEY);
    return accountsString ? JSON.parse(accountsString) : [];
  }

  private saveAccounts(accounts: Account[]): void {
    localStorage.setItem(this.ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    this.accountsSubject.next(accounts); // Notify subscribers of changes
  }

  createAccount(accountName: string, type: 'Chequing' | 'Savings', initialBalance: number): Account { 
    const newAccount: Account = {
      id: 'ACC-' + Date.now() + Math.floor(Math.random() * 1000), // Simple unique ID
      accountName: accountName,
      type: type,
      balance: initialBalance
    };
    const currentAccounts = this.loadAccounts();
    currentAccounts.push(newAccount);
    this.saveAccounts(currentAccounts);
    return newAccount;
  }

  getAccountById(id: string): Account | undefined {
    const accounts = this.loadAccounts();
    return accounts.find(acc => acc.id === id);
  }

  updateAccountBalance(accountId: string, amount: number): boolean {
    const currentAccounts = this.loadAccounts();
    const accountIndex = currentAccounts.findIndex(acc => acc.id === accountId);

    if (accountIndex !== -1) {
      const account = currentAccounts[accountIndex];
      const newBalance = account.balance + amount; // amount can be negative for debit

      if (newBalance >= 0) { // Balance cannot be negative validation [cite: 10]
        account.balance = newBalance;
        this.saveAccounts(currentAccounts);
        return true;
      }
    }
    return false; // Account not found or insufficient funds
  }

  transferFunds(fromAccountId: string, toAccountId: string, amount: number): boolean {
    if (amount <= 0) return false; // Amount must be positive

    const currentAccounts = this.loadAccounts();
    const fromAccount = currentAccounts.find(acc => acc.id === fromAccountId);
    const toAccount = currentAccounts.find(acc => acc.id === toAccountId);

    if (fromAccount && toAccount && fromAccount.balance >= amount) {
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      this.saveAccounts(currentAccounts);
      return true;
    }
    return false; // Transfer failed (e.g., accounts not found or insufficient balance)
  }
}
