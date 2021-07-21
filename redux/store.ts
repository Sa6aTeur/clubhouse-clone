import { combineReducers, configureStore, Store } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { RoomsSliceState } from './slices(reducers)/roomsSlice';
import { UserSliceState } from './slices(reducers)/userSlice';
import roomsReducer from './slices(reducers)/roomsSlice'
import userReducer from './slices(reducers)/userSlice'


const rootReducer = combineReducers({
  rooms: roomsReducer,
  user: userReducer
})

export type AppState = {
  user: UserSliceState;
  rooms: RoomsSliceState;
};

export const makeStore = ():Store<AppState> => {
  const store: Store = configureStore({
    reducer: rootReducer,
  })
  return store
}

export const storeWrapper = createWrapper(makeStore,{debug: false})


