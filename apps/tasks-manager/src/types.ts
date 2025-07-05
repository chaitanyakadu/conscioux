export interface ITasksData {
  timestamp: Date;
  formula: string;
  userId: string;
  taskId: string;
}

export type TasksInfo = Array<Pick<ITasksData, 'timestamp' | 'userId' | 'taskId'>>

export interface ICryptoLatest {
  pr: number;
  pc_1h: number;
  pc_24h: number;
  pc_7d: number;
  mc: number;
  tv_24h: number;
  vc_24h: number;
  cs: number;
  tm_s: string; // timestamp
}