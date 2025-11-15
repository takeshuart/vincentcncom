import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 58%, 59%)`;
};

interface AvatarMenuProps {
  // Accept either { data: { nickName, email, ... } } or legacy { nickName }
  user?: any | null;
  onLogout: () => void;
}

export default function AvatarMenu({ user, onLogout }: AvatarMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const navigate = useNavigate();

  const userData = user?.data ?? user ?? null;
  const isLoggedIn = Boolean(userData && (userData.nickName || userData.userId));
  const nickname = userData?.nickName ?? userData?.userId ?? "User";
  const letter = (nickname && nickname.charAt(0).toUpperCase()) || "V";
  const color = stringToColor(nickname);
  const email = userData?.email ?? "";
  const registeredAt = userData?.registeredAt ?? userData?.registered_at ?? null;
  const registeredStr = registeredAt ? new Date(registeredAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : null;

  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);
  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  return (
    <>
      {!isLoggedIn ? (
        <Button color="inherit" onClick={() => navigate('/auth')} sx={{ p: 0, minWidth: "auto" }}>
          登录
        </Button>
      ) : (
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0, width: "100%", height: "100%" }}>
          <Avatar sx={{
            bgcolor: color, color: "white", fontWeight: 600,
            width: { xs: 30, sm: 35 },
            height: { xs: 30, sm: 35 },
          }}>
            {letter}
          </Avatar>
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 6,
          sx: {
            mt: 1.5,
            mr: 1.5,
            minWidth: 220,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: "rgba(15, 15, 15, 0.06) 0px 6px 24px",
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 0, py: 1 }}>
          <Avatar sx={{ bgcolor: color, color: "white", width: 44, height: 44 }}>{letter}</Avatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>{nickname}</Typography>
            {email ? (
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>{email}</Typography>
            ) : (
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>ID: {userData?.userId ?? "-"}</Typography>
            )}
          </Box>
        </Stack>

        {registeredStr && (
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", px: 1, mt: 0.25 }}>
            注册于 {registeredStr}
          </Typography>
        )}

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleProfile} sx={{ py: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: "0.95rem" }}>编辑个人信息</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onLogout();
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: "0.95rem" }}>注销</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
