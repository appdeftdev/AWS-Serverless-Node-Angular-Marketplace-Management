import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  filter, finalize, first, tap,
} from 'rxjs/operators';
import { AppState } from '../../reducers';
import { areExpensesLoaded } from '../selectors/expense.selector';
import { loadAllExpenses } from '../expenses.actions';

@Injectable()
export class ExpensesResolver implements Resolve<boolean> {
  loading = false;

  resolve(): Observable<boolean> {
    return this.store.pipe(
      select(areExpensesLoaded),
      tap((expensesLoaded) => {
        if (!this.loading && !expensesLoaded) {
          this.loading = true;
          this.store.dispatch(loadAllExpenses());
        }
      }),
      filter((expensesLoaded) => expensesLoaded),
      first(),
      finalize(() => { this.loading = false; }),
    );
  }

  constructor(private store: Store<AppState>) {}
}
