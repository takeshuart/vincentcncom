import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { useState } from "react";

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 58%, 59%)`;
};

interface AvatarMenuProps {
  user?: { nickName?: string | null } | null;
  onLogout: () => void;
}

export default function AvatarMenu({ user, onLogout }: AvatarMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const nickname = user?.nickName ?? "User";
  const letter = nickname.charAt(0).toUpperCase();
  const color = stringToColor(nickname);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
        <Avatar sx={{
          bgcolor: color, color: "white", fontWeight: 600,
          width: { xs: 30, sm: 35 },
          height: { xs: 30, sm: 35 },
        }}>
          {letter}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        disableScrollLock
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            px: 1,
            py: 1,
            minWidth: 180,
            borderRadius: "16px",
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 1 }}>
          <Avatar sx={{ bgcolor: color, color: "white", mr: 1.5 }}>
            {letter}
          </Avatar>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
            {nickname}
          </Typography>
        </Box>

        <MenuItem
          onClick={onLogout}
          sx={{ borderRadius: "10px", py: 1.1, fontSize: "0.95rem" }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          注销
        </MenuItem>
      </Menu>
    </>
  );
}
