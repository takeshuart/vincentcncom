import {
    Box,
    Drawer,
    MenuItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FavoriteIcon from "@mui/icons-material/Favorite";

type MenuProps = {
    isMobile: boolean;
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
    goHome: () => void;
    goSearch: () => void;
    goFavorites: () => void;
};

export default function Menu({
    isMobile,
    drawerOpen,
    setDrawerOpen,
    goHome,
    goSearch,
    goFavorites,
}: MenuProps) {
    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box sx={{ width: 250, p: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>
                        菜单
                    </Typography>

                    <MenuItem onClick={() => { setDrawerOpen(false); goHome(); }}>
                        <ListItemIcon>
                            <HomeIcon sx={{ color: "#444" }} />
                        </ListItemIcon>
                        <ListItemText primary="主页" />
                    </MenuItem>

                    <MenuItem onClick={() => { setDrawerOpen(false); goSearch(); }}>
                        <ListItemIcon>
                            <TravelExploreIcon sx={{ color: "#444" }} />
                        </ListItemIcon>
                        <ListItemText primary="探索" />

                    </MenuItem>

                    <MenuItem onClick={() => { setDrawerOpen(false); goFavorites(); }}>
                        <ListItemIcon>
                            <FavoriteIcon sx={{ color: "#0c0c0cff" }} />
                        </ListItemIcon>
                        <ListItemText primary="我的收藏" />
                    </MenuItem>
                </Box>
            </Drawer>
        );
    }

    // PC 模式
    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", ml: "auto", mr: 5 }}>
            <Button onClick={goHome} sx={btnStyle}>
                主页
            </Button>
            <Button onClick={goSearch} sx={btnStyle}>
                探索
            </Button>
            <Button onClick={goFavorites} sx={btnStyle}>
                我的收藏
            </Button>
        </Box>

    );
}

const btnStyle = {
    textTransform: "none",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: 500,
    px: 1,
    "&:hover": { color: "#b02d2d" },
};
