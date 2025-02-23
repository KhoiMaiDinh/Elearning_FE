"use client";
import axios from "axios";
// import { request } from "http";
// import { config } from "process";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
