import {
    Box,
    Button,
    BottomNavigation,
    BottomNavigationAction,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";

type MenuProps = {
    isMobile: boolean;
    goHome: () => void;
    goSearch: () => void;
    goFavorites: () => void;
};

export default function Menu({
    isMobile,
    goHome,
    goSearch,
    goFavorites,
}: MenuProps) {
    const [value, setValue] = useState(0);

    if (isMobile) {
        return (
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    if (newValue === 0) goHome();
                    else if (newValue === 1) goSearch();
                    else if (newValue === 2) goFavorites();
                }}
                sx={{
                    position: "fixed",
                    bottom: 0, left: 0, right: 0,
                    width: "100%",
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    backgroundColor: "#fff",
                    zIndex: 50,
                }}
            >
                <BottomNavigationAction
                    icon={<HomeIcon sx={{ fontSize: "1.5rem" }} />}
                    sx={MOBILE_BUTTON_STYLE}
                />
                <BottomNavigationAction
                    icon={<TravelExploreIcon sx={{ fontSize: "1.5rem" }} />}
                    sx={MOBILE_BUTTON_STYLE}
                />
                <BottomNavigationAction
                    icon={<FavoriteIcon sx={{ fontSize: "1.5rem" }} />}
                    sx={MOBILE_BUTTON_STYLE}
                />
            </BottomNavigation>
        );
    }

    // PC 模式
    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", ml: "auto", mr: 5 }}>
            <Button onClick={goHome} sx={PC_BUTTON_STYLE}>
                主页
            </Button>
            <Button onClick={goSearch} sx={PC_BUTTON_STYLE}>
                探索
            </Button>
            <Button onClick={goFavorites} sx={PC_BUTTON_STYLE}>
                我的收藏
            </Button>
        </Box>

    );
}

const PC_BUTTON_STYLE = {
    textTransform: "none",
    color: "#444",
    fontSize: "0.95rem",
    fontWeight: 500,
    px: 1,
    "&:hover": { color: "#b02d2d" },
};

const MOBILE_BUTTON_STYLE = {
    color: "#666",
    "&.Mui-selected": { color: "#215A8F"}
};