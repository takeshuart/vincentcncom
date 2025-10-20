import React, { Ref } from 'react';
import { Box, Grid, Typography, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Casino as CasinoIcon } from '@mui/icons-material';

interface Artwork {
    id: number;
    titleZh: string;
    titleEn: string;
    displayDate: string;
    artistName: string;
    collection: string;
    primaryImageSmall: string;
    primaryImageMedium: string;
}

interface SurpriseArtworkBlockProps {
    surpriseArtwork: Artwork | null;
    isSurpriseLoading: boolean;
    fetchSurpriseArtWork: () => Promise<void>;
}

const getImageUrl = (primaryImageSmall: string | undefined): string => {
    if (!primaryImageSmall) return '';
    const parts = primaryImageSmall.split(';').map(p => p.trim());
    const valid = parts.find(p => p.startsWith('/works/'));
    return `https://artworks-1257857866.cos.ap-beijing.myqcloud.com${valid || parts[0] || ''}`;
};


const SurprisemeBlock = React.forwardRef<HTMLDivElement, SurpriseArtworkBlockProps>(
    ({
        surpriseArtwork,
        isSurpriseLoading,
        fetchSurpriseArtWork
    }, ref: Ref<HTMLDivElement>) => {

        const isLoading = isSurpriseLoading || !surpriseArtwork;

        return (
            <Box
                ref={ref}
                sx={{
                    minHeight: { xs: 350, md: 700 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f8f8',
                    borderRadius: 2,
                    position: 'relative'
                }}
            >
                <Button
                    onClick={fetchSurpriseArtWork}
                    sx={{
                        position: 'absolute',
                        top: { xs: 16, md: 24 },
                        right: { xs: 16, md: 24 },
                        minWidth: 'auto',
                        padding: 1,
                        borderRadius: '50%',
                        zIndex: 10,
                    }}
                >
                    <CasinoIcon sx={{ fontSize: { xs: 36, md: 50 } }} />
                </Button>


                {isLoading ? (
                    <CircularProgress size={80} />
                ) : (
                    <Grid container alignItems="center" sx={{ p: 0 }}>
                        <Grid item xs={12} md={8} display="flex" justifyContent="center" >
                            {/** left image box */}
                            <Box sx={{
                                width: { xs: '100%', md: 700 },
                                height: { xs: 300, md: 650 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={getImageUrl(surpriseArtwork!.primaryImageMedium)}
                                    alt={surpriseArtwork!.titleZh || surpriseArtwork!.titleEn}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* 右侧：作品信息和 Surprise Me 按钮 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography
                                    // variant="h4" 
                                    sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.5rem', md: '2.5rem' } }}
                                >
                                    {surpriseArtwork!.titleZh || surpriseArtwork!.titleEn}
                                </Typography>

                                <Typography sx={{ fontSize: { xs: '0.875rem', md: '1.25rem' } }}>
                                    {surpriseArtwork!.titleEn}
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    sx={{ mb: 2, fontStyle: 'italic', display: { xs: 'none', md: 'block' } }}
                                >
                                    {surpriseArtwork!.displayDate}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        mb: 4, color: 'gray',
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                        display: { xs: 'none', md: 'block' }
                                    }}
                                >
                                    {surpriseArtwork!.collection || '收藏地：未知'}
                                </Typography>

                                {/* Surprise Me 按钮 */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: { xs: 'center', md: 'flex-start' }
                                }}>
                                    <Link to={`/vincent/id/${surpriseArtwork!.id}`} target="_self" style={{ textDecoration: 'none' }}>
                                        <Button variant="contained" size='large' >
                                            查看详情
                                        </Button>
                                    </Link>


                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>
        );
    });

export default SurprisemeBlock;