export enum PaymentMethods {
  CASH = 'Cash',
  Card = 'Card',
  Other = 'Other',
  SupplierDebit = 'SupplierDebit',
  SupplierCredit = 'SupplierCredit',
  CustomerDebit = 'CustomerDebit',
}

export interface Identifier {
  id: number;
  name: string;
}

export interface PaymentMethodIdentifier extends Identifier {
  type: PaymentMethods
}

export interface RegisterIdentifier extends Identifier {
  status: string;
  PaymentMethodToRegisters: {
    isCashManagement: boolean;
    paymentMethodId: number
  }[]
}

export interface ExpenseDetails {
  name: string;
  amount: string;
  paymentDate: Date;
  paymentMethodId: number;
  considerPosCaseManagement: number;
  cashManagementLocationId: number;
  cashManagementRegisterId: number;
  taxable: boolean;
  taxId: number;
  expenseCategoryId: number;
}
