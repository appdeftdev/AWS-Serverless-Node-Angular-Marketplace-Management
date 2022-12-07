import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsResolver } from '../applications/services/app.resolver';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import { CreateExpenseComponent } from './components/create-expense/create-expense.component';
import { ExpenseCategoriesResolver } from './services/expense-categories.resolver';

export const expensesRoutes: Routes = [
  {
    path: '',
    resolve: {
      'application-resolver': AppsResolver,
    },
    children: [
      {
        path: '',
        component: ExpensesListComponent,
        resolve: {
        },
      },
    ],
  },
  {
    path: 'new',
    resolve: {
      'applications-subscriptions': AppsResolver,
      expenseCategories: ExpenseCategoriesResolver,
    },
    component: CreateExpenseComponent,
    data: {
      breadcrumb: {
        title: 'Create Expense',
      },
    },
  },
  {
    path: ':id',
    pathMatch: 'full',
    resolve: {
      'applications-subscriptions': AppsResolver,
      expenseCategories: ExpenseCategoriesResolver,
    },
    component: CreateExpenseComponent,
    data: {
      breadcrumb: {
        title: 'Edit Expense',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(expensesRoutes)],
  exports: [RouterModule],
})
export class ExpensesRoutingModule {}
