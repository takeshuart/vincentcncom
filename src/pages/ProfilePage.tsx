import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Container,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from "@mui/material";

import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ValidatePasswordField, { validatePassword } from "@/components/PasswordField";
import { updateUserApi } from "@/api/AuthApi";
import { ERROR_MESSAGES } from "@/utils/errors";

type EditingKey = "nickName" | "email" | "password" | null;

interface FormData {
  nickName: string;
  email: string;
  password: string;
  confirmPassword: string;
  currentPassword: string;
}

const ART_BLUE = "#215A8F";
const HOVER_BLUE = "#17436B";
const LIGHT_BACKGROUND = "#f5f7fa";

export default function ProfilePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const userData = auth.user ?? null;

  const [editing, setEditing] = useState<EditingKey>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const { control, reset, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      nickName: userData?.nickName ?? "",
      email: userData?.email ?? "",
      password: "",
      confirmPassword: "",
      currentPassword: "",
    },
  });

  useEffect(() => {
    reset({
      nickName: userData?.nickName ?? "",
      email: userData?.email ?? "",
      password: "",
      confirmPassword: "",
      currentPassword: "",
    });
  }, [userData, reset]);

  const startEdit = (key: EditingKey) => {
    setEditing(key);
    setApiError("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setApiError("");
    reset({
      nickName: userData?.nickName ?? "",
      email: userData?.email ?? "",
      password: "",
      confirmPassword: "",
      currentPassword: "",
    });
  };

  const saveField = async (key: EditingKey) => {
    if (!key) return;
    setApiError("");

    const formValues = getValues();
    const payload: any = {};

    // 不提交重复值
    if (key === "nickName" && formValues.nickName === userData?.nickName) {
      setEditing(null);
      return;
    }
    if (key === "email" && formValues.email === userData?.email) {
      setEditing(null);
      return;
    }
    if (key === "password" && !formValues.password) {
      toast.error("请输入新密码");
      return;
    }

    try {
      setLoading(true);

      if (key === "nickName") {
        if (!formValues.nickName.trim()) { toast.error("昵称不能为空"); return; }
        payload.nickname = formValues.nickName;
      } else if (key === "email") {
        if (!formValues.email.trim()) { toast.error("邮箱不能为空"); return; }
        if (!formValues.currentPassword) { toast.error("修改邮箱需要输入当前密码"); return; }
        payload.email = formValues.email;
        payload.currentPassword = formValues.currentPassword;
      } else if (key === "password") {
        const pwdValidation = validatePassword(formValues.password);
        if (!pwdValidation.valid) { toast.error(pwdValidation.error || "密码格式不正确"); return; }
        if (formValues.password !== formValues.confirmPassword) { toast.error("两次输入的密码不一致"); return; }
        if (!formValues.currentPassword) { toast.error("修改密码需要输入当前密码"); return; }
        payload.password = formValues.password;
        payload.currentPassword = formValues.currentPassword;
      }

      const updatedUser = await updateUserApi(payload);
      auth.setUser(updatedUser);
      setEditing(null);
      toast.success("修改成功", { duration: 1500, position: "top-center" });

    } catch (err: any) {
      const code = err.response?.data?.errorCode;
      const msg = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  /** FieldRow 组件 */
  const FieldRow = ({
    label,
    displayValue,
    editKey,
    children,
  }: {
    label: string;
    displayValue: string;
    editKey: EditingKey;
    children?: React.ReactNode;
  }) => {
    const isEditing = editing === editKey;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: "#666", mb: 1 }}>
          {label}
        </Typography>

        {isEditing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {children}
            <Box sx={{ alignSelf: "flex-end" }}>
              <Button
                size="small"
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: ART_BLUE,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "transparent", color: HOVER_BLUE },
                }}
                onClick={() => saveField(editKey)}
                disabled={loading}
              >
                ✓
              </Button>
              <Button
                size="small"
                variant="text"
                sx={{
                  ml: 1,
                  minWidth: 0,
                  px: 1,
                  textTransform: "none",
                  color: "#999",
                }}
                onClick={cancelEdit}
                disabled={loading}
              >
                ✕
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: { xs: 14, sm: 16 }, color: "#333" }}>
              {label === "密码" ? "••••••••" : displayValue || "未设置"}
            </Typography>
            <Button
              size="small"
              variant="text"
              sx={{
                textTransform: "none",
                minWidth: 0,
                px: 1,
                color: ART_BLUE,
              }}
              onClick={() => startEdit(editKey)}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: { xs: 8, sm: 6, md: 8 }, px: { xs: 1, sm: 2 } }}>
      <Container>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6"
            sx={{ fontWeight: 700, color: ART_BLUE, fontSize: { xs: 18, sm: 22 } }}>
            个人资料
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {apiError && <Alert severity="error" sx={{ mb: 2, fontSize: { xs: 12, sm: 13 } }} onClose={() => setApiError("")}>{apiError}</Alert>}

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: "#999", textAlign: "left" }} 
              >
                用户ID: {userData?.userId }
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            {/* 昵称 */}
            <FieldRow label="昵称" displayValue={userData?.nickName ?? ""} editKey="nickName">
              <Controller
                name="nickName"
                control={control}
                render={({ field }) => <TextField {...field} size="small" variant="standard" placeholder="输入昵称" disabled={loading} fullWidth />}
              />
            </FieldRow>

            <Divider sx={{ my: 1 }} />

            {/* 邮箱 */}
            <FieldRow label="邮箱" displayValue={userData?.email ?? ""} editKey="email">
              <Controller
                name="email"
                control={control}
                render={({ field }) => <TextField {...field} size="small" variant="standard" placeholder="输入邮箱" disabled={loading} fullWidth />}
              />
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => <TextField {...field} size="small" variant="standard" placeholder="输入当前密码" type="password" disabled={loading} fullWidth />}
              />
            </FieldRow>

            <Divider sx={{ my: 1 }} />

            {/* 密码 */}
            <FieldRow label="密码" displayValue="" editKey="password">
              {editing === "password" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field }) => <TextField {...field} size="small"
                      // variant="standard" 
                      placeholder="输入当前密码" type="password" disabled={loading} fullWidth />}
                  />
                  <ValidatePasswordField
                    control={control}
                    name="password"
                    label="新密码"
                    size="small"
                    // variant="standard"
                    showRequirements={false}
                    showVisibilityToggle
                    disabled={loading}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => <TextField {...field} size="small" placeholder="再次输入新密码" type="password" disabled={loading} fullWidth />}
                  />
                </Box>
              )}
            </FieldRow>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate(-1)} sx={{ textTransform: "none", borderColor: "#ddd" }} size="small">
            返回
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
