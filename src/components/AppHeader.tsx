import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    CircularProgress
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Logout } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 58%, 59%)`;
};

const Header = () => {
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
        return { color: stringToColor(nickname), letter };
    }, [user]);

    const handleMenuOpen = (e: any) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogoutClick = () => {
        logout();
        handleMenuClose();
        navigate("/search");
    };

    const goBack = () => navigate(-1);

    const goToFavorites = () => {
        if (!isLoggedIn) navigate("/auth");
        else navigate("/favorites");
    };

    return (
        <AppBar
            elevation={0}
            position="absolute"
            color="transparent"
            sx={{
                backdropFilter: "blur(18px)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                height: 56,
                display: "flex",
                justifyContent: "center",
                zIndex: 999,
            }}
        >
            <Toolbar sx={{ minHeight: "56px !important" }}>
                {/* Back Button or Space */}
                {shouldShowBack ? (
                    <IconButton
                        onClick={goBack}
                        sx={{ color: "#333", mr: 1 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ width: 40, mr: 1 }} />
                )}

                {/* Title */}
                <Typography
                    component={Link}
                    to="/"
                    sx={{
                        color: "#222",
                        fontWeight: 600,
                        fontSize: "1.15rem",
                        textDecoration: "none",
                        letterSpacing: 0.5,
                        mr: 4
                    }}
                >
                    梵·高档案馆
                </Typography>

                {/* Left Nav */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", ml: "auto" }}>
                    <Button onClick={() => navigate('/')} sx={{ ...MenuStyles }}>
                        主页
                    </Button>
                    <Button onClick={() => navigate('/search')} sx={{ ...MenuStyles }}>
                        探索
                    </Button>
                    <Button onClick={goToFavorites} sx={{ ...MenuStyles }}>
                        我的收藏
                    </Button>


                    <Box sx={{ width: 30 }} />

                    {/* Auth or Avatar Section */}
                    {isLoading ? (
                        <CircularProgress size={22} sx={{ color: "#777" }} />
                    ) : isLoggedIn ? (
                        <>
                            <IconButton
                                onClick={handleMenuOpen}
                                size="small"
                                sx={{ p: 0, ml: 1 }}
                            >
                                <Avatar
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        bgcolor: avatarDetails.color,
                                        color: "white",
                                        fontWeight: 600,
                                        boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    {avatarDetails.letter}
                                </Avatar>
                            </IconButton>

                            {/* Popup Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                /* Disable MUI's automatic body padding adjustment when opening the menu */
                                disableScrollLock
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        mt: 2,
                                        px: 1.2,
                                        py: 1,
                                        minWidth: 180,
                                        borderRadius: "16px",
                                        bgcolor: "rgba(255,255,255,0.9)",
                                        backdropFilter: "blur(18px)",
                                        border: "1px solid rgba(255,255,255,0.25)",
                                        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                                        transform: 'translateX(-20px) !important',

                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center", px: 1, py: 1, mb: 0.5
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: avatarDetails.color,
                                            color: "white", mr: 1.5, width: 38, height: 38,
                                            fontWeight: 600
                                        }}
                                    >
                                        {avatarDetails.letter}
                                    </Avatar>
                                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                                        {user?.nickName || "User"}
                                    </Typography>
                                </Box>

                                <Box sx={{ height: 1, bgcolor: "rgba(0,0,0,0.06)", mx: 1, my: 1 }} />

                                <MenuItem
                                    onClick={handleLogoutClick}
                                    sx={{
                                        borderRadius: "10px",
                                        py: 1.1,
                                        fontSize: "0.95rem",
                                        "&:hover": { background: "rgba(0,0,0,0.06)" }
                                    }}
                                >
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    注销
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            onClick={() => navigate("/auth")}
                            variant="contained"
                            disableElevation
                            sx={{
                                textTransform: "none",
                                borderRadius: "8px",
                                px: 3,
                                py: 0.7,
                                fontSize: "0.95rem",
                                background: "#2f6fa0",
                                "&:hover": { background: "#295f8a" }
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

export default Header;

const MenuStyles = {
    textTransform: "none",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: 500,
    px: 1,
    "&:hover": { color: "#b02d2d" }
}