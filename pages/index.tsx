import styles from '../styles/Home.module.css'
import { WelcomeStep } from '../components/steps/WelcomeStep'
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep'
import { EnterNameStep } from '../components/steps/EnterNameStep'
import { EnterCodeStep } from '../components/steps/EnterCodeStep'
import { GitHubStep } from '../components/steps/GitHubStep'
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep'
import React, { SetStateAction } from 'react'
import { useRouter } from 'next/router';
import { CheckAuth } from '../helpers/CheckAuth'
import { Api } from '../api'
import { Axios } from '../core/axios'

const StepsComponents ={
  0: WelcomeStep,
  1: GitHubStep,
  2: EnterNameStep, 
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
  
}


export const MainContext = React.createContext<MainContextProps>({} as MainContextProps)


const getUserData = (): UserData | null => {
  try {
    return JSON.parse(window.localStorage.getItem('userData'))  
  } catch (err) {
    return null
  }
}


const getFormStep = (router ): number =>{
  const json: UserData = getUserData()
  if(json){
    if(json.isActive){
      router.push('/rooms')
    }
    if(json.phone){
      return 5
    }else {
      return 4
    }
  }
  return 0
}


export default function Home() {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0)
  const [userData, setUserData] = React.useState<UserData | undefined>()
  const Step = StepsComponents[step]

  const onNextStep = () =>{
    setStep((prev) => prev + 1)
  }

  const setFieldValue = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    })) 
  }

  ////////////////////////////Сразу проверяет на какой шаг переключить пользователя
  React.useEffect(() => {  
    if(typeof window != 'undefined'){
      
      const json = getUserData()
      if(json){
        setUserData(json)
        setStep( getFormStep(router) )
      }
    }   
  },[])
  /////////////////////////

  React.useEffect(() => {  
    window.localStorage.setItem('userData', userData ? JSON.stringify(userData): '')
    Axios.defaults.headers.Authorization = 'Bearer ' + userData?.token
  },[userData])

  return (
    <div className={styles.container}>
     <MainContext.Provider value={{step, onNextStep,userData,setUserData,setFieldValue}}>
      <Step/> 
     </MainContext.Provider>
    </div>
  )
}

export const getServerSideProps = async (ctx) =>{ 

  try {
    const user = await CheckAuth(ctx)
    
    if(user && user.phone){
      return{
        props:{},
        redirect:{
          destination: '/rooms',
          permanent: false
        }
      }
    }

    return{
      props:{}
    }
  } catch (error) {
    return{
      props:{}
    }
  }
}

////Types
export type UserData = {
  id: number,
  fullname: string,
  avatarUrl: string,
  isActive: number,
  username: string,
  phone: string,
  token?: string
}

type MainContextProps = {
  onNextStep: () => void
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
  setFieldValue: (field: keyof UserData, value: string) =>void
  userData?: UserData
  step: number
}