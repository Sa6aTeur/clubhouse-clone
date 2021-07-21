import { AppState } from './../store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { Room, RoomApi, RoomType, UserWithRoomId } from '../../api/RoomApi'
import { Axios } from '../../core/axios'
import { UserData } from '../../pages';




export type RoomsSliceState = {
  items: Room[]
}

type CreateRoomPayload = {
  title: string
  type: RoomType
}


const initialState: RoomsSliceState = {
  items: []
}

////////// Async Thunks
export const fetchCreateRoom = createAsyncThunk<Room, CreateRoomPayload >(
  'rooms/fetchCreateRoomStatus',
  async ({title, type}, thunkAPI) => {
    try {
      const room =  await RoomApi(Axios).createRoom({title, type})
      return room
    } catch (error) {
      throw Error('Ошибка при создании комнаты')
    }
  }
)



export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,

  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) =>{
      state.items = action.payload
    },
    updateRoomSpeakers: (state, action: PayloadAction<{speakers: Room['speakers'], roomId: number}>) =>{
      state.items = state.items.map( room => {
        if(room.id === action.payload.roomId){
          room.speakers = action.payload.speakers
        }
        return room
      })
    }
  },

  extraReducers: (builder) => 
    builder
      .addCase( fetchCreateRoom.fulfilled.type, (state, action: PayloadAction<Room>) => {    
        state.items.push(action.payload)
      })
      .addCase( fetchCreateRoom.rejected.type, (_, action) => {    
        console.log(action)
      })
      .addCase( HYDRATE as any , (state, action: PayloadAction<AppState>) => {    
         state.items = action.payload.rooms.items
      })    
})


const roomsReducer = roomsSlice.reducer

export const {setRooms, updateRoomSpeakers} = roomsSlice.actions
export default roomsReducer


