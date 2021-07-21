import Cookies from 'nookies';
import { GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { UserApi } from './UserApi';
import { RoomApi } from './RoomApi';

export const Api = (ctx: any) => {
  const cookies = Cookies.get(ctx)
  const token = cookies.token

    const instance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      Authorization: 'Bearer ' + token
    },
  });

  //instance.defaults.headers.Authorization = 'Bearer ' + token

  return{
    ...UserApi(instance),
    ...RoomApi(instance)
  }
}