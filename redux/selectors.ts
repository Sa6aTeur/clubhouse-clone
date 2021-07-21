import { AppState } from "./store";

export const selectRoom = (state: AppState) => state.rooms.items

export const selectUser = (state: AppState) => state.user.data