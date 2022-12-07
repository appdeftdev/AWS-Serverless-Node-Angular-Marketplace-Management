export interface IDashboard {
  revenue: number;
  profit: number;
  totalSales: number;
  transactions: Transactions;
  products: Array<TopSellerProducts>;
  inventoryValue?: number;
  averageSales?: number;
  averageSaleItems?: number;
  totalExpenses?: number;
}

export interface Transactions {
  sell: number;
  return: number;
}

export interface AmountCollected {
  paymentMethodsValues: any[];
  postPay: number;
  total: number;
}

export interface TopSellerProducts {
  name: string;
  itemId: number;
  totalQuantity: number;
  totalCost: number;
}

export interface IDashboardFilter {
  startDate: Date;
  endDate: Date;
  location: string;
  channel: string;
}
