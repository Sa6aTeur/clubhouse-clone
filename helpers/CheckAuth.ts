import { Api } from "../api"
import { UserData } from "../pages"
import { setUserData } from "../redux/slices(reducers)/userSlice"


export const CheckAuth = async (ctx: any): Promise<UserData | null> =>{
  
  try {
        
    const user = await Api(ctx).getMe()
    ctx.store.dispatch(setUserData(user))

    return user
  } catch (error) {
    return null
  }
} 