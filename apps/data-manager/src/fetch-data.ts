import { Redis } from "ioredis"
import axios from "axios"
import pako from "pako"
import { ICryptoUrls, ICryptoAssets, ICryptoLatest, ICryptoOverview, DataManagerError, DataManagerResponse, ICryptoResponse, RedisKey, ERedisCacheKey } from "./types.js"

const redis: Redis = new Redis()

/*
	why - pako compresses data into Uint8Array<ArrayBufferLike>
	where as redis strictly requires data to be in string format
*/
function compressToString(obj: any): string {
	const objectToString: string = JSON.stringify(obj)
	const compressString: Uint8Array<ArrayBufferLike> = pako.deflate(objectToString)
	return Buffer.from(compressString).toString("base64")
}

/*
	why - DRY principle
*/
async function compressAndCacheData({ id, type, data }: { id: number, type: ERedisCacheKey, data: string }) {
	const value: string = compressToString(data)

	const key: string = new RedisKey({ key: type, id }).getKey()

	// caching the values to redis
	await Promise.all([
		redis.set(key, value)
	])
}

// function flow - fetch api endpoint -> destructure data -> compress -> cache
export const cryptoLatestTask = async () => {
	try {
		const currency: string = "USD"

		const { data: result }: any = await axios({
			url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
			method: 'GET',
			headers: {
				"X-CMC_PRO_API_KEY": process.env.CMC_PRO_API_KEY
			},
			params: {
				limit: 24,
				convert: currency
			}
		})

		const { timestamp: tm_s, error_code, error_message }: {
			timestamp: string, error_code: number, error_message: string | null
		} = result.status

		/*
			what - it makes checks wheter the error_code was as expected(i.e. 0 for success)
			why - handles the error occured due to fetching more accurately
			this helps us segregate the fetching issues and caching/compressing issues
		*/
		new DataManagerResponse({ data: result, timestamp: tm_s, message: "Error occured while fetching the data from cmc api endpoint", error_code, error_message }).throwErrorIfHasError()

		result.data.forEach(async (stats: any) => {
			// why - destructure data to cache accordingly
			const { "price": pr, "volume_24h": tv_24h, "volume_change_24h": vc_24h, "percent_change_1h": pc_1h, "percent_change_24h": pc_24h, "percent_change_7d": pc_7d, "market_cap": mc, "fully_diluted_market_cap": fdmc }: Record<string, number> = stats.quote[currency]

			const { "id": id, "max_supply": ms, "circulating_supply": cs, "total_supply": ts }: Record<string, number> = stats

			const cryptoLatest: ICryptoLatest = { pr, pc_1h, pc_24h, pc_7d, mc, tv_24h, vc_24h, cs, tm_s }
			const cryptoOverview: ICryptoOverview = { pr, pc_24h, tv_24h, vc_24h, ts, cs, ms, fdmc, tm_s }

			const compressedCryptoLatest: string = compressToString(cryptoLatest)
			const compressedCryptoOverview: string = compressToString(cryptoOverview)

			await compressAndCacheData({ id, type: ERedisCacheKey.LATEST, data: compressedCryptoLatest })
			await compressAndCacheData({ id, type: ERedisCacheKey.OVERVIEW, data: compressedCryptoOverview })
		})
	} catch (error: any) {
		if (error instanceof DataManagerError) {
			// custom error
			const err: ICryptoResponse = error.cryptoResponse
			new DataManagerResponse({ data: err.data, timestamp: err.status.timestamp, message: err.status.message, error_code: err.status.error?.error_code, error_message: err.status.error?.error_message }).warnResponce()
		} else {
			new DataManagerResponse({ data: error, timestamp: new Date().toLocaleString("en-IN"), message: "This error was caused due to caching or compressing the fetched data from /listings/latest api endpoint of cmc.", error_code: undefined, error_message: undefined }).warnResponce()
		}
	}
}

// function flow - fetch api endpoint -> destructure data -> compress -> cache -> push to database
export const cryptoOverviewTask = async () => {
	try {
		const ids: string = "2"

		const { data: result }: any = await axios({
			url: "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info",
			method: 'GET',
			headers: {
				"X-CMC_PRO_API_KEY": process.env.CMC_PRO_API_KEY
			},
			params: {
				id: ids
			}
		})

		const { timestamp: tm_s, error_code, error_message }: {
			timestamp: string, error_code: number, error_message: string | null
		} = result.status

		/*
			what - it makes checks wheter the error_code was as expected(i.e. 0 for success)
			why - handles the error occured due to fetching more accurately
			this helps us segredate the fetching issues and caching/compressing issues
		*/
		new DataManagerResponse({ data: result, timestamp: tm_s, message: "Error occured while fetching the data from cmc api endpoint", error_code, error_message }).throwErrorIfHasError()

		Object.values(result.data).forEach(async (stats: any) => {
			// why - destructure data to cache accordingly
			const urls: any = {}

			for (const key in stats.urls) {
				urls[key] = stats.urls[key][0] || null
			}

			const { id, name, logo, symbol, slug, description, date_added, date_launched, category }: {
				id: number;
				name: string;
				logo: string;
				symbol: string;
				slug: string;
				description: string;
				date_added: string;
				date_launched: string;
				category: string;
			} = stats

			const cryptoUrls: ICryptoUrls = urls
			const crytpoAssets: ICryptoAssets = { name, logo, symbol, slug, description, date_added, date_launched, category }

			const compressedCryptoUrls: string = compressToString(cryptoUrls)
			const compressedCryptoAssets: string = compressToString(crytpoAssets)

			await compressAndCacheData({ id, type: ERedisCacheKey.URLS, data: compressedCryptoUrls })
			await compressAndCacheData({ id, type: ERedisCacheKey.ASSETS, data: compressedCryptoAssets })

			// push the data to database
		})
	} catch (error: any) {
		if (error instanceof DataManagerError) {
			// custom error
			const err: ICryptoResponse = error.cryptoResponse
			new DataManagerResponse({ data: err.data, timestamp: err.status.timestamp, message: err.status.message, error_code: err.status.error?.error_code, error_message: err.status.error?.error_message }).warnResponce()
		} else {
			new DataManagerResponse({ data: error, timestamp: new Date().toLocaleString("en-IN"), message: "This error was caused due to caching or compressing the fetched data from /info api endpoint of cmc.", error_code: undefined, error_message: undefined }).warnResponce()
		}
	}
}