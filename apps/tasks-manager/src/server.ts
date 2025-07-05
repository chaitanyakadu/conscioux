import { CronJob } from "cron"
import { Redis } from "ioredis"
import { ITasksData, TasksInfo } from "./types.js"
import { handleTaskExecution } from "./handle-task-execution.js"

export const redis = new Redis()

export const tasksMap: Map<string, TasksInfo> = new Map<string, TasksInfo>()

// lets have 6 primary tasks

// users will have certain tasks connected
// we will push it into tasks map where key is task id and value is array of user metadata
async function handleDataCollection() {
  try {
    const value: string | null = await redis.rpop("tasks-executor")
    if (!value) throw new Error("The data was of type null")

    const data: ITasksData = JSON.parse(value)
    const tasksInfo: TasksInfo | null = tasksMap.get(data.taskId) || null

    if (!tasksInfo) {
      tasksMap.set(data.taskId, [{ userId: data.userId, timestamp: data.timestamp, taskId: data.taskId }])
    } else {
      tasksInfo.push({ userId: data.userId, timestamp: data.timestamp, taskId: data.taskId })
      tasksMap.set(data.taskId, tasksInfo)
    }
  } catch (error) {
    console.warn(error)
  }
}

// we have cron jobs that trigger every minute and runs all the tasks
// we will provide the tasks executor funtion the task and its id
// it will return the array of successfull task ids
const tasksExecutionJob = CronJob.from({
  name: "Collecting data from redis",
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
