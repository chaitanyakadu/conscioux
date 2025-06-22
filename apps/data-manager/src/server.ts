import { CronJob } from "cron"
import { cryptoLatestTask, cryptoOverviewTask } from "./fetch-data.js"
import dotenv from "dotenv"

dotenv.config()

/*
	here the real time data such as crypto latest price
	will be fetched and cached accordingly.
*/
const fetchRealTimeDataJob = CronJob.from({
	cronTime: "* * * * *",
	name: "Crypto data fetcher",
	onTick: async () => {
		await cryptoLatestTask()
	},
	start: false,
	timeZone: "Asia/Kolkata"
})

/*
	here the daily jobs are executed such as crypto description
	and other metadata.
*/
const fetchCryptoDataJob = CronJob.from({
	cronTime: "* * * * *",
	name: "Crypto data fetcher",
	onTick: async () => {
		await cryptoOverviewTask()
	},
	start: false,
	timeZone: "Asia/Kolkata"
})

// trigger the job as the start parameter is set to false
fetchRealTimeDataJob.start()
fetchCryptoDataJob.start()