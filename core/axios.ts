import axios from 'axios';
import Cookies from 'js-cookie';
import { parseCookies } from 'nookies';

const nookies = parseCookies();



const Axios = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    Authorization: 'Bearer ' + nookies.token 
  },
});

export { Axios };
