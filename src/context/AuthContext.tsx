import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi, LoginParams, RegisterParams, logoutApi, itsmeApi } from "@/api/AuthApi";
import type { User, AuthResponse } from "@/api/AuthApi";

// ------------------ 类型定义 ------------------

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (params: LoginParams) => Promise<AuthResponse>;
    register: (params: RegisterParams) => Promise<AuthResponse>;
    logout: () => void;
}

// ------------------ Context 初始化 ------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ------------------ Provider 实现 ------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

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
                const res = await itsmeApi()
                setUser(res.user ?? null);
            } catch {
                setUser(null)
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("auth_user");
            }
        }
    }, []);

    // ------------------ Mutation 定义 ------------------

    const loginMutation = useMutation({
        mutationFn: async (params: LoginParams): Promise<AuthResponse> => loginApi(params),
        onSuccess: (res) => {
            if (res?.user) {
                setUser(res.user);
            }
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (params: RegisterParams): Promise<AuthResponse> => registerApi(params),
        onSuccess: (res) => {
            if (res?.user) {
                setUser(res.user);
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
            token,
            isLoading: loginMutation.isPending || registerMutation.isPending,
            login: async (params: LoginParams) => loginMutation.mutateAsync(params),
            register: async (params: RegisterParams) => registerMutation.mutateAsync(params),
            logout: () => logoutMutation.mutateAsync(),
        }),
        [user, token, loginMutation.isPending, registerMutation.isPending]
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
