import { AppState } from './../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { UserData } from '../../pages';


export type UserSliceState = {
  data: UserData | null
}


const initialState: UserSliceState = {
  data: null
}


export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) =>{
      state.data = action.payload
    }
  },

  extraReducers: (builder) => 
    builder.addCase( HYDRATE as any , (state, action: PayloadAction<AppState>) => {    
         state.data = action.payload.user.data
      })    
})


const userReducer = userSlice.reducer

export const {setUserData} = userSlice.actions
export default userReducer


