import axios from "./axios";
import type { User } from "../types/auth.types";

export const userAPI = {
	searchUsers: async (query: string): Promise<{ users: User[] }> => {
		const response = await axios.get(`/users/search?q=${query}`);
		return response.data;
	},
};
