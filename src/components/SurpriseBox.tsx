import React, { Ref } from 'react';
import { Box, Grid, Typography, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Casino as CasinoIcon } from '@mui/icons-material';
import { Artwork } from '../types/Artwork';

interface SurpriseBoxProps {
    artwork: Artwork | null;
    isSurpriseLoading: boolean;
    fetchSurpriseArtWork: () => Promise<void>;
}



const SurpriseBox = React.forwardRef<HTMLDivElement, SurpriseBoxProps>(
    ({
        artwork,
        isSurpriseLoading,
        fetchSurpriseArtWork
    }, ref) => {

        const isLoading = isSurpriseLoading || !artwork;

        return (
            <Box
                ref={ref}
                sx={{
                    minHeight: { xs: 350, md: 700 },
                    display: 'flex',
                    alignItems: 'center',//上下居中
                    justifyContent: 'center', //左右居中
                    backgroundColor: '#E8E8F5',
                    borderRadius: 5,
                    position: 'relative',
                    bgcolor: '#d8dbf0ff',

                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)', //创造“浮动”的立体感 (bedroom 家具的立体感)
                }}
            >
                {/** Surprise Button */}
                <Button
                    onClick={fetchSurpriseArtWork}
                    sx={{
                        position: 'absolute',
                        top: { xs: 16, md: 40 },
                        right: { xs: 16, md: 40 },
                        minWidth: 'auto',
                        padding: 1,
                        borderRadius: '50%',
                        zIndex: 10,

                    }}
                >
                    <CasinoIcon sx={{
                        fontSize: { xs: 36, md: 60 },
                        cursor: 'pointer',
                        // color: '#FFC700',
                        color: '#2A5A29',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            // color: '#FFA500', // 悬停时亮黄色略深

                            color: '#9ACD32', //如果底色是深绿，悬停可以变浅绿 
                        }
                    }} />
                </Button>


                {isLoading ? (
                    <CircularProgress size={80} />
                ) : (
                    <Grid container alignItems="center" sx={{ p: 0 }}>
                        <Grid item xs={12} md={8} display="flex" justifyContent="center" >
                            {/** left image box */}
                            <Box sx={{
                                width: { xs: '100%', md: 700 },
                                height: { xs: 250, md: 600 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={getImageUrl(artwork!.primaryImageMedium)}
                                    alt={artwork!.titleZh || artwork!.titleEn}
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
                                    sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.8rem', md: '2.5rem' } }}
                                >
                                    {artwork!.titleZh || artwork!.titleEn}
                                </Typography>

                                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.80rem', md: '1.25rem' } }}>
                                    {artwork!.titleEn}
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    sx={{ mb: 2, fontStyle: 'italic', display: { xs: 'none', md: 'block' } }}
                                >
                                    {artwork!.displayDate}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        mb: 4, color: 'gray',
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                        display: { xs: 'none', md: 'block' }
                                    }}
                                >
                                    {artwork!.collection || '收藏地：未知'}
                                </Typography>

                                {/* 详情按钮 */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: { xs: 'center', md: 'flex-start' }
                                }}>
                                    <Link to={`/vincent/${artwork!.id}`} target="_self" style={{ textDecoration: 'none' }}>
                                        <Button variant="contained" size='large' sx={{
                                            borderColor: '#2A5A29', // 边框：深绿色
                                            // color: '#2A5A29',       // 文字：深绿色
                                            backgroundColor: '#2A5A29',
                                            // 悬停样式：背景和文字色反转
                                            '&:hover': {
                                                backgroundColor: '#2A5A29', // 悬停背景变深绿色
                                                color: '#FFFFFF',           // 悬停文字变白色
                                                borderColor: '#2A5A29',
                                            },
                                            padding: {
                                                xs: '4px 8px',
                                                md: '8px 22px' 
                                            },
                                            fontWeight: {
                                                xs: 300, 
                                                md: 700 
                                            },
                                        }}>
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

export default SurpriseBox;


const getImageUrl = (primaryImageSmall: string | undefined): string => {
    if (!primaryImageSmall) return '';
    const parts = primaryImageSmall.split(';').map(p => p.trim());
    const valid = parts.find(p => p.startsWith('/works/'));
    return `https://artworks-1257857866.cos.ap-beijing.myqcloud.com${valid || parts[0] || ''}`;
};
