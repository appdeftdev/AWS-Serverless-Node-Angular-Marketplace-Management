import { createAction, props } from '@ngrx/store';
import { Expense } from './model/expense';
import { ExpenseCategory } from './model/expenseCategory';

export const loadAllExpenses = createAction(
  '[Resolve] load Expenses',
);

export const allExpensesLoaded = createAction(
  '[Load Expenses Effect] all expenses loaded',
  props<{ expenses: Expense[] }>(),
);

export const allExpenseCategoriesLoaded = createAction(
  '[Expense Category List] all expenses loaded',
  props<{ categories: ExpenseCategory[] }>(),
);

export const deleteExpense = createAction(
  '[Expense List] delete expense',
  props<{ id: number }>(),
);

export const expenseDeleted = createAction(
  '[Expense List] expense deleted',
  props<{ id: number }>(),
);

export const expenseLoaded = createAction(
  '[Expense Effect] Expense is loaded',
  props<{ expense: Expense }>(),
);
