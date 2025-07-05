import { handleTrigger } from "./handle-trigger.js"
import { redis, tasksMap } from "./server.js"
import { ICryptoLatest, TasksInfo } from "./types.js"
// @ts-ignore
import safeEval from "safe-eval"

export async function handleTaskExecution() {
  const cryptoId: number = 1
  await redis.subscribe(`crypto-latest-[${cryptoId}]`)

  await redis.on("message", (message) => {
    if (!message) throw new Error("Message is of type null")

    const { pr, pc_1h, pc_24h, pc_7d, mc, tv_24h, vc_24h, cs, tm_s }: ICryptoLatest = JSON.parse(message)
    const tasks: string[] = [...tasksMap.keys()]

    const result: string[] = tasks.filter((task: string) => {
      safeEval(task)
    })

    handleTrigger(result)
  })
}