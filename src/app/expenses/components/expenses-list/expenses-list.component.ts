import {
  Component, OnInit, ViewChild, EventEmitter,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  concatMap, filter, map, tap,
} from 'rxjs/operators';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { DatatableColumn } from 'src/app/shared/model/datatable';
import { Router } from '@angular/router';
import { AppState } from 'src/app/reducers';
import { FormGroup } from '@angular/forms';
import { TableAttributes } from 'src/app/shared/components/table/paginator/paginator.component';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe';
import { PaginationQuery } from 'src/app/shared/model/PaginationQuery';
import { PermissionHelperService } from 'src/app/shared/services/permission.helper.service';
import moment from 'moment';
import { CONDITION_TYPE } from 'src/app/shared/constants';
import { debounce } from 'lodash';
import { ExpenseActions } from '../../expense.action-types';
import {
  ExpenseSearchFilter,
} from '../../utils/expense-search-and-filter';
import * as expenseSelectors from '../../selectors/expense.selector';
import { allExpensesLoaded } from '../../expenses.actions';
import { ExpenseService } from '../../services/expense.service';
import getColumns from '../../services/expense-datatable-columns.service';
import { Expense } from '../../model/expense';
import { DatatableV1Component } from '../../../shared/components/datatable-v1/datatable-v1.component';
// import { ExpenseFilterService } from '../../services/expense-filter.service';

@Component({
  selector: 'rw-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
})

@AutoUnsubscribe
export class ExpensesListComponent implements OnInit {
  subscriptionRefs;

  @ViewChild('datatable', { static: true }) datatableRef: DatatableV1Component;

  columns: DatatableColumn[] = [];

  totalRows = 0;

  filteredCountList: any[];

  searchForm: FormGroup;

  searchFilters: ExpenseSearchFilter = {} as ExpenseSearchFilter;

  expenses: any[] = [];

  expenseTotal = 0;

  expenseCategories = [];

  stockLocations = [];

  clearFilters = new EventEmitter<true>();

  tableAttributes: TableAttributes = {
    first: 0,
    rows: 10,
    total: 0,
    recordCounts: [3, 5, 8, 10],
  };

  language: 'ar' | 'en' | string;

  loading: boolean;

  constructor(
    public permissionService: PermissionHelperService,
    public translate: TranslateService,
    private expenseService: ExpenseService,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.language = localStorage.getItem('language');
    this.translate.use(this.language);
  }

  async ngOnInit() {
    if (!this.permissionService.isPermissionExist('expense.expense_list.search')) {
      this.router.navigateByUrl('/dashboard');
    }

    this.subscriptionRefs = this.store
      .select(expenseSelectors.deletedExpenseId)
      .pipe(
        filter((e) => !!e),
        // eslint-disable-next-line no-return-assign
        tap(() => (this.loading = true)),
        concatMap(() => this.getExpenses({
          offset: 0,
          limit: this.tableAttributes.rows,
          // query: this.searchControl.value,
        })),
      )
      .subscribe((payload) => {
        this.setExpenses(payload.result);
        this.tableAttributes.total = payload.total;
        this.loading = false;
      });

    this.expenseCategories = await this.getExpenseCategories().then((categories) => categories);
    this.stockLocations = await this.getStockLocations().then((locations) => locations);
    this.columns = getColumns(
      this.editSelectedExpense.bind(this),
      this.deleteExpenseHandler.bind(this),
      {
        expenseCategories: this.expenseCategories,
        stockLocations: this.stockLocations,
      },
    );
    if (this.language === 'ar') {
      this.columns = this.columns.reverse();
    }

    this.getExpenses({
      limit: this.tableAttributes.rows,
      offset: this.tableAttributes.first,
      page: 0,
    }).subscribe((expenses) => {
      this.setExpenses(expenses.result);
      this.tableAttributes.total = expenses.total;
    });
  }

  setExpenses(expenses: {
    amount: number
  }[]) {
    this.expenses = expenses;
    this.expenseTotal = expenses.reduce((sum, curExpenseObj) => sum + curExpenseObj.amount, 0);
  }

  handleOnPageChanged({ limit, offset }) {
    this.tableAttributes.rows = limit;
    this.tableAttributes.first = offset;
    this.loadExpenses().subscribe();
  }

  loadExpenses() {
    return this.getExpenses({
      limit: this.tableAttributes.rows,
      offset: this.tableAttributes.first,
      page: 0,
    }).pipe(
      tap((expenses) => {
        this.setExpenses(expenses.result);
        this.tableAttributes.total = expenses.total;
      }),
    );
  }

  getExpenses(query: PaginationQuery) {
    this.searchFilters.sortBy = this.searchFilters.sortBy ? this.searchFilters.sortBy : JSON.stringify({ id: 'asc' });
    const filters: ExpenseSearchFilter = {
      ...this.searchFilters,
      limit: `${query.limit}`,
      offset: `${query.offset}`,
    };
    return this.expenseService
      .getAllExpenses(filters)
      .pipe(
        tap((data) => {
          this.store.dispatch(allExpensesLoaded({ expenses: data.result as any[] }));
        }),
        map((data) => (
          {
            ...data,
            result: this.mapToViewType(data.result),
          }
        )),
      );
  }

