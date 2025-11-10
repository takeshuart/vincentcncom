import { apiClient } from "./ArtworkApi";

export interface User {
    id: string;
    email?: string;
    phone?: string;
    nickname?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RegisterParams {
    password: string;
    email?: string;
    phone?: string;
}

export interface LoginParams {
    id: string; //email/phone
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    user?: T;
    error?: string;
}

export interface AuthResponse {
    user?: User;
    success: boolean;
    error?: string;
}

export async function registerApi(params: RegisterParams): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/user/register", params);
    if (!res.data.success || !res.data.user) {
        throw new Error(res.data.error || "Registration failed");
    }
    return res.data.user;
}

export async function loginApi(params: LoginParams) {
    const res = await apiClient.post<AuthResponse>("/user/login", params);
    if (!res.data.success || !res.data.user) {
        throw new Error(res.data.error || "Login failed");
    }
    return res.data;
}

export async function logoutApi() {
    const res = await apiClient.post<AuthResponse>("/user/logout");
    if (!res.data.success) {
        throw new Error(res.data.error || "Logout failed");
    }
    return res.data;
}

//It's me
export async function itsmeApi(){
    const res = await apiClient.post<AuthResponse>("/user/me");
    if (!res.data.success || !res.data.user) {
        throw new Error(res.data.error || "Login failed");
    }
    return res.data;
}