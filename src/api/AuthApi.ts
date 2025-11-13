import { SuccessResponse } from '@/types/api';
import apiV1 from './requests';

export interface User {
    userId: string;
    email?: string;
    phone?: string;
    nickName?: string;
    registeredAt?: string;
    updateAt?: string;
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
    error?: any;
}

export interface AuthResponse {
    user?: User;
    success: boolean;
    error?: any;
}

export async function registerApi(params: RegisterParams): Promise<User> {
    const res = await apiV1.post<SuccessResponse<User>>("/users/register", params);
    return res.data.data;
}


export async function loginApi(params: LoginParams):Promise<User> {
    const res = await apiV1.post<SuccessResponse<User>>("/users/login", params);
    return res.data.data;
}

export async function logoutApi() {
    const res = await apiV1.post<SuccessResponse<any>>("/users/logout");

    return res.data.data;
}

//It's me
export async function itsmeApi() :Promise<User>{
    const res = await apiV1.get<SuccessResponse<User>>("/users/me");

    return res.data.data;
}