  async getExpenseCategories() {
    return this.expenseService
      .getExpenseCategories().toPromise();
  }

  async getStockLocations() {
    return this.expenseService
      .getStockLocations().toPromise();
  }

  mapToViewType(expenseLists) {
    const mappedExpenses = [];
    expenseLists.forEach((expense) => {
      const expensePayload = expense;
      expensePayload.id = `Exp-${expensePayload.id}`;
      expensePayload.createdAt = moment(expensePayload.createdAt).format('YYYY-MM-DD');
      expensePayload.updatedAt = moment(expensePayload.updatedAt).format('YYYY-MM-DD');

      const {
        id,
        name,
        amount,
        paymentDate,
        paymentMethodId,
        PaymentMethod,
        considerPosCaseManagement,
        cashManagementLocationId,
        cashManagementRegisterId,
        taxable,
        taxId,
        Tax,
        createdAt,
        updatedAt,
        expenseCategoryId,
        ExpenseCategory,
        StockLocation,
        Register,
        ExpenseStockLocations,
      } = expensePayload;

      mappedExpenses.push({
        id,
        name,
        amount,
        paymentDate,
        PaymentMethod,
        paymentMethodId,
        considerPosCaseManagement,
        cashManagementLocationId,
        cashManagementRegisterId,
        taxable,
        taxId,
        Tax,
        createdAt,
        updatedAt,
        expenseCategoryId,
        ExpenseCategory,
        StockLocation,
        Register,
        ExpenseStockLocations,
      });
    });
    this.filteredCountList = mappedExpenses;
    return mappedExpenses;
  }

  editSelectedExpense(expense: Expense) {
    let { id } = expense;
    id = Number(id.toString().split('-')[1]);
    this.router.navigateByUrl(`/expenses/${id}`, { state: { expense } });
  }

  deleteExpenseHandler(expense: Expense) {
    let { id } = expense;
    id = Number(id.toString().split('-')[1]);
    const modalRef = this.modalService.open(ModalComponent, { size: 'lg' });

    modalRef.componentInstance.content = {
      templateName: 'delete-expense',
      title: this.translate.instant('Delete expense'),
      modalParagraphTitle: this.translate.instant('Confirm deleting the expense'),
      modalParagraph: this.translate.instant('Are you sure?'),
      data: {
        expenseId: id,
      },
      success_btn: {
        handler: this.confirmDeleteExpense.bind(this, modalRef),
        text: this.translate.instant('Confirm'),
      },
      cancel_btn: {
        handler: this.cancelDeleteExpense.bind(this),
        text: this.translate.instant('Cancel'),
      },
    };
  }

  confirmDeleteExpense(modalRef) {
    const { expenseId: id } = modalRef.componentInstance.content.data;
    this.store.dispatch(ExpenseActions.deleteExpense({ id }));
    this.modalService.dismissAll();
  }

  cancelDeleteExpense() {
    this.modalService.dismissAll();
  }

  reset() {
    this.searchFilters = {} as any;
    this.tableAttributes.first = 0;
    this.tableAttributes.total = 0;
    this.searchForm.reset();
    this.loadExpenses().subscribe();
  }

  searchExpenseHandler(searchString: string) {
    this.clearFilters.emit(true);
    if (Number.isNaN(+searchString)) {
      this.searchFilters = {
        search: searchString,
        searchOP: CONDITION_TYPE.contains,
      } as Partial<ExpenseSearchFilter> as any;
    } else {
      this.searchFilters = {
        amount: searchString,
        amountOP: CONDITION_TYPE.equals,
      } as Partial<ExpenseSearchFilter> as any;
    }
    return this.filterExpenseHandler();
  }

  filterExpenseHandler = debounce(
    () => this.getExpenses({
      limit: this.tableAttributes.rows,
      offset: this.tableAttributes.first,
      page: 0,
    }).subscribe((expenses) => {
      this.setExpenses(expenses.result);
      this.tableAttributes.total = expenses.total;
    }),
    100,
  );

  onLimitChange(page) {
    return this.getExpenses({
      limit: page.rows,
      offset: page.first,
      page: 0,
    }).subscribe((expenses) => {
      this.setExpenses(expenses.result);
      this.tableAttributes.total = expenses.total;
    });
  }

