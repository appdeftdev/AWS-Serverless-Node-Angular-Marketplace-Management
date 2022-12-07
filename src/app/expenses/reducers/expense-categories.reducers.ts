import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ExpenseCategory } from '../model/expenseCategory';
import * as ExpenseCategoryActions from '../expense-category.actions';

export interface ExpenseCategoriesState extends EntityState<ExpenseCategory> {
  areExpenseCategoriesLoaded: boolean;
}

export const adaptor: EntityAdapter<ExpenseCategory> = createEntityAdapter<ExpenseCategory>();

export const initialExpenseCategoriesState = adaptor.getInitialState();

export const reducer = createReducer(
  initialExpenseCategoriesState,
  on(ExpenseCategoryActions.allExpenseCategoriesLoaded, (state, action) => adaptor
    .addAll(action.expenseCategories, {
      ...state,
      areExpenseCategoriesLoaded: true,
    })),
  on(ExpenseCategoryActions.expenseCategorySaved, (state, action) => adaptor
    .addOne(action.expenseCategory, state)),
  on(ExpenseCategoryActions.removeExpenseCategory, (state) => adaptor
    .removeOne(-1, state)),
  on(
    ExpenseCategoryActions.addChildExpenseCategoryToMainExpenseCategoryStore,
    (state, action) => adaptor.addMany(
      [
        ...action.allExpenseCategories, ...action.expenseCategories,
      ], state,
    ),
  ),

);

export const {
  selectAll,
} = adaptor.getSelectors();

export function expenseCategoriesReducer(
  state: ExpenseCategoriesState | undefined, action: Action,
) {
  return reducer(state, action);
}
