import { ExpenseCategory } from './expenseCategory';
import { PaymentMethod } from '../../shared/model/PaymentMethod';
import { StockLocation } from '../../shared/model/StockLocation';
import { Register } from '../../internal-apps/pos/model/Register';
import { Tax } from '../../shared/model/Tax';

export class Expense {
  public id?: number;

  public name?: string;

  public paymentDate?: Date;

  public amount?: number;

  public taxAmount?: number;

  public paymentMethodId?: number;

  public PaymentMethod?: PaymentMethod;

  public considerPosCaseManagement?: boolean;

  public cashManagementLocationId: number;

  public cashManagementRegisterId?: number;

  public taxable?: boolean;

  public taxId?: number;

  public Tax?: Tax;

  public expenseCategoryId?: number;

  public ExpenseCategory?: ExpenseCategory;

  public StockLocation?: StockLocation;

  public Register?: Register;

  public ExpenseStockLocations?: [];

  public updatedAt?: Date;

  public createdAt?: Date;

  constructor(expense?) {
    Object.assign(this, expense || {});
  }
}
