import express from 'express'
import { Axios } from '../../core/axios'
import {Room} from '../../models'

class RoomController{

  async index(req: express.Request ,res: express.Response){
    try {
      const items = await Room.findAll()
      res.json(items)
    } catch (error) {
      res.status(500).json({message: error})
    }
  }

  async create(req: express.Request ,res: express.Response){
    try {
      const data = {
        title: req.body.title,
        type: req.body.type
      }

      if(!data.title || !data.type){
        res.status(400).json({message: 'Ошибка в данных комнаты'})
      }

      const room = await Room.create(data)
      res.json(room)
      
    } catch (error) {
      res.status(500).json({message: error})
    }
  }

  async getOne(req: express.Request ,res: express.Response){
    try {
      
      const roomId = req.params.id

      if(isNaN(Number(roomId))){
        return res.status(404).json({message: "Неверный ID комнаты"})
      }

      const room = await Room.findByPk(roomId)

      if(!room){
        return res.status(404).json({message: "Комната не найдена"})
      }
      res.json(room)
      
    } catch (error) {
      res.status(500).json({message: error})
    }
  }

  async delete(req: express.Request ,res: express.Response){
    try {
      
      const roomId = req.params.id

      if(isNaN(Number(roomId))){
        return res.status(404).json({message: "Неверный ID комнаты"})
      }

      await Room.destroy({
        where: {
          id: roomId
        }
      })

      res.send()
    } catch (error) {
      res.status(500).json({message: error})
    }
  }
}

export default new RoomController()