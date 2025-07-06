import { tasksMap } from "./server.js"
import { TasksInfo } from "./types.js"
// @ts-ignore
import prisma from "../../../packages/postgres-db/dist/prisma.js"
import { Counter } from "prom-client"

const totalTriggerRegistered = new Counter({
  name: "total_trigger_registered",
  labelNames: ["service"],
  help: "Total number of times the trigger was registered."
})

export function handleTrigger(tasks: string[]) {
  try {
    tasks.forEach((formula) => {
      const usersList: TasksInfo | null = tasksMap.get(formula) || null

      if (usersList) {
        usersList.forEach(async (userData) => {
          const { timestamp, sessionId } = userData
          const information: string = "Congratulations! The event is triggered!"

          const userId = await prisma.session.find({
            where: {
              sessionId
            }
          })

          if (!userId) throw new Error("Found no user for provided session id.")

          await prisma.notification.create({
            data: {
              userId,
              timestamp,
              information
            }
          })

          totalTriggerRegistered.inc({service: "task manager"})
        })
      }
    })
  } catch (error) {
    console.warn(error)
  }
}