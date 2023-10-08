import axios from 'axios';
import mainUrl from '../constants/mainUrl';

const api = '/api/v1'

const fetchAPI = axios.create({
    baseURL: mainUrl + api
})

export default fetchAPI;