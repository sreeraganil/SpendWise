import axios from "axios";
import { store } from "../store/zustand";

const API = axios.create({
  baseURL: "https://spendwise-web.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  withCredentials: true,
});


API.interceptors.request.use(
  (config) => {
    const token = store.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const logout = store.getState().logoutUser;
      logout("Oops! Your session timed out. Please sign in again.");
    }
    return Promise.reject(error);
  }
);

export default API;
