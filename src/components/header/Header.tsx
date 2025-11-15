import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  useMediaQuery,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Menu from "./Menu";
import AvatarMenu from "./AvatarMenu";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const isMobile = useMediaQuery("(max-width: 600px)");
  const isLoggedIn = !!user;

  const goHome = () => navigate("/");
  const goSearch = () => {
    navigate("/search");
    window.scrollTo(0, 0);
  };
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
    user,
    isLoggedIn,
    isLoading,
    isMobile,
  };

  // ------------------------------

  return (
    <>
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
        <Toolbar sx={{ minHeight: "56px !important", px: 1 }}>
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              color: "#222",
              fontWeight: 600,
              fontSize: { xs: "1rem", md: "1.15rem" },
              textDecoration: "none",
              flexGrow: isMobile ? 1 : 0,
              pl: 0
            }}
          >
            梵·高档案馆
          </Typography>
          <Typography
            sx={{
              fontStyle: "italic",
              color: "#666",
              fontSize: { xs: "0.3rem", md: "1rem" },
              textAlign: { xs: "center", md: "left" },
              mt: 1,
              ml: 2,
            }}>
            {!isMobile ? (
              <>“我们真的不想在生命的尽头发现自己像梦游者一样走过这个世界。”</>
            ) :
              <></>
            }
          </Typography>

          {/* PC 菜单 */}
          {!isMobile && <Menu {...logic} />}

          {/* Search icon */}
          {/* <IconButton sx={{ ml: 1, mr: 1 }} onClick={goSearch}>
            <SearchIcon />
          </IconButton> */}

          {/* Avatar */}
          <Box sx={{ ml: 1, width: { xs: 30, sm: 35 }, height: { xs: 30, sm: 35 }, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "#777" }} />
            ) : (
              <AvatarMenu user={user} onLogout={handleLogout} />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Bottom Navigation */}
      {isMobile && <Menu {...logic} />}
    </>
  );
}
