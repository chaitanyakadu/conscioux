import { CronJob } from "cron"
import { Redis } from "ioredis"
import { ITasksData, TasksInfo } from "./types.js"
import { handleTaskExecution } from "./handle-task-execution.js"
import http from "http"
import { Counter, register } from "prom-client"
import { configDotenv } from "dotenv"

configDotenv()

export const redis = new Redis()

export const tasksMap: Map<string, TasksInfo> = new Map<string, TasksInfo>()

const totalDataFetches = new Counter({
  name: "total_data_fetches",
  labelNames: ["service"],
  help: "Total number of times the data was received from redis(SUBSCRIBE CRYPTO-LATEST)."
})

// lets have 6 primary tasks

// users will have certain tasks connected
// we will push it into tasks map where key is task id and value is array of user metadata
async function handleDataCollection() {
  let listEmpty: boolean = false

  do {
    try {
      const value: string | null = await redis.rpop("tasks-executor")
      if (!value) {
        listEmpty = true
        throw new Error("The data was of type null")
      }

      const data: ITasksData = JSON.parse(value)
      const tasksInfo: TasksInfo | null = tasksMap.get(data.sessionId) || null

      if (!tasksInfo) {
        tasksMap.set(data.sessionId, [{ sessionId: data.sessionId, timestamp: data.timestamp }])
      } else {
        tasksInfo.push({ sessionId: data.sessionId, timestamp: data.timestamp })
        tasksMap.set(data.sessionId, tasksInfo)
      }
    } catch (error) {
      console.warn(error)
    }
  } while (!listEmpty)
}

// we have cron jobs that trigger every minute and runs all the tasks
// we will provide the tasks executor funtion the task and its id
// it will return the array of successfull task ids
const tasksExecutionJob = CronJob.from({
  name: "Executing tasks",
  onTick: async () => {
    await handleTaskExecution()
  },
  cronTime: "* * * * *",
  timeZone: "Asia/Kolkata",
  start: false,
  onComplete: () => { }
})

const dataCollectionJob = CronJob.from({
  name: "Collecting data from redis",
  onTick: async () => {
    totalDataFetches.inc({ service: "tasks-manager" })
    await handleDataCollection()
  },
  cronTime: "* * * * *",
  timeZone: "Asia/Kolkata",
  start: false,
  onComplete: () => { }
})

tasksExecutionJob.start()
dataCollectionJob.start()

// this task id can be used by the trigger handler function to take user id and pull the user gmail to send mail

const port = process.env.TASK_MANAGER_PORT

http.createServer(async (req, res) => {
  if (req.url === "/metrics") {
    res.writeHead(200, { 'Content-Type': register.contentType, 'access-control-allow-origin': '*', 'access-control-allow-methods': '*' })
    res.end(await register.metrics())
  }
})
  .listen({ port }, () => console.log(`Listening to port ${port}`))