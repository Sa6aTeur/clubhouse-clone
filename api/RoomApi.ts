import { AxiosInstance } from "axios";
import { UserData } from "../pages";



export type UserWithRoomId = UserData & {roomId: number}

export interface Room {
  id: number,
  title: string,
  speakers: any,
  listenersCount: number, 
}

export type RoomType= 'open' | 'social' | 'closed'


export const RoomApi = ( instance: AxiosInstance) =>{
  return {
    getAllRoom: async(): Promise<Room[]> =>{
      const {data} = await instance.get('/rooms')
      return data
    },

    getRoom: async(id: string): Promise<Room> =>{
      const {data} = await instance.get(`/rooms/${id}`)
      return data
    },

    createRoom: async(form:{title: string, type: RoomType}): Promise<Room> =>{
      const {data} = await instance.post(`/rooms`,form)
      return data
    },

    deleteRoom: async(id: number): Promise<void> => await instance.delete(`/rooms/${id}`)
    
  }
} 