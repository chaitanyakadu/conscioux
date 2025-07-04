import { room } from "./rooms.js"
import { IData } from "./types.js"
import { Filter } from "bad-words"

const filter = new Filter({ placeHolder: "*" })

export async function chats(data: IData) {
  const users = room.get(`room-[${data.cryptoId}]`)

  users?.forEach((user) => {
    user.send(filter.clean(data.data.chat))
  })
}