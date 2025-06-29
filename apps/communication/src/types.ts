export enum EMsgType {
  CHAT,
  CONNECT
}

export interface IData {
  msgType: EMsgType;
  userId: number;
  timestamp: Date;
  data?: any;
}