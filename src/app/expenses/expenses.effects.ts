import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs/operators';
import { ExpenseService } from './services/expense.service';
import { ExpenseActions } from './expense.action-types';

@Injectable()
export class ExpensesEffects {
  loadAllExpenses$ = createEffect(() => this.actions$.pipe(
    ofType(ExpenseActions.loadAllExpenses),
    exhaustMap(() => this.expenseService.getExpenses({ offset: 0, limit: 10, query: '' })),
    map((data) => ExpenseActions.allExpensesLoaded({ expenses: data.result })),
  ),
  { dispatch: true });

  deleteExpense$ = createEffect(() => this.actions$.pipe(
    ofType(ExpenseActions.deleteExpense),
    exhaustMap((action) => this.expenseService.deleteExpense(action.id)),
    map((response) => (
      response && response.success ? ExpenseActions.expenseDeleted({ id: response.id }) : undefined
    )),
  ),
  { dispatch: true });

  constructor(
    private actions$: Actions,
    private expenseService: ExpenseService,
  ) {
  }
}
