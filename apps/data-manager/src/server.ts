import { CronJob } from "cron"
import { cryptoLatestTask, cryptoOverviewTask } from "./fetch-data.js"
import dotenv from "dotenv"
import * as http from "http"
import { register, Counter } from "prom-client"

dotenv.config()

const jobRuns = new Counter({
	name: "cron_job_runs_total",
	labelNames: ["service", "jobType"],
	help: "Total number of cron jobs execution."
})

/*
	here the real time data such as crypto latest price
	will be fetched and cached accordingly.
*/
const fetchRealTimeDataJob = CronJob.from({
	cronTime: "* * * * *",
	name: "Crypto data fetcher",
	onTick: async () => {
		jobRuns.inc({ service: "data-manager", jobType: "crypto-latest" })
		await cryptoLatestTask()
	},
	start: false,
	timeZone: "Asia/Kolkata"
})

/*
	here the daily jobs are executed such as crypto description
	and other metadata.
*/
const fetchCryptoMetaDataJob = CronJob.from({
	cronTime: "0 0 * * *",
	name: "Crypto data fetcher",
	onTick: async () => {
		jobRuns.inc({ service: "data-manager", jobType: "crypto-metadata" })
		await cryptoOverviewTask()
	},
	start: false,
	timeZone: "Asia/Kolkata"
})

// trigger the job as the start parameter is set to false
fetchRealTimeDataJob.start()
fetchCryptoMetaDataJob.start()

// metrics endpoint
http.createServer(async (req, res) => {
	if (req.url === '/metrics') {
		res.writeHead(200, { 'Content-Type': register.contentType, 'access-control-allow-origin': '*', 'access-control-allow-methods': '*' })
		res.end(await register.metrics())
	}
}).listen(process.env.PORT)