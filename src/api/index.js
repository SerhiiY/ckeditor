import axios from 'axios';

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
  'Access-Control-Allow-Origin': '*',
};

export const baseURL = window.location.origin;

const api = axios.create({
  baseURL,
  headers,
  responseType: 'json',
})

export default api;
