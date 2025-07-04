import { WebSocket } from "ws";

export let room: Map<string, Array<WebSocket>> = new Map<string, Array<WebSocket>>()

export async function rooms({cryptoId, user}: {cryptoId: number, user: WebSocket}) {
  const users: Array<WebSocket> = room.get(`room-[${cryptoId}]`) || []

  users?.push(user)

  room.set(`room-[${cryptoId}]`, users)
}