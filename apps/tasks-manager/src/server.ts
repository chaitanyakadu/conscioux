import { CronJob } from "cron"
import { Redis } from "ioredis"
import { ITasksData, TasksInfo } from "./types.js"
import { handleTaskExecution } from "./handle-task-execution.js"
import http from "http"
import { Counter, register } from "prom-client"
import { configDotenv } from "dotenv"

configDotenv()

export const redis = new Redis()

// this variable stores the information about [task, userData]
export const tasksMap: Map<string, TasksInfo> = new Map<string, TasksInfo>()

const totalDataFetches = new Counter({
  name: "total_data_fetches",
  labelNames: ["service"],
  help: "Total number of times the data was received from redis(SUBSCRIBE CRYPTO-LATEST)."
})

// the function pulls the tasks data from redis using rpop
// later pass the array of tasks data to handle task execution function
async function handleDataCollection() {
  let listEmpty: boolean = false

  // the do while is a bogus approach
  // transition to rpop all
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

const port = process.env.TASK_MANAGER_PORT

http.createServer(async (req, res) => {
  if (req.url === "/metrics") {
    res.writeHead(200, { 'Content-Type': register.contentType, 'access-control-allow-origin': '*', 'access-control-allow-methods': '*' })
    res.end(await register.metrics())
  }
})
  .listen({ port }, () => console.log(`Listening to port ${port}`))