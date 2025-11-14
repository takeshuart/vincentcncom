import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Menu from "./Menu";
import AvatarMenu from "./AvatarMenu";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isLoggedIn = !!user;

  const goHome = () => navigate("/");
  const goSearch = () => navigate("/search");

  const goFavorites = () => {
    if (!isLoggedIn) navigate("/auth");
    else navigate("/favorites");
  };

  const handleLogout = () => {
    logout();
    navigate("/search");
  };

  const logic = {
    goHome,
    goSearch,
    goFavorites,
    handleLogout,
    drawerOpen,
    setDrawerOpen,
    user,
    isLoggedIn,
    isLoading,
    isMobile,
  };

  // ------------------------------

  return (
    <AppBar
      elevation={0}
      position="fixed"
      color="transparent"
      sx={{
        // backdropFilter: "blur(18px)",//毛玻璃效果
        // borderBottom: "1px solid rgba(0,0,0,0.05)",
        height: 56,
        zIndex: 999,
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important",px:1 }}>
        {/* Mobile: Hamburger */}
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          sx={{
            color: "#222",
            fontWeight: 600,
            fontSize: "1.15rem",
            textDecoration: "none",
            flexGrow: isMobile ? 1 : 0,
          }}
        >
          梵·高档案馆
        </Typography>

        {/* PC 菜单 */}
        {!isMobile && <Menu {...logic} />}

        {/* Search icon */}
        {/* <IconButton sx={{ ml: 1, mr: 1 }} onClick={goSearch}>
          <SearchIcon />
        </IconButton> */}

        {/* Avatar */}
        {isLoading ? (
          <CircularProgress size={22} sx={{ color: "#777" }} />
        ) : (
          isLoggedIn && <AvatarMenu user={user} onLogout={handleLogout} />
        )}

        {/* Mobile Drawer 菜单 */}
        {isMobile && <Menu {...logic} />}
      </Toolbar>
    </AppBar>
  );
}
