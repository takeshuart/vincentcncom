// src/pages/AuthPage.tsx
import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Stack,
    Link as MuiLink,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormData {
    credential: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
}

interface FormErrors {
    credential?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    apiError?: string;
}

const AuthPage: React.FC = () => {
    const { login, register, user } = useAuth();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState<FormData>({ credential: "", password: "", confirmPassword: "", phone: "" });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined, apiError: undefined }));
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!formData.credential) {
            errors.credential = isLogin ? "邮箱或手机号必填" : "邮箱必填";
            isValid = false;
        } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.credential)) {
            errors.credential = "请输入有效邮箱";
            isValid = false;
        }

        if (!formData.password) {
            errors.password = "密码必填";
            isValid = false;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "两次密码不一致";
            isValid = false;
        }


        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        if (!validateForm()) return;

        setLoading(true);
        try {
            if (isLogin) {
                await login({ id: formData.credential, password: formData.password });
            } else {
                await register({ password: formData.password, email: formData.credential, phone: formData.phone });
            }
            navigate("/");
        } catch (err: any) {
            setFormErrors({ apiError: err.message || "操作失败" });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin((prev) => !prev);
        setFormData({ credential: "", password: "", confirmPassword: "", phone: "" });
        setFormErrors({});
    };
    const ART_BLUE = "#215A8F"; // 深普鲁士蓝 (主色)
    const HOVER_BLUE = "#17436B"; // 悬停加深色
    const ACTIVE_BLUE = "#0E2C48"; // 按下色
    const LIGHT_BACKGROUND = "#d8dbf0ff"; // 纯色背景
    return (
        <Container
            component="main"
            maxWidth={false}
            sx={{
                backgroundColor: LIGHT_BACKGROUND,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minHeight: "100vh",
                paddingTop: { xs: 4, sm: 8,md:25 },
                paddingBottom: { xs: 4, sm: 8, md: 8 },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    p: { xs: 3, sm: 5 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography component="h1" variant="h5" fontWeight={700} sx={{ mb: 1, color: ART_BLUE }}>
                    {isLogin ? "欢迎回来" : "创建新账户"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    {isLogin ? "登录后探索更多艺术品。" : "加入我们，体验梵高数字档案。"}
                </Typography>

                {formErrors.apiError && (
                    <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                        {formErrors.apiError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                    {/* Credential Field */}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="credential"
                        label={isLogin ? "邮箱" : "电子邮箱"}
                        name="credential"
                        autoComplete="username"
                        autoFocus
                        value={formData.credential}
                        onChange={handleChange}
                        error={!!formErrors.credential}
                        helperText={formErrors.credential}
                        disabled={loading}
                        size="medium"
                        sx={{ mb: 3 }}
                    />

                    {/* Password */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="密码"
                        type="password"
                        id="password"
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        disabled={loading}
                        size="small"
                        sx={{ mb: 2 }}
                    />

                    {/* Confirm Password (signup only) */}
                    {!isLogin && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="确认密码"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                            disabled={loading}
                            size="small"
                            sx={{ mb: 2 }}
                        />
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disableElevation // 保持扁平化设计
                        sx={{
                            mt: 2,
                            mb: 3,
                            py: 1.5,
                            backgroundColor: ART_BLUE,
                            color: 'white',
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: 'none',
                            transition: 'background-color 0.2s ease-out, box-shadow 0.2s ease-out, transform 0.2s ease-out',

                            '&:hover': {
                                backgroundColor: HOVER_BLUE,
                                // 微妙发光效果：抬升阴影 + 蓝色光晕
                                boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px 3px ${ART_BLUE}99`,
                                transform: 'translateY(-2px)',
                            },
                            '&:active': {
                                backgroundColor: ACTIVE_BLUE,
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2) inset',
                                transform: 'translateY(0)',
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? "登录" : "注册"}
                    </Button>
                </Box>

                {/* Toggle Link */}
                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {isLogin ? "没有账户？" : "已有账户？"}
                    </Typography>
                    <MuiLink
                        component="button"
                        variant="body2"
                        onClick={toggleMode}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                            ml: 0.5,
                            fontWeight: "bold",
                            color: ART_BLUE,
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        {isLogin ? "立即注册" : "返回登录"}
                    </MuiLink>
                </Stack>
            </Box>
        </Container>
    );
};

export default AuthPage;
