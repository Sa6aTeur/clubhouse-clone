import { UserData } from "../pages";

declare global {
  namespace Express {
    export interface User extends UserData{
      
    }
  }
}
