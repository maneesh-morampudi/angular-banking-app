import { Routes } from '@angular/router';
import { AccountCreationComponent } from './account-creation.component';
import { UserDashboardComponent } from './user-dashboard.component';
import { FundTransferComponent } from './fund-transfer.component';
import { TransactionHistoryComponent } from './transaction-history.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route to dashboard
    { path: 'dashboard', component: UserDashboardComponent }, // New dashboard route
    { path: 'create-account', component: AccountCreationComponent }, // Account creation route
    { path: 'transfer-funds', component: FundTransferComponent }, // Fund transfer route
    { path: 'transaction-history', component: TransactionHistoryComponent }, // Transaction history route
    { path: '**', redirectTo: '/dashboard' } // Wildcard route for unknown paths
];
