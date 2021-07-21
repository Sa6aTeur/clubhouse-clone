import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const useSocket = () => {
  
  const socketRef = React.useRef<Socket<DefaultEventsMap, DefaultEventsMap>>()

  if(!socketRef.current){
    socketRef.current = typeof window !== 'undefined' && io('http://localhost:3001')
  }else{
    socketRef.current.connect()
  }

  React.useEffect(() => {
    return () => {
      if(socketRef.current){
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}