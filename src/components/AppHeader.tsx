import {
    AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar,
    Menu, MenuItem, ListItemIcon, CircularProgress, useTheme,
} from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Logout } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 60%)`;
};

const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const shouldShowBack = location.pathname.startsWith("/vincent/");
    const { user, logout, isLoading } = useAuth();
    const isLoggedIn = !!user;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const avatarDetails = useMemo(() => {
        const nickname = user?.nickName ?? "Guest";
        const letter = nickname.charAt(0)?.toUpperCase() || "G";
        return {
            color: stringToColor(nickname),
            letter,
        };
    }, [user]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogoutClick = () => {
        logout();
        handleMenuClose();
        navigate("/search");
    };

    const goToFavorites = () => {
        if (!isLoggedIn) {
            navigate("/auth");
        } else {
            navigate("/favorites");
        }
    };

    const handleLoginClick = () => navigate("/auth");

    const goBack = () => navigate(`/search${location.search}`);

    return (
        <AppBar position="absolute" color="transparent" sx={{ boxShadow: "none", height: 40, zIndex: 999 }}>
            <Toolbar sx={{ bgcolor: "transparent" }}>
                {shouldShowBack ? (
                    <Box display="flex" alignItems="center" onClick={goBack} sx={{ mr: 2, cursor: "pointer", color: "black" }}>
                        <ArrowBackIcon />
                    </Box>
                ) : (
                    <Box sx={{ width: 30, mr: 2 }} />
                )}

                <Typography
                    component={Link}
                    to="/"
                    sx={{
                        color: "black",
                        fontWeight: 500,
                        textDecoration: "none",
                        fontSize: { xs: "1rem", sm: "1rem", md: "1.25rem" },
                    }}
                >
                    梵·高档案馆
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                    <Button
                        onClick={goToFavorites}
                        sx={{
                            textTransform: 'none',
                            color: 'black',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            mr: 20,
                            '&:hover': { color: '#c93636' },
                        }}
                    >
                        我的收藏
                    </Button>

                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: "gray" }} />
                    ) : isLoggedIn ? (
                        <>
                            <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2, p: 0 }}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: avatarDetails.color,
                                        color: "white",
                                        fontWeight: 600,
                                    }}
                                >
                                    {avatarDetails.letter}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleMenuClose}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            >
                                <MenuItem disabled>
                                    <Avatar sx={{ bgcolor: avatarDetails.color, color: "white", mr: 1 }}>
                                        {avatarDetails.letter}
                                    </Avatar>
                                    {user?.nickName || "User"}
                                </MenuItem>
                                <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #eee" }} />
                                <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #eee" }} />
                                <MenuItem onClick={handleLogoutClick}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    注销
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            onClick={handleLoginClick}
                            variant="contained"
                            disableElevation
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                padding: '5px 25px',
                                fontSize: '1rem',
                                fontWeight: 600,

                                backgroundColor: '#2e74b6ff', // 普鲁士蓝
                                color: 'white',
                                transition: 'background-color 0.2s ease-out', // 只对背景色做过渡

                                '&:hover': {
                                    backgroundColor: '#2a6ba8ff',
                                    boxShadow: '0 0 10px 3px rgba(39, 101, 160, 0.2)',
                                },
                            }}
                        >
                            登录
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
