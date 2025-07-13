export enum EMsgType {
  CONNECT = "connect"
}

export interface IData {
  msgType: EMsgType;
  cryptoId: number;
  timestamp: Date;
  data?: any;
}
