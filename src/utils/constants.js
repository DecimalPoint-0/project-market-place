import useUserData from "../plugin/useUserData";

export const API_BASE_URL = "https://project-market-place-backend.onrender.com/api/v1/";
export const SERVER_URL = "https://project-market-place-backend.onrender.com";
export const CLIENT_URL = "http://localhost:5173";
export const PAYPAL_CLIENT_ID = "test";
export const CURRENCY_SIGN = "$";
export const userId = useUserData()?.id;