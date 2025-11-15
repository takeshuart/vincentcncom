import React from "react";
import { Box, Typography, Skeleton, ImageList, ImageListItem, Container, useMediaQuery, useTheme } from "@mui/material";
import { useFavoritesQuery } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { IMAGE_DOMAIN } from "@/utils/constants";

// define a skeleton component to show while loading favorites
const FavoriteSkeleton: React.FC = () => {
    const skeletonItems = [...Array(8).keys()];
    return (
        <ImageList variant="masonry" cols={4} gap={8}>
            {skeletonItems.map((i) => (
                <ImageListItem key={i}>
                    <Skeleton
                        variant="rectangular"
                        // height={Math.random() * 100 + 150}
                        sx={{ borderRadius: 2 }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

const FavoritesPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const userId = user?.userId;

    if (!userId) {
        navigate("/auth")
    }

    const { data, isLoading, isFetching, isFetched } = useFavoritesQuery(userId ?? '');

    if (isLoading || isFetching || !isFetched) {
        return (
            <Container sx={{ display: 'flex', paddingTop: 15, justifyContent: 'center' }}>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Skeleton width={200} height={30} sx={{ mb: 2 }} /> {/* 标题骨架 */}
                    <FavoriteSkeleton />
                </Box>
            </Container>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 20, textAlign: "center", paddingTop: 15 }}>
                <Typography variant="h6" color="text.secondary">
                    暂无收藏作品
                </Typography>
            </Box>
        );
    }
    const favorites = data;

    return (
        <Container
            // disableGutters {/** remove Container's defualt padding */}
            sx={{ display: 'flex', paddingTop: { xs: 10, md: 15 }, px: { xs: 1, sm: 3, md: 10 }, justifyContent: 'center' }}>

            <Box sx={{ p: { xs: 0, md: 4 }, justifyContent: 'center' }}>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "black" }}
                >
                    我的收藏（{favorites.length}）
                </Typography>

                <ImageList variant="masonry" cols={isMobile ? 2 : 4} sx={{ gap: { xs: 4, md: 8 } }}>
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
                                borderRadius: 0.5,
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
                                    borderRadius: "4px",
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
        </Container >
    );
};

export default FavoritesPage;
