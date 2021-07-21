import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { WhiteBlock } from '../../WhiteBlock';
import { StepInfo } from '../../StepInfo';
import { Axios } from '../../../core/axios';

import styles from './EnterPhoneStep.module.scss';
import { MainContext } from '../../../pages';
import { GetServerSideProps } from 'next';
import { storeWrapper } from '../../../redux/store';
import { CheckAuth } from '../../../helpers/CheckAuth';



export const EnterCodeStep: React.FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [codes, setCodes] = React.useState(['', '', '', '']);
  const {userData} = React.useContext(MainContext)

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.getAttribute('id'));
    const value = event.target.value;

    setCodes((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
    if (event.target.nextSibling) {
      (event.target.nextSibling as HTMLInputElement).focus();
    } else{
      onSubmit([...codes, value].join(''))
    }
  }
    
    const onSubmit = async (code: string) => {
      try{
        setIsLoading(true);    
        await Axios.post(`/auth/sms/activate`,{
          code, 
          user: userData
        })
        setIsLoading(false);  
        router.push('/rooms')
      } catch (error) {
        setCodes(['', '', '', ''])
        alert('Ошибка при активации')
      }
      setIsLoading(false);
    }

  
  
  return (
    <div className={styles.block}>
      {!isLoading ? (
        <>
          <StepInfo icon="/static/numbers.png" title="Enter your activate code" />
          <WhiteBlock className={clsx('m-auto mt-30', styles.whiteBlock)}>
            <div className={styles.codeInput}>
              {codes.map((code, index) => (
                <input
                  className={'mb-30'}
                  key={index}
                  type="tel"
                  placeholder="X"
                  maxLength={1}
                  id={String(index)}
                  onChange={handleChangeInput}
                  value={code}
                />
              ))}     
            </div>

          </WhiteBlock>
        </>
      ) : (
        <div className="text-center">
          <div className="loader"></div>
          <h3 className="mt-5">Activation in progress ...</h3>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = storeWrapper.getServerSideProps(async (ctx) =>{ //Получение пропсов, которое выполняется на стороне сервера, 
  try {

    const user = await CheckAuth(ctx)
    
    if(user && user.isActive){
      return {
        props: {},
        redirect: {
          destination: '/rooms'        
        }
      }
    }
    
    return {
      props:{}
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