import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomButtonComponent } from './shared/custom-button/custom-button.component';
import { Observable } from 'rxjs';
import { AccountService, Account } from './service/account.service';
import { TransactionService } from './service/transaction.service';

@Component({
  selector: 'app-fund-transfer',
  imports: [ CommonModule, ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './fund-transfer.component.html',
  styleUrl: './fund-transfer.component.scss'
})
export class FundTransferComponent implements OnInit{
  transferForm!: FormGroup;
  accounts$!: Observable<Account[]>;
  transferMessage: string = '';
  constructor(private fb: FormBuilder, private accountService: AccountService, private transactionService: TransactionService){}
  ngOnInit(): void {
      this.accounts$ = this.accountService.accounts$;
      this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]] // Amount must be positive 
    }, { validators: this.accountSelectionValidator });
  }
  accountSelectionValidator(form: FormGroup) {
    const fromAccount = form.get('fromAccount')?.value;
    const toAccount = form.get('toAccount')?.value;
    if (fromAccount && toAccount && fromAccount === toAccount) {
      return { sameAccount: true };
    }
    return null;
  }
  transferFunds(): void {
    if (this.transferForm.valid) {
      const { fromAccount, toAccount, amount } = this.transferForm.value;

      // Client-side balance check (server-side/service check is also crucial)
      const accounts = this.accountService.accountsSubject.getValue();
      const senderAccount = accounts.find(acc => acc.id === fromAccount);

      if (!senderAccount || senderAccount.balance < amount) {
        this.transferMessage = 'Insufficient funds in the source account.';
        return;
      }

      if (this.accountService.transferFunds(fromAccount, toAccount, amount)) {
        this.transferMessage = `Successfully transferred $${amount.toFixed(2)} from ${fromAccount} to ${toAccount}.`;
        this.transactionService.addTransaction({
          accountId: fromAccount,
          type: 'Transfer Out',
          amount: -amount, // Negative for withdrawal
          description: `Transfer to ${toAccount}`,
          relatedAccountId: toAccount
        });
        this.transactionService.addTransaction({
          accountId: toAccount,
          type: 'Transfer In',
          amount: amount,
          description: `Transfer from ${fromAccount}`,
          relatedAccountId: fromAccount
        });
        this.transferForm.reset();
        this.transferForm.get('amount')?.setValue(0); // Reset amount to 0
      } else {
        this.transferMessage = 'Transfer failed. Check accounts and balance.';
      }
    } else {
      this.transferMessage = 'Please fill all fields correctly and ensure accounts are different.';
    }
  }

  get f() { return this.transferForm.controls; }
}
