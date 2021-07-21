import React from 'react'
import { UserData } from '..'
import { Api } from '../../api'
import { Header } from '../../components/Header'
import Profile from '../../components/profile'
import { CheckAuth } from '../../helpers/CheckAuth'
import { storeWrapper } from '../../redux/store'

export const  profile: React.FC<{profileData: UserData}> = ({profileData}) => {

  return (
    <div className="container">
      <Header/>
      <div className="mt-40">
        <Profile fullname={profileData.fullname} 
                username={profileData.username}
                avatarUrl={profileData.avatarUrl}
                about="My status or message :)"/>
      </div>
    </div>
  )
}

export default profile


export const getServerSideProps = storeWrapper.getServerSideProps( async (ctx) =>{
  try {
    const user = await CheckAuth(ctx)

      if(!user ){
        return {
          props: {},
          redirect: {
            permanent: false,
            destination: '/'        
          }
        }
      }
      
    const userId = ctx.query.id 
    const profileData = await Api(ctx).getUserInfo(Number(userId))
    
    return {
      props: {profileData},     
    }

  } catch (error) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: '/'        
      }
    }
  }
})
