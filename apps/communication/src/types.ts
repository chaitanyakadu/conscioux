// import ioredis from "ioredis"

// const redis = new ioredis()

export enum EMsgType {
  CHAT = "chat",
  CONNECT = "connect"
}

export interface IData {
  msgType: EMsgType;
  cryptoId: number;
  timestamp: Date;
  data?: any;
}

// export class RateLimiter {
//   maxRate: number
//   timePeriod: number
//   userId: number
//   key: string

//   constructor({ maxRate, timePeriod, userId, key }: { maxRate: number, timePeriod: number, userId: number, key: string }) {
//     this.maxRate = maxRate
//     this.timePeriod = timePeriod
//     this.userId = userId
//     this.key = key
//   }

//   async isBlocked(): Promise<boolean> {
//     const currRate: number = await redis.incr(`${this.key}-[${this.userId}]`)
//     if (currRate >= this.maxRate) return true
//     return false
//   }

// }