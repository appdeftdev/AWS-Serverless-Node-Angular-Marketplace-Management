import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Expense } from '../model/expense';
import { ExpenseActions } from '../expense.action-types';

export interface ExpensesState extends EntityState<Expense> {
  areExpensesLoaded: boolean;
  deletedExpenseId:string;
}

export const expensesFeatureKey = 'expenses';

export const adapter: EntityAdapter<Expense> = createEntityAdapter<Expense>();

export const initialExpenseState = adapter.getInitialState();

export const reducer = createReducer(
  initialExpenseState,
  on(ExpenseActions.allExpensesLoaded, (state, action) => {
    adapter.removeAll(state);
    return adapter.addAll(action.expenses, {
      ...state,
      areExpensesLoaded: true,
    });
  }),
  // on(ExpenseActions.expenseSaved, (state, action) => adapter.addOne(action.expense, state)),
  on(ExpenseActions.expenseDeleted, (state, action) => adapter.removeOne(action.id, {
    ...state,
    deletedExpenseId: action.id,
  })),
  on(ExpenseActions.expenseLoaded, (state, action) => adapter.addOne(action.expense, state)),

  // on(ExpenseActions.saveUpdateExpense, (state, action) => adapter
  //   .upsertOne(action.expense, state)),
);

export const {
  selectAll,
} = adapter.getSelectors();

export function expensesReducer(state: ExpensesState | undefined, action: Action) {
  return reducer(state, action);
}
