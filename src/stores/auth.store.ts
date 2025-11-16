import { defineStore } from "pinia";
import { ref } from "vue";
import { authAPI } from "../api/auth.api";
import type { User, RegisterData, LoginData } from "../types/auth.types";
import socketService from "../socket/socket";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<User | null>(null);
	const token = ref<string | null>(localStorage.getItem("token"));
	const isAuthenticated = ref<boolean>(!!token.value);
	const loading = ref<boolean>(false);
	const error = ref<string | null>(null);

	const register = async (data: RegisterData) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await authAPI.register(data);
			token.value = response.token;
			user.value = response.user;
			isAuthenticated.value = true;
			localStorage.setItem("token", response.token);

			socketService.connect(response.token);
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant register, try later";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const login = async (data: LoginData) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await authAPI.login(data);
			token.value = response.token;
			user.value = response.user;
			isAuthenticated.value = true;
			localStorage.setItem("token", response.token);

			socketService.connect(response.token);
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant login, try later";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const logout = () => {
		token.value = null;
		user.value = null;
		isAuthenticated.value = false;
		localStorage.removeItem("token");
		socketService.disconnect();
	};

	const initAuth = () => {
		const savedToken = localStorage.getItem("token");
		if (savedToken) {
			token.value = savedToken;
			isAuthenticated.value = true;

			try {
				const decoded: any = parseJwt(savedToken);
				user.value = {
					_id: decoded.id,
					username: decoded.username || "",
					email: decoded.email || "",
				};
			} catch {
				error.value = "Bad token";
				logout();
				return;
			}

			socketService.connect(savedToken);
		}
	};

	const parseJwt = (token: string) => {
		try {
			const base64Url = token.split(".")[1];
			const base64 = base64Url!.replace(/-/g, "+").replace(/_/g, "/");
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split("")
					.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
					.join(""),
			);
			return JSON.parse(jsonPayload);
		} catch (error) {
			throw new Error("Bad token");
		}
	};

	return {
		user,
		token,
		isAuthenticated,
		loading,
		error,
		register,
		login,
		logout,
		initAuth,
	};
});
