import express from 'express'
import { Axios } from '../../core/axios'
import {Code, User} from '../../models'

class AuthController{

  getMe(req: express.Request ,res: express.Response){
    res.json(req.user)
  }


  authCallback(req, res) {
    res.send(`<script>window.opener.postMessage('${JSON.stringify(
      req.user,
      )}','*'); window.close(); </script>`)
  }


  async activate(req,res) {
    const userId = req.user.id
    const smsCode = req.body.code
    const user = req.body.user

    if(!smsCode){
     return res.status(400).send({message: 'введите код активации'})
    }
    const whereQuery = { code: smsCode, user_id: userId}
    
    try {
  
      const findCode = await Code.findOne({
        where:whereQuery
      })
  
      if(findCode){
        await Code.destroy({
          where: whereQuery
        })
        await User.update({ ...user, isActive: 1},{
          where: {
            id: userId
          }
        })

        res.status(201).send()
      }else{
        throw Error("Код не найден")
      }
      
    } catch (error) {
      res.status(500).json({
        message: 'Ошибка при активации аккаунта'
      })
    }
  }


  async getUserInfo(req,res) {
    const userId = req.params.id

    
    try {
  
      const findUser = await User.findByPk(userId)
  
      if(findUser){
        res.json(await findUser.dataValues)
      }else{
        throw Error("Пользователь не найден")
      }
      
    } catch (error) {
      res.status(500).json({
        message: 'Ошибка при получении информации пользователя'
      })
    }
  }

  
  async sendSMS(req,res){
    const phone = req.query.phone
    const userId = req.user.id
    const smsCode = 1234/////Math.floor(Math.random() * (10000 - 1111)) + 1111

    if(!phone){
     return res.status(400).send({message: 'номер телефона не указан'})
    }

    try {
      
      //await Axios.get(`https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=${phone}&msg=${smsCode}`)

      const findCode = await Code.findOne({
        where:{user_id: userId}
      })
      if(findCode){
        return res.status(400).json({message: 'Код уже отправлен'})
      }

      await Code.create({
        code: smsCode, 
        user_id: userId
      }) 

      return res.status(200).json()

    } catch (error) {
      return res.status(500).json({
        message: 'Ошибка при отправке смс кода'
      })
    }
  }

}

export default new AuthController()