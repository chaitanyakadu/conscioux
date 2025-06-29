import { Server, type Socket } from "socket.io"
import { Counter, register } from 'prom-client'
import http from "http"
import { Filter } from 'bad-words'

const io = new Server({})

io.on("connection", (socket: Socket) => {
  // socket.emit("Hari Bol")
  // socket.on("message", (msg) => {
  //   socket.emit(msg)
  //   console.log(msg)
  // })
})

io.listen(3000)