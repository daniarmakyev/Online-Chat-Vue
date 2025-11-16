import axios from "./axios";
import type {
	RegisterData,
	LoginData,
	AuthResponse,
} from "../types/auth.types";

export const authAPI = {
	register: async (data: RegisterData): Promise<AuthResponse> => {
		const response = await axios.post("/auth/register", data);
		return response.data;
	},

	login: async (data: LoginData): Promise<AuthResponse> => {
		const response = await axios.post("/auth/login", data);
		return response.data;
	},
};
