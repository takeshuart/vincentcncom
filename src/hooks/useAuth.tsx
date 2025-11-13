import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi, LoginParams, RegisterParams, logoutApi, itsmeApi } from "@/api/AuthApi";
import type { User, AuthResponse } from "@/api/AuthApi";

// ------------------ 类型定义 ------------------

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (params: LoginParams) => Promise<User>;
    register: (params: RegisterParams) => Promise<User>;
    logout: () => void;
}

// ------------------ Context 初始化 ------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    /**
     * Fetch the current authenticated user's profile on component mount.
     *
     * This is used to restore the front-end user state after a page refresh,
     * because React's in-memory state (e.g., useState) is reset when the page reloads.
     * With this approach, the front-end authentication state stays consistent.
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await itsmeApi()
                setUser(user);
            } catch {
                setUser(null)
            }
        }
        fetchUser();
    }, []);

    // ------------------ Mutation 定义 ------------------

    const loginMutation = useMutation<User, any, LoginParams>({
        mutationFn: async (params)=> loginApi(params),
        onSuccess: (user) => {
            if (user) {
                setUser(user);
            }
        },
    });

    const registerMutation = useMutation<User,any,RegisterParams>({
        mutationFn: async (params) => registerApi(params),
        onSuccess: (user) => {
            if (user) {
                setUser(user);
            }
        },
    });

    // ------------------ Logout ------------------

    const logoutMutation = useMutation({
        mutationFn: async () => logoutApi(),
        onSuccess: (res) => {
            setUser(null);
        }
    })
    // ------------------ Context Value ------------------

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            isLoading: loginMutation.isPending || registerMutation.isPending,
            login: async (params: LoginParams) => await loginMutation.mutateAsync(params),
            register: async (params: RegisterParams) => registerMutation.mutateAsync(params),
            logout: () => logoutMutation.mutateAsync(),
        }),
        [user, loginMutation.isPending, registerMutation.isPending]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ------------------ Hook 导出 ------------------

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth 必须在 <AuthProvider> 内使用");
    }
    return context;
};
