import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Divider,
  Tooltip,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "@/hooks/useAuth";
import apiV1 from "@/api/requests";
import { toast } from "react-hot-toast";
import PasswordField, { validatePassword } from "@/components/PasswordField";

type EditingKey = "nickName" | "email" | "password" | null;

export default function ProfilePage() {
  const { user } = useAuth();
  const userData =  user ?? null;

  const [nickName, setNickName] = useState<string>(userData?.nickName ?? "");
  const [email, setEmail] = useState<string>(userData?.email ?? "");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");

  const [editing, setEditing] = useState<EditingKey>(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");

  const ART_BLUE = "#215A8F";
  const HOVER_BLUE = "#17436B";
  const ACTIVE_BLUE = "#0E2C48";
  const LIGHT_BACKGROUND = "#d8dbf0ff";

  // Removed validatePassword as it's now imported from PasswordField component

  useEffect(() => {
    setNickName(userData?.nickName ?? "");
    setEmail(userData?.email ?? "");
  }, [userData?.nickName, userData?.email]);

  const startEdit = (key: EditingKey) => {
    setEditing(key);
    setPassword("");
    setConfirm("");
    setPasswordError("");
    setApiError("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setPassword("");
    setConfirm("");
    setPasswordError("");
    setApiError("");
    // reset to original values
    setNickName(userData?.nickName ?? "");
    setEmail(userData?.email ?? "");
  };

  const saveField = async (key: EditingKey) => {
    if (!key) return;
    setApiError("");

    if (key === "password") {
      if (!password) {
        toast.error("请输入新密码");
        return;
      }
      const pwdValidation = validatePassword(password);
      if (!pwdValidation.valid) {
        setPasswordError(pwdValidation.error || "密码格式不正确");
        return;
      }
      if (password !== confirm) {
        toast.error("两次输入的密码不一致");
        return;
      }
    }

    const payload: any = {};
    if (key === "nickName") payload.nickName = nickName || undefined;
    if (key === "email") payload.email = email || undefined;
    if (key === "password") payload.password = password;

    try {
      setLoading(true);
      await apiV1.patch("/users/me", payload);
      toast.success("保存成功");
      setEditing(null);
      // refresh to update auth context
      setTimeout(() => window.location.reload(), 700);
      } catch (err: any) {
        const msg = err?.displayMessage || err?.message || "保存失败";
        setApiError(msg);
      } finally {
        setLoading(false);
      }
    };  return (
    <Box
      sx={{
        backgroundColor: LIGHT_BACKGROUND,
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        pt: { xs: 6, md: 12 },
        px: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 760, p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: ART_BLUE }}>
          个人资料
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          管理你的账户信息。点击右侧的编辑图标可以修改对应字段。
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {apiError}
          </Alert>
        )}

        {/* Nickname row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25 }}>
          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>昵称</Typography>
            {editing === "nickName" ? (
              <TextField size="small" value={nickName} onChange={(e) => setNickName(e.target.value)} sx={{ mt: 1, width: 360 }} />
            ) : (
              <Typography sx={{ fontSize: 16, fontWeight: 600, mt: 0.5 }}>{nickName || "未设置"}</Typography>
            )}
          </Box>

          <Box>
            {editing === "nickName" ? (
              <Stack direction="row" spacing={1}>
                <Tooltip title="保存">
                  <IconButton sx={{ bgcolor: ART_BLUE, color: "white", '&:hover': { bgcolor: HOVER_BLUE } }} onClick={() => saveField("nickName")} disabled={loading}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="取消">
                  <IconButton onClick={cancelEdit}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Tooltip title="编辑昵称">
                <IconButton onClick={() => startEdit("nickName")}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Email row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25 }}>
          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>邮箱</Typography>
            {editing === "email" ? (
              <TextField size="small" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mt: 1, width: 360 }} />
            ) : (
              <Typography sx={{ fontSize: 16, fontWeight: 600, mt: 0.5 }}>{email || "未设置"}</Typography>
            )}
          </Box>

          <Box>
            {editing === "email" ? (
              <Stack direction="row" spacing={1}>
                <Tooltip title="保存">
                  <IconButton sx={{ bgcolor: ART_BLUE, color: "white", '&:hover': { bgcolor: HOVER_BLUE } }} onClick={() => saveField("email")} disabled={loading}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="取消">
                  <IconButton onClick={cancelEdit}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Tooltip title="编辑邮箱">
                <IconButton onClick={() => startEdit("email")}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Password row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.25 }}>
          <Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>密码</Typography>
            {editing === "password" ? (
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <PasswordField
                    label="新密码"
                    value={password}
                    onChange={(value) => {
                      setPassword(value);
                      if (value) {
                        const validation = validatePassword(value);
                        setPasswordError(validation.error || "");
                      } else {
                        setPasswordError("");
                      }
                    }}
                    error={passwordError}
                    disabled={loading}
                    showRequirements={true}
                    showVisibilityToggle={true}
                    size="small"
                  />
                </Box>
                <TextField size="small" label="确认密码" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <LockIcon fontSize="small" color="disabled" />
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>••••••••</Typography>
              </Box>
            )}  
          </Box>

          <Box>
            {editing === "password" ? (
              <Stack direction="row" spacing={1}>
                <Tooltip title="保存">
                  <IconButton sx={{ bgcolor: ART_BLUE, color: "white", '&:hover': { bgcolor: HOVER_BLUE } }} onClick={() => saveField("password")} disabled={loading}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="取消">
                  <IconButton onClick={cancelEdit}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Tooltip title="修改密码">
                <IconButton onClick={() => startEdit("password")}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={() => window.history.back()} sx={{ textTransform: "none" }}>
            返回
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
