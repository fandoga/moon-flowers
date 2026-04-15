import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  params: {
    token: "d0a91f097d80c5435254523852f8267fbf9560b4bedca02424e5b6066b6ff914",
  },
});

api.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.log("request error", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log("response error", error);
    return Promise.reject(error);
  }
);

export default api;