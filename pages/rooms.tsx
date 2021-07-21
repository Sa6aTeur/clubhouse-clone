import Link from "next/link"
import { Button } from "../components/Button"
import { ConversationCard } from "../components/ConversationCard"
import { Header } from "../components/Header"
import React, { useEffect } from 'react'
import { CheckAuth } from "../helpers/CheckAuth"
import { StartRoomModal } from "../components/StartRoomModal"
import { Api } from "../api"
import { GetServerSideProps, NextPage } from "next"
import { useDispatch, useSelector } from "react-redux"
import { selectRoom } from "../redux/selectors"
import { storeWrapper } from "../redux/store"
import { setRooms, updateRoomSpeakers } from "../redux/slices(reducers)/roomsSlice"
import { useSocket } from "../hooks/useSocket"



const RoomPage: NextPage = () => {

  const [visibleModal, setVisibleModal] = React.useState(false)
  const rooms = useSelector(selectRoom)
  const socket = useSocket()
  const dispatch = useDispatch()

  React.useEffect(() => {   
    if(typeof window !== 'undefined'){

      socket.on('SERVER@ROOM:HOME', ({roomId,speakers}) => {
        console.log(speakers)
        dispatch(updateRoomSpeakers({speakers, roomId}))
      })
    }
      
  }, [])

  return (
    <>
    
    <div className="container">
      <Header/>
      <div className=" mt-40 d-flex align-items-center justify-content-between">
        <h1>All conversations</h1>
        <Button onClick={()=>setVisibleModal(true)} color="green">+ Start room</Button>
      </div>
      { visibleModal && <StartRoomModal  onClose={()=>setVisibleModal(false)}/>  }
      <div className="grid mt-30">
        {rooms.map((obj,index) => (
          <Link key={obj.id}  href={`/rooms/${obj.id}`} >
          <a>
            <ConversationCard title={obj.title}
                              speakers={obj.speakers }
                              listenersCount={obj.listenersCount}  />
          </a>
        </Link>
        ))}         
      </div>
    </div>
   </>
  )
}



export const getServerSideProps: GetServerSideProps = storeWrapper.getServerSideProps(async (ctx) =>{ //Получение пропсов, которое выполняется на стороне сервера, 
  try {                                               //чтобы страница рендерилась без задержки (при переходе из комнаты в список всех комнат)

   

    const user = await CheckAuth(ctx)
    
    if(!user || !user.isActive){
      return {
        props: {},
        redirect: {
          destination: '/'        
        }
      }
    }
    const rooms = await Api(ctx).getAllRoom()
    ctx.store.dispatch(setRooms(rooms))
    return {
      props:{
        user: user,
        rooms: rooms
      }
    }  

  } catch (error) {
      return {
        props: {},
        redirect: {
          destination: '/'       
        }
      }
  }
} )


export default RoomPage;