import React from 'react'
import { Api } from '../../api'
import BackButton from '../../components/BackButton/BackButton'
import { Header } from '../../components/Header'
import Profile from '../../components/profile'
import { Room } from '../../components/Room'
import { CheckAuth } from '../../helpers/CheckAuth'
import { storeWrapper } from '../../redux/store'


export default function roomPage({room}) {

  return (
    <div className="container">
        <Header/>
        <BackButton title="All rooms" href="/rooms" />
        <Room title={room.title}/> 
        
    </div>   
  )
}

export const getServerSideProps = storeWrapper.getServerSideProps(
  async (ctx) =>{        //Получение пропсов, которое выполняется на стороне сервера, 
    try {                                               //чтобы страница рендерилась без задержки 
      
      const roomId = ctx.query.id 
      const room = await Api(ctx).getRoom(roomId as string)
      
      const user = await CheckAuth(ctx)

      if(!user ){
        return {
          props: {},
          redirect: {
            destination: '/'        
          }
        }
      }

      return {
        props: {
          room
        }
      }  
  
    } catch (error) {
      return {
        props: {},
        redirect:{
          destination: '/rooms',
          permanent: false
        }
      } 
    }
  } 
)

