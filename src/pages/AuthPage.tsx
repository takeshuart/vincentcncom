import React, { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Stack, Link as MuiLink } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import validator from "validator";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ERROR_MESSAGES } from "@/utils/errors";
import ValidatePasswordField from "@/components/PasswordField";

interface FormData {
    credential: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
}

const ART_BLUE = "#215A8F"; // 深普鲁士蓝 (主色)
const HOVER_BLUE = "#17436B"; // 悬停加深色
const ACTIVE_BLUE = "#0E2C48"; // 按下色
const LIGHT_BACKGROUND = "#d8dbf0ff"; // 纯色背景

const AuthPage: React.FC = () => {
    const { login, register, user } = useAuth();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | undefined>(undefined);


    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<FormData>({
        mode: "onChange",
        defaultValues: {
            credential: "", password: "", confirmPassword: "", phone: ""
        }
    });

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setApiError(undefined);
        setLoading(true);

        try {
            if (isLogin) {
                await login({ id: data.credential, password: data.password });
            } else {
                await register({ password: data.password, email: data.credential, phone: data.phone });
            }
            navigate("/");
        } catch (err: any) {
            const code = err.response?.data?.errorCode;
            const msg = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin((prev) => !prev);
        setApiError(undefined);
        reset();
    };

    return (
        <Container
            component="main"
            maxWidth={false}
            sx={{
                backgroundColor: LIGHT_BACKGROUND,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                py: { xs: 8, sm: 8, md: 25 },
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
                <Typography component="h1" fontWeight={700}
                    fontSize={{ xs: 18, sm: 26, md: 28 }}
                    sx={{ mb: 1, color: ART_BLUE }}>
                    {isLogin ? "欢迎回来" : "创建新账户"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, md: 4 } }}>
                    {isLogin ? "登录后探索更多艺术品。" : "加入我们，体验梵高数字档案。"}
                </Typography>

                {apiError && (
                    <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                        {apiError}
                    </Alert>
                )}

                {/**----- form Box --------- */}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ mt: 1, width: "100%" }}
                >
                    <Controller
                        name="credential"
                        control={control}
                        rules={{
                            required: true ,
                            validate: {
                                isEmailValid: (value) =>
                                    isLogin || validator.isEmail(value) || "请输入有效的电子邮箱格式",
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="credential"
                                label= "邮箱"
                                autoComplete="username"
                                autoFocus
                                error={!!errors.credential}
                                helperText={errors.credential ? errors.credential.message : undefined}
                                disabled={loading}
                                size="small"
                                sx={{ mb: { xs: 2, md: 3 } }}
                            />
                        )}
                    />

                    {/* 2. Password */}
                    {isLogin ? (
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: true }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    fullWidth
                                    label="密码"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    error={!!error}
                                    helperText={error ? error.message : undefined}
                                    disabled={loading}
                                    size="small"
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                    ) : (
                        <ValidatePasswordField
                            control={control}
                            name="password"
                            disabled={loading}
                            showRequirements={false}
                            showVisibilityToggle={true}
                        />
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disableElevation
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