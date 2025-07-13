import { type WebSocket, WebSocketServer } from 'ws'
import { Gauge, register } from 'prom-client'
import http from "http"
import { configDotenv } from 'dotenv'
import { EMsgType, IData } from './types.js'
import { connect } from './connect.js'

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
const websocketPort: number = Number(process.env.CRYPTO_MANAGER_SOCKET_PORT || 3002)

const wss: WebSocketServer = new WebSocketServer({ port: websocketPort })

wss.on("connection", (ws: WebSocket) => {

  liveConnections.inc({ service: "crypto-manager" })

  ws.on("error", (err) => {
    totalErrors.inc({ service: "crypto-manager" })
    console.warn(err)
  })

  ws.on("message", async (message: string) => {
    try {
      const data: IData = JSON.parse(message)
      console.log({ data })

      switch (data.msgType) {
        case EMsgType.CONNECT: {
          await connect()
          break
        }
        default: {
          throw new Error(`Invalid msgType! Received: ${data.msgType}`)
        }
      }
    } catch (error) {
      totalErrors.inc({ service: "crypto-manager" })
      console.warn(error)
    }
  })

  ws.on("close", () => {
    liveConnections.dec({ service: "crypto-manager" })
  })
})

const metricsPort: number = Number(process.env.CRYPTO_MANAGER_METRICS_PORT)

http.createServer(async (req, res) => {
  if (req.url === `/metrics`) {
    res.writeHead(200, { 'Content-Type': register.contentType, 'access-control-allow-origin': '*', 'access-control-allow-methods': '*' })
    res.end(await register.metrics())
  }
})
  .listen(metricsPort, () => {
    console.log(`Listening to port - ${metricsPort}`)
  })