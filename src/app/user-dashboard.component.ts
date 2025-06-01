import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountService, Account } from './service/account.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  imports: [ CommonModule, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit{

  accounts$!: Observable<Account[]>;

  constructor(private accountService: AccountService){}
  ngOnInit(): void {
      this.accounts$ = this.accountService.accounts$;
  }
}
