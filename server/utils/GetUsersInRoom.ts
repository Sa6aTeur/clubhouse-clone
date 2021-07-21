import { UserData } from "../../pages"

export const getUsersInRoom = (rooms: Record<string, {roomId: number, user: UserData}>, roomId: number) => 
  Object.values(rooms)
    .filter(obj => obj.roomId === roomId)
    .map(obj => ({ ...obj.user, roomId: Number(roomId)}))
