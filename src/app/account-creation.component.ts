import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from './service/account.service';
import { CustomButtonComponent } from './shared/custom-button/custom-button.component';

@Component({
  selector: 'app-account-creation',
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent, RouterModule],
  templateUrl: './account-creation.component.html',
  styleUrl: './account-creation.component.scss'
})
export class AccountCreationComponent implements OnInit{
  accountForm!: FormGroup; // Use definite assignment assertion
  selectedAccountType: 'Chequing' | 'Savings' | '' = '';
  accountCreatedMessage: string = '';
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router){}
  ngOnInit(): void {
      this.accountForm = this.fb.group({
      accountName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      accountType: ['Chequing', Validators.required], // Default to Chequing
      initialBalance: [0, [Validators.required, Validators.min(0.01)]] // Balance > 0 
    });
    this.accountForm.get('accountType')?.valueChanges.subscribe(type => {
      this.selectedAccountType = type;
    });

    // Initialize selected type
    this.selectedAccountType = this.accountForm.get('accountType')?.value;
  }

  createAccount(): void {
    if (this.accountForm.valid) {
      const { accountName, accountType, initialBalance } = this.accountForm.value;
      const newAccount = this.accountService.createAccount(accountName, accountType, initialBalance);
      this.accountCreatedMessage = `Account "${newAccount.accountName}" (${newAccount.type}) created with balance: $${newAccount.balance.toFixed(2)}`;
      this.accountForm.reset({ accountType: 'Chequing', initialBalance: 0 }); // Reset form after creation
      // Optionally navigate to dashboard after successful creation
      this.router.navigate(['/dashboard']);
    } else {
      this.accountCreatedMessage = 'Please fill all fields correctly.';
    }
  }

  // Helper for form validation messages
  get f() { return this.accountForm.controls; }
}
