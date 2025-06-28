export interface IQuestion {
  id: number;
  que: string;
  ans: string;
}

export interface ICryptoUrls {
  id: number | null;
  website: string | null;
  twitter: string | null;
  reddit: string | null;
  technical_doc: string | null;
  source_code: string | null;
  message_board: string | null;
  announcement: string | null;
  chat: string | null;
  explorer: string | null;
}

export interface ICryptoAssets {
  name: string;
  logo: string;
  symbol: string;
  slug: string;
  description: string;
  date_added: string;
  date_launched: string;
  category: string;
}

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

export interface ICryptoOverview {
  pr: number;
  pc_24h: number;
  tv_24h: number;
  vc_24h: number;
  ts: number; // total supply
  cs: number; // circulating supply
  ms: number; // market cap
  fdmc: number; // fully diluted market cap
  tm_s: string; // timestamp
}

export interface CryptoStats {
  v_d: number;
  bull: number;
  bear: number;
}

export interface IError {
  error_code: number | undefined;
  error_message: string | null;
}

export interface IStatus {
  timestamp: string;
  message?: string | undefined;
  error?: IError;
}

export interface ICryptoResponse {
  data: any;
  status: IStatus;
}

export enum ERedisCacheKey {
  LATEST = "latest",
  OVERVIEW = "overview",
  URLS = "urls",
  ASSETS = "assets"
}

export class DataManagerResponse {
  data: any
  timestamp: string
  message: string | undefined
  error_code: number | undefined
  error_message: string | null

  constructor({ data, timestamp, message, error_code, error_message }: { data: any, timestamp: string, message?: string, error_code?: number, error_message?: string | null }) {
    this.data = data
    this.timestamp = timestamp
    this.message = message || undefined
    this.error_code = error_code || undefined
    this.error_message = error_message || null
  }

  getResponse(): ICryptoResponse {
    return {
      data: this.data,
      status: {
        timestamp: this.timestamp,
        error: {
          error_code: this.error_code,
          error_message: this.error_message
        }
      }
    }
  }

  hasError(): boolean {
    /*
      for more inforamtion about error_codes
      docs: https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest
    */
    return this.error_code === 0 ? false : true
  }

  warnResponce(): void {
    console.warn(this.getResponse())
  }

  throwErrorIfHasError(): DataManagerError | null {
    return this.hasError() ? new DataManagerError({ message: "Custom error", cryptoResponse: this.getResponse() }) : null
  }
}

export class DataManagerError extends Error {
  cryptoResponse: ICryptoResponse

  constructor({ message, cryptoResponse }: { message: string, cryptoResponse: ICryptoResponse }) {
    super(message)
    this.cryptoResponse = cryptoResponse

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class RedisKey {
  key: ERedisCacheKey
  id: number

  constructor({ key, id }: { key: ERedisCacheKey, id: number }) {
    this.key = key
    this.id = id
  }

  getKey(): string {
    switch (this.key) {
      case ERedisCacheKey.LATEST:
        return `crypto-latest-[${this.id}]`
      case ERedisCacheKey.OVERVIEW:
        return `crypto-overview-[${this.id}]`
      case ERedisCacheKey.ASSETS:
        return `crypto-assets-[${this.id}]`
      case ERedisCacheKey.URLS:
        return `crypto-urls-[${this.id}]`
      default:
        throw new DataManagerError({ message: "Select a valid ERedisCacheKey enum", cryptoResponse: { data: { key: this.key, id: this.id }, status: { timestamp: new Date().toLocaleString("en-IN") } } })
    }
  }
}
