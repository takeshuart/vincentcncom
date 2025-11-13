import React from "react";
import { Box, Typography, Skeleton, ImageList, ImageListItem, Container } from "@mui/material";
import { useFavoritesQuery } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { IMAGE_DOMAIN } from "@/utils/constants";

const FavoritesPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const userId = user?.userId;

    if (!userId) {
        navigate("/auth")
    }

    const { data, isLoading } = useFavoritesQuery(userId??'');

    const favorites = data ?? [];
    
    if (isLoading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                    正在加载收藏作品...
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" width={200} height={180} />
                    ))}
                </Box>
            </Box>
        );
    }

    if (!favorites.length) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                    暂无收藏作品
                </Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ display: 'flex', paddingTop: 20 }}>

            <Box sx={{ p: { xs: 2, md: 4 }, justifyContent: 'center' }}>

                <ImageList variant="masonry" cols={4} gap={8}>
                    {favorites.map((fav: any) => {
                        const artwork = fav.artwork;
                        const transparency = 0.8
                        const hoverOverlayColor = `rgba(${artwork.r || 0}, ${artwork.g || 0}, ${artwork.b || 0}, ${transparency})`;

                        return (
                            <ImageListItem
                                key={artwork.id}
                                sx={{
                                    position: "relative",
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    transition: "transform 0.3s ease",
                                    "&:hover .overlay": {
                                        opacity: 1,
                                    },
                                }}
                                onClick={() => navigate(`/vincent/${artwork.id}`)}
                            >
                                <img
                                    src={`${IMAGE_DOMAIN}${artwork.primaryImageSmall}`}
                                    alt={artwork.titleZh}
                                    loading="lazy"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        display: "block",
                                        borderRadius: "8px",
                                    }}
                                />
                                {/* 悬停信息层 */}
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        backgroundColor: hoverOverlayColor,
                                        opacity: 0,
                                        transition: "opacity 0.3s ease",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: 'center',
                                        p: 2,
                                        color: "white",
                                        backdropFilter: "blur(1px)",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 600, color: "#fff" }}
                                    >
                                        {artwork.titleZh || artwork.titleEn}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#f0f0f0", fontSize: "0.85rem" }}
                                    >
                                        {artwork.collectionZh || ""}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#f0f0f0", fontSize: "0.8rem" }}
                                    >
                                        {artwork.displayDate || ""}
                                    </Typography>
                                </Box>
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            </Box>
        </Container>
    );
};

export default FavoritesPage;
