
import express from 'express'
import dotenv from 'dotenv'
import sharp from 'sharp'
import fs from 'fs'
dotenv.config({
  path: './server/.env'
})
import './core/db'
import {passport} from './core/passport'
import cors from 'cors'
import { uploader } from './core/uploader';
import socket from 'socket.io'
import  AuthController  from './controllers/AuthController';
import  RoomController  from './controllers/RoomController';
import {createServer} from 'http'
import { Room } from '../models'
import { getUsersInRoom } from './utils/GetUsersInRoom'



const app = express()
const server = createServer(app)
const io = socket(server, {
  cors: {
    origin: '*'
  }
})


////////////////////////////////Join To Room
const rooms: Record<string, any> = {}

io.on('connection', (socket) => {
  socket.on('CLIENT@ROOM:JOIN', ({ user, roomId }) => {
    socket.join(`room/${roomId}`);
    rooms[socket.id] = { roomId, user };
    const speakers = getUsersInRoom(rooms, roomId);
    io.emit('SERVER@ROOM:HOME',{roomId: Number(roomId), speakers});
    io.in(`room/${roomId}`).emit('SERVER@ROOM:JOIN', speakers);   
    Room.update({ speakers }, { where: { id: roomId } });
  });

  ////Web RTC Audio Call
  socket.on('CLIENT@ROOM:CALL', ({targetUserId, callerUserId, roomId, signal }) => {
    socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOM:CALL', {
      targetUserId, 
      callerUserId, 
      signal});
  });

  socket.on('CLIENT@ROOM:ANSWER', ({ targetUserId, callerUserId, roomId, signal }) => {
    socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOM:ANSWER', {
      targetUserId, 
      callerUserId, 
      signal});
  });

  socket.on('disconnect', ()=> {
    if (rooms[socket.id]) {
      const { roomId, user } = rooms[socket.id];
      socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOM:LEAVE', user);
      delete rooms[socket.id];
      const speakers = getUsersInRoom(rooms, roomId);
      io.emit('SERVER@ROOM:HOME', {roomId: Number(roomId), speakers})
      Room.update({ speakers }, { where: { id: roomId } })        
    }
  })
})




app.use(passport.initialize())
app.use(cors())
app.use(express.json())


///Upload AvatarPhoto
app.post('/upload',
  uploader.single('photo'),
  (req,res)=>{
    const filePath = req.file.path
    sharp(filePath)
      .resize(150,150)
      .toFormat('jpeg')
      .toFile(filePath.replace('.png','.jpeg'), (err)=>{
        if(err){
          throw err
        }
        fs.unlinkSync(filePath)
        res.json({
          url: `avatars/${req.file.filename.replace('.png','.jpeg')}`
        })
    })
  }
)


app.get('/rooms',passport.authenticate('jwt', { session: false }),RoomController.index);
app.post('/rooms',passport.authenticate('jwt', { session: false }),RoomController.create)
app.get('/rooms/:id',passport.authenticate('jwt', { session: false }),RoomController.getOne);
app.delete('/rooms/:id',passport.authenticate('jwt', { session: false }),RoomController.delete);


app.get('/user/:id', passport.authenticate('jwt', { session: false }), AuthController.getUserInfo);
app.get('/auth/me', passport.authenticate('jwt', { session: false }), AuthController.getMe);
///////GitHub Auth
app.get('/auth/github',passport.authenticate('github'));
//////sms code
app.post('/auth/sms/activate',passport.authenticate('jwt', { session: true }), AuthController.activate );
app.get('/auth/sms',passport.authenticate('jwt', { session: false }), AuthController.sendSMS );

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), AuthController.authCallback ); 


server.listen(3001, () => {
 
  console.log('Server runned!')
})


