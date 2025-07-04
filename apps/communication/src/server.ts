import { type WebSocket, WebSocketServer } from 'ws'
import { Counter, Gauge, register } from 'prom-client'
import http from "http"
import { configDotenv } from 'dotenv'
import { EMsgType, IData } from './types.js'
import { chats } from './chats.js'
import { rooms } from './rooms.js'

const liveConnections = new Gauge({
  name: "total_live_connections",
  labelNames: ["service"],
  help: "Total number of live connections"
})

const totalErrors = new Gauge({
  name: "total_error_count",
  labelNames: ["service"],
  help: "Total number of error occured"
})

configDotenv()
const port: number = Number(process.env.COMMUNICATION_WS_PORT || 3000)

const wss: WebSocketServer = new WebSocketServer({ port })

wss.on("connection", async (ws: WebSocket) => {

  liveConnections.inc({ service: "communication" })

  ws.on("error", (err) => {
    totalErrors.inc({ service: "communication" })
    console.warn(err)
  })

  ws.on("message", async (message: string) => {
    try {
      const data: IData = JSON.parse(message)
      console.log({ data })

      switch (data.msgType) {
        case EMsgType.CHAT: {
          await chats(data)
          break
        }
        case EMsgType.CONNECT: {
          await rooms({ cryptoId: data.cryptoId, user: ws })
          break
        }
        default: {
          throw new Error(`Invalid msgType! Received: ${data.msgType}`)
        }
      }
    } catch (error) {
      totalErrors.inc({ service: "communication" })
      console.warn(error)
    }
  })

  ws.on("close", () => {
    liveConnections.dec({ service: "communication" })
  })
})

const metricsPort: number = Number(process.env.COMMUNICATION_METRICS_PORT)

http.createServer(async (req, res) => {
  if (req.url === `/metrics`) {
    res.writeHead(200, { 'Content-Type': register.contentType, 'access-control-allow-origin': '*', 'access-control-allow-methods': '*' })
    res.end(await register.metrics())
  }
})
  .listen(metricsPort, () => {
    console.log(`Listening to port - ${metricsPort}`)
  })