export interface ActionLogs {
  logEventKey: string;
  eventObject: string;
  logData: LogData;
  logSection: string;
  userEmail: string;
  clientSchemaName: string;
  message: string;
  logAction: string;
  eventDate: string;
  sectionId: string;
  sectionName: string;
  sectionValue: string;
  sectionImg: string;
}
export interface LogData {
  productId: string;
  name: string;
  type: string;
  sku: string;
  params: Record<AllowedParam, string>;
  translateParams: AllowedParam[];
}
export enum AllowedParam {
  p1 = 'p1',
  p2 = 'p2',
  p3 = 'p3',
  p4 = 'p4',
}
export interface ActionLogsGroup {
  active: boolean;
  date: string;
  day: string;
  subday: string;
  actionLogs: ActionLogs[];
}
