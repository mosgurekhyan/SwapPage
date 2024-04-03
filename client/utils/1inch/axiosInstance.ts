import axios, { AxiosError } from "axios";

const axios1Inch = axios.create({
  baseURL: 'http://localhost:3001',
  // baseURL: process.env.REACT_APP_1INCH_PROXY_URL || "",
  headers: {
    Authorization: `Bearer M83342jVvL0b8O98epadow1VlSiEN20Z`,
    // Authorization: `Bearer ${process.env.REACT_APP_API_KEY_1INCH}`,
    accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axios1Inch.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 429) {
      // If status code is 429, wait for 1 second and retry the request
      if (!error.config) return;
      
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 ms = 1 second
      return axios1Inch.request(error.config); // Retry the request
    }
    return Promise.reject(error);
  }
);

export default axios1Inch;
