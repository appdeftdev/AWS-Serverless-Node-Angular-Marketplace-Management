import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationQuery } from 'src/app/shared/model/PaginationQuery';
import { Expense } from '../model/expense';
import { Identifier, PaymentMethodIdentifier, RegisterIdentifier } from '../model/expense.types';

const API_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {
  }

  getExpense(expenseId: number): Observable<Expense> {
    return this.http.get<Expense>(`${API_URL}/expenses/${expenseId}`)
      .pipe(map((response) => new Expense(response)));
  }

  getAllExpenses(query): Observable<{ result: Expense[]; total: number }> {
    const productQueryParams = new HttpParams()
      .set('offset', query.offset ? query.offset : 0)
      .set('limit', query.limit ? query.limit : '')
      .set('search', query.search ? query.search : '')
      .set('searchOP', query.searchOP ? query.searchOP : '')
      .set('sortBy', query.sortBy ? query.sortBy : '')
      .set('amount', query.amount ? query.amount : '')
      .set('amountOP', query.amountOP ? query.amountOP : '')
      .set('expenseCategory', query.expenseCategory ? query.expenseCategory : '')
      .set('location', query.location ? query.location : '')
      .set('paymentMethod', query.paymentMethod ? query.paymentMethod : '')
      .set('taxable', query.taxable ? query.taxable : '')
      .set('fromDate', query.fromDate ? query.fromDate : '')
      .set('toDate', query.toDate ? query.toDate : '')
      .set('createdAtFromDate', query.createdAtFromDate ? query.createdAtFromDate : '')
      .set('createdAtToDate', query.createdAtToDate ? query.createdAtToDate : '')
      .set('updatedAtFromDate', query.updatedAtFromDate ? query.updatedAtFromDate : '')
      .set('updatedAtToDate', query.updatedAtToDate ? query.updatedAtToDate : '');

    return this.http.get<{ result: Expense[]; total: number }>(
      `${API_URL}/expenses`,
      { params: productQueryParams },
    );
  }

  getExpenseCategories(): Observable<Identifier[]> {
    return this.http.get<Identifier[]>(`${API_URL}/expense-categories`)
      .pipe(map((response) => response.map((e) => (<Identifier>{ id: e.id, name: e.name }))));
  }

  getStockLocations(): Observable<Identifier[]> {
    return this.http.get<Identifier[]>(`${API_URL}/stock-location`)
      .pipe(map((response) => response.map((e) => (<Identifier>{ id: e.id, name: e.name }))));
  }

  getStockLocationRegister(locationId: number): Observable<RegisterIdentifier[]> {
    return this.http.get<RegisterIdentifier[]>(`${API_URL}/stock-location/${locationId}/pos/registers`)
      .pipe(map((response) => response.map((e) => (<RegisterIdentifier>{
        id: e.id,
        name: e.name,
        status: e.status,
        PaymentMethodToRegisters: e.PaymentMethodToRegisters,
      }))));
  }

  getTaxes(): Observable<Identifier[]> {
    return this.http.get<Identifier[]>(`${API_URL}/taxes`).pipe(map((response) => response.map((e) => (<Identifier>{
      id: e.id,
      name: e.name,
    }))));
  }

  getTaxLists(): Observable<any[]> {
    return this.http.get<Identifier[]>(`${API_URL}/taxes`);
  }

  getTaxById(taxId): Observable<any> {
    return this.http.get(`${API_URL}/taxes/${taxId}`);
  }

  getPaymentMethods(): Observable<PaymentMethodIdentifier[]> {
    return this.http.get<PaymentMethodIdentifier[]>(`${API_URL}/payment-methods/list`).pipe(map((response) => response.map((e) => (<PaymentMethodIdentifier>{
      id: e.id,
      name: e.name,
      type: e.type,
    }))));
  }

  createExpense(payload: Expense): Observable<any> {
    return this.http.post(`${API_URL}/expenses/create`, payload);
  }

  updateExpense(payload: Expense): Observable<any> {
    return this.http.put<any[]>(`${API_URL}/expenses/${payload.id}`, payload);
  }

  getExpenses(pageQuery: PaginationQuery): Observable<{ result: Expense[], total: number }> {
    return new Observable((subscriber) => {
      const { offset, limit, query = '' } = pageQuery;
      const requestPromise = this.http.get<{ result: Expense[], total: number }>(`${API_URL}/expenses?query=${query}&limit=${limit}&offset=${offset}`).toPromise();

      requestPromise.then((data: any) => {
        subscriber.next(data);
      });
    });
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/expenses/${id}`);
  }
}
