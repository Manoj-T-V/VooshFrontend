import axios from 'axios';

const api = axios.create({
  baseURL: 'https://expressmongo-theta.vercel.app/api',
  withCredentials: true, // To send cookies with requests
});

export default api;
