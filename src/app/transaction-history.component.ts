import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService, Account } from './service/account.service';
import { TransactionService, Transaction } from './service/transaction.service';
import { Observable, combineLatest, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit{
  accountSelectForm!: FormGroup;
  accounts$!: Observable<Account[]>;
  filteredTransactions$!: Observable<Transaction[]>;
  constructor(private fb: FormBuilder, private accountService: AccountService, private transactionService: TransactionService){}

    ngOnInit(): void {
    this.accountSelectForm = this.fb.group({
      selectedAccount: [''] // No default selection
    });

    this.accounts$ = this.accountService.accounts$; // Get all accounts

    // Combine latest account selection with all transactions to filter
    this.filteredTransactions$ = combineLatest([
      this.accountSelectForm.get('selectedAccount')?.valueChanges.pipe(startWith('')) || of(''), // Start with empty selection
      this.transactionService.transactions$ // All transactions
    ]).pipe(
      map(([selectedAccountId, allTransactions]) => {
        if (selectedAccountId) {
          return this.transactionService.getTransactionsForAccount(selectedAccountId);
        }
        return []; // No account selected, show no transactions
      })
    );
  }
}
