export interface ExpenseSearchFilter {
  search: string;
  searchOP: string,
  expenseCategory: string;
  paymentMethod: string;
  amount: string;
  amountOP: string;
  location: string;
  taxable: string;
  fromDate?: string;
  toDate?: string;
  limit: string;
  offset: string;
  sortBy?: string;
  createdAtFromDate?: string;
  createdAtToDate?: string;
  updatedAtFromDate?: string;
  updatedAtToDate?: string;

}
