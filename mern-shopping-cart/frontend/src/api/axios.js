import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

API.interceptors.request.use(
  (req) => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);

      if (parsedUser.token) {
        req.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;