  filterexpense(expenseFilters) {
    let { sortField } = expenseFilters;
    if (sortField === 'ExpenseCategory') {
      sortField = 'expenseCategory';
    }
    if (sortField === 'ExpenseStockLocations') {
      sortField = 'location';
    }

    if (sortField === 'PaymentMethod') {
      sortField = 'paymentMethod';
    }

    const sortOrder = expenseFilters.sortOrder === 1 ? 'asc' : 'desc';
    const obj = {};

    if (sortField) {
      obj[sortField] = sortOrder;
      this.searchFilters.sortBy = JSON.stringify(obj);
    }
    const { filters } = expenseFilters;
    if (filters.name) {
      filters.name.map((item) => {
        if (item.value) {
          this.searchFilters.search = item.value;
          this.searchFilters.searchOP = CONDITION_TYPE[item.matchMode];
        } else {
          this.searchFilters.search = '';
        }
        return item;
      });
    }
    if (filters.amount) {
      filters.amount.map((item) => {
        if (item.value) {
          this.searchFilters.amount = item.value.toString();
          this.searchFilters.amountOP = CONDITION_TYPE[item.matchMode];
        } else {
          this.searchFilters.amount = '';
        }
        return item;
      });
    }
    if (filters.ExpenseCategory) {
      const ids = [];
      filters.ExpenseCategory.map((item) => {
        if (item.value) {
          item.value.map((res) => {
            ids.push(res.id);
            return res;
          });
        } else {
          this.searchFilters.expenseCategory = '';
        }
        return item;
      });

      this.searchFilters.expenseCategory = ids && ids.toString();
    }
    if (filters.ExpenseStockLocations) {
      const ids = [];
      filters.ExpenseStockLocations.map((item) => {
        if (item.value) {
          item.value.map((res) => {
            ids.push(res.id);
            return res;
          });
        } else {
          this.searchFilters.location = '';
        }
        return item;
      });

      this.searchFilters.location = ids && ids.toString();
    }
    if (filters.PaymentMethod) {
      filters.PaymentMethod.map((item) => {
        if (item.value) {
          this.searchFilters.paymentMethod = item.value.value;
        } else {
          this.searchFilters.paymentMethod = '';
        }
        return item;
      });
    }
    if (filters.taxable) {
      filters.taxable.map((item) => {
        if (item.value) {
          this.searchFilters.taxable = (item.value.name === 'Yes' ? 1 : 0).toString();
        } else {
          this.searchFilters.taxable = '';
        }
        return item;
      });
    }
    if (filters.paymentDate) {
      let fromDate: string;
      let toDate: string;
      filters.paymentDate.map((item) => {
        if (item.value) {
          if (item.value.name === 'Today') {
            fromDate = moment().format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Yesterday') {
            fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
            toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
          } else if (item.value.name === 'Last 7 Days') {
            fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Last 30 days') {
            fromDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'This month') {
            fromDate = moment().startOf('month').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Last month') {
            fromDate = moment().startOf('month').subtract(1, 'months').startOf('month')
              .format('YYYY-MM-DD');
            toDate = moment().startOf('month').subtract(1, 'months').endOf('month')
              .format('YYYY-MM-DD');
          } else {
            fromDate = moment(item.value).format('YYYY-MM-DD');
            toDate = moment(item.value).format('YYYY-MM-DD');
          }
          this.searchFilters.fromDate = fromDate;
          this.searchFilters.toDate = toDate;
        } else {
          this.searchFilters.fromDate = '';
          this.searchFilters.toDate = '';
        }
        return item;
      });
    }
    if (filters.createdAt) {
      let fromDate: string;
      let toDate: string;
      filters.createdAt.map((item) => {
        if (item.value) {
          if (item.value.name === 'Today') {
            fromDate = moment().format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Yesterday') {
            fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
            toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
          } else if (item.value.name === 'Last 7 Days') {
            fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Last 30 days') {
            fromDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'This month') {
            fromDate = moment().startOf('month').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Last month') {
            fromDate = moment().startOf('month').subtract(1, 'months').startOf('month')
              .format('YYYY-MM-DD');
            toDate = moment().startOf('month').subtract(1, 'months').endOf('month')
              .format('YYYY-MM-DD');
          } else {
            fromDate = moment(item.value).format('YYYY-MM-DD');
            toDate = moment(item.value).format('YYYY-MM-DD');
          }
          this.searchFilters.createdAtFromDate = fromDate;
          this.searchFilters.createdAtToDate = toDate;
        } else {
          this.searchFilters.createdAtFromDate = '';
          this.searchFilters.createdAtToDate = '';
        }
        return item;
      });
    }
    if (filters.updatedAt) {
      let fromDate: string;
      let toDate: string;
      filters.updatedAt.map((item) => {
        if (item.value) {
          if (item.value.name === 'Today') {
            fromDate = moment().format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Yesterday') {
            fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
            toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
          } else if (item.value.name === 'Last 7 Days') {
            fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Last 30 days') {
            fromDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'This month') {
            fromDate = moment().startOf('month').format('YYYY-MM-DD');
            toDate = moment().format('YYYY-MM-DD');
          } else if (item.value.name === 'Last month') {
            fromDate = moment().startOf('month').subtract(1, 'months').startOf('month')
              .format('YYYY-MM-DD');
            toDate = moment().startOf('month').subtract(1, 'months').endOf('month')
              .format('YYYY-MM-DD');
          } else {
            fromDate = moment(item.value).format('YYYY-MM-DD');
            toDate = moment(item.value).format('YYYY-MM-DD');
          }
          this.searchFilters.updatedAtFromDate = fromDate;
          this.searchFilters.updatedAtToDate = toDate;
        } else {
          this.searchFilters.updatedAtFromDate = '';
          this.searchFilters.updatedAtToDate = '';
        }
        return item;
      });
    }
    return this.filterExpenseHandler();
  }
}
