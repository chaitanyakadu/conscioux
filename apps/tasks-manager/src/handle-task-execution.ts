import { handleTrigger } from "./handle-trigger.js"
import { tasksMap } from "./server.js"
import { ICryptoLatest } from "./types.js"
// @ts-ignore
import safeEval from "safe-eval"
import { Redis } from "ioredis"
import { Counter } from "prom-client"
import Pako from "pako"

const totalTaskExecutions = new Counter({
  name: "total_task_executions",
  labelNames: ["service"],
  help: "Total number of times the task was executed."
})

const redis = new Redis()

export async function handleTaskExecution() {
  try {
    const cryptoId: number = 1
    await redis.subscribe(`crypto-latest-[${cryptoId}]`)

    redis.on("message", (_, compressedMsg) => {
      if (!compressedMsg) throw new Error("Message is of type null")

      const compressedBuffer = Buffer.from(compressedMsg, "base64")
      const message = Pako.inflate(compressedBuffer, { to: "string" })
      const { pr, pc_1h, pc_24h, pc_7d, mc, tv_24h, vc_24h, cs, tm_s }: ICryptoLatest = JSON.parse(message)
      const tasks: string[] = [...tasksMap.keys()]

      const result: string[] = tasks.filter((task: string) => {
        totalTaskExecutions.inc({ service: "tasks-manager" })

        // the code is invalid
        // we need to make sure is LHS == RHS then return true else false
        safeEval(task) // danger. Implementation is unsafe. We need to implement a function for strict checking of input
        // for example the input must have only above characters also the time execution must take at max 1 sec or exclude
      })

      handleTrigger(result)
    })
  } catch (error) {
    console.warn(error)
  }
}