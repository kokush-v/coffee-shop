import axios from "axios";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
	baseURL: `${BACKEND_URL}/api`,
});
