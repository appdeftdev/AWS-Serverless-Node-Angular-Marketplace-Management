// eslint-disable-next-line max-classes-per-file
export class ExpenseCategory {
  public id?: number;

  public name?: string;

  public parentId?: string;

  public level?: number;

  public seq?: boolean;

  public createdAt?: boolean;

  public updatedAt: Date;

  public deletedAt?: Date;

  public expenses?: Array<number>;

  constructor(type?) {
    Object.assign(this, type || {});
  }

  get label() {
    return this.name;
  }

  get value() {
    return this.id;
  }
}

export class CreatedExpenseCategoryResult {
  public expenseCategory?: ExpenseCategory;

  public error?: string;
}
