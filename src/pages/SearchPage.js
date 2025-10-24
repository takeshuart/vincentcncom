import React, { useRef, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress, Button, Badge } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // 【在此处添加这行代码】  
// 导入新的 Hook
import { useArtSearch } from '../hooks/useArtSearch';

import { FilterAccordion, SearchInput } from './Filters';
import '../styles/ArtTableStyles.css';
import ColorSearchBar from '../components/ColorSearchBar';
import PeriodTimelineFilter from '../components/PeriodBar';

const STORAGE_KEY = 'currentPageContext';

export default function ArtSearchPage() {
    const querystring = useLocation().search;

    // 【新增】引用：用于观察列表末尾的元素
    const loadMoreRef = useRef(null);

    // 1. Call the custom hook and destructure all necessary values
    const {
        query, keywordInput, setKeywordInput, artworks,
        totalResults, isLoading, isConfigLoaded, configData,
        handleFilterChange, handleColorSelect, handlePeriodChange,
        handleSearchTrigger,

        // 【关键新增】混合加载相关的状态和函数
        hasNextPage,
        autoLoadNextPage, // 供 Observer 使用
        manualLoadNextPage, // 供按钮使用
        isFetchingNextPage,
        canAutoLoad, // 是否允许自动加载

        remainingCount, // 剩余数量
        remainingPages, // 剩余页数

    } = useArtSearch();

    const saveSearchContext = (currentId) => {
        const allLoadedIds = artworks.map(item => String(item.id));
        const indexInList = allLoadedIds.findIndex(id => id === String(currentId));

        const context = {
            idList: allLoadedIds,
            currentIndex: indexInList,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    }

    // 【关键修改】使用 IntersectionObserver 实现自动加载
    useEffect(() => {
        // 只有当 loadMoreRef 存在、允许自动加载 (canAutoLoad) 且当前不在加载中时，才设置观察者。
        if (!loadMoreRef.current || !canAutoLoad || isFetchingNextPage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                // 当目标元素进入视口时
                if (entries[0].isIntersecting) {
                    // 调用自动加载函数
                    autoLoadNextPage();
                }
            },
            {
                // 提前触发加载，提供 200px 的裕度
                rootMargin: '200px 0px',
                threshold: 0.1,
            }
        );

        observer.observe(loadMoreRef.current);

        // 清理函数：canAutoLoad 变为 false 时 (达到 3 次限制) 观察者被清理。
        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };

    }, [canAutoLoad, isFetchingNextPage, autoLoadNextPage]);

    if (!isConfigLoaded) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={80} />
            </Container>
        );
    }

    if (isLoading && artworks.length === 0) {
        return (
            <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
                <CircularProgress size={100} />
            </Container>
        );
    }

    return (
        <Container maxWidth={false} disableGutters >
            <Container maxWidth={false} sx={{ width: '90%', mx: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={1}></Grid>
                    <Grid item xs={12} md={10}>
                        <Box >
                            {/* ... (Filters and Search Input UI remains the same) ... */}
                            <Grid container sx={{ margin: '40px 1px 40px 1px' }}>
                                <SearchInput
                                    value={keywordInput}
                                    onChange={(event) => setKeywordInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleSearchTrigger(event);
                                        }
                                    }}
                                    onClick={handleSearchTrigger}
                                />
                            </Grid>
                            <Grid container>
                                <PeriodTimelineFilter
                                    selectedValue={query.period}
                                    onSelectionChange={handlePeriodChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ColorSearchBar
                                    onColorSelect={handleColorSelect}
                                    initialColor={query.color}
                                />
                            </Grid>
                            <Grid container justifyContent="center" sx={{ marginBottom: '20px', marginTop: '20px' }}>
                                <Typography variant="subtitle1" sx={{ color: 'grey' }}>
                                    发现 <span style={{ fontWeight: 'bold' }}>{totalResults}</span> 个作品
                                </Typography>
                            </Grid>

                            {/* ----- Artworks Box ------- */}
                            <Grid container justifyContent="center" sx={{ mt: 4, minHeight: 600 }}>
                                {artworks?.map((artwork, index) => (
                                    <Grid item xs={6} sm={4} md={4} key={index}
                                        sx={{
                                            padding: '10px 40px 10px 10px',
                                            '@media (max-width: 600px)': {
                                                padding: '0px 0px 0px 20px'
                                            }
                                        }}>
                                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: 'none' }}>
                                            <Link target="_self" style={{ textDecoration: 'none' }}
                                                to={`/vincent/id/${artwork.id}${querystring}`}
                                                onClick={() => saveSearchContext(artwork.id)}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={`https://artworks-1257857866.cos.ap-beijing.myqcloud.com${artwork.primaryImageSmall}`}
                                                    alt=""
                                                    sx={{
                                                        height: '250px', width: '100%', objectFit: 'contain', objectPosition: 'center',
                                                        '@media (max-width: 600px)': { height: '150px' }, backgroundColor: '#fdfbfbff',
                                                        '&:hover': {
                                                            backgroundColor: '#f0f0f0'
                                                        }
                                                    }}
                                                />
                                            </Link>
                                            <CardContent align="left">
                                                <Typography sx={{ fontWeight: 400, fontSize: { xs: 12, md: 18 }, textAlign: 'left' }}>
                                                    {artwork.titleZh || artwork.titleEn}
                                                </Typography>
                                                <Typography color="text.secondary" variant="body2"
                                                    sx={{
                                                        textAlign: 'left',
                                                        display: { xs: 'none', md: 'block' },
                                                    }} >
                                                    {artwork.displayDate}{artwork.placeOfOrigin ? `, ${artwork.placeOfOrigin}` : ''}
                                                </Typography>
                                                {artwork.collection && (
                                                    <Typography variant="body2" color="text.secondary" textAlign='left'
                                                        sx={{
                                                            display: { xs: 'none', md: 'block' },
                                                        }}>
                                                        {artwork.collection}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}

                                {/* 【关键修改】底部加载区，根据状态进行渲染 */}
                                <Grid item xs={12}>
                                    <Box ref={loadMoreRef}
                                        sx={{
                                            py: 4,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            // 保证在加载中或等待点击时有高度，提供滚动阻力
                                            minHeight: (isFetchingNextPage || (hasNextPage && !canAutoLoad)) ? '150px' : '50px'
                                        }}>

                                        {/* 状态 1: 正在加载 (无论是自动还是手动点击) */}
                                        {isFetchingNextPage && (
                                            <>
                                                <CircularProgress size={40} />
                                                <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
                                                    加载中...
                                                </Typography>
                                            </>
                                        )}

                                        {/* 状态 2: 达到自动加载限制，需要点击按钮 (有下一页，但不能自动加载，且当前不在加载中) */}
                                        {hasNextPage && !canAutoLoad && !isFetchingNextPage && (
                                            // 使用 Badge 包裹按钮，显示剩余页数
                                            <Badge
                                                // 样式调整：放置在按钮右侧
                                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                badgeContent={`${remainingPages} 页`}
                                                color="primary" // 使用主题色
                                                sx={{
                                                    // 调整 Badge 容器与按钮的间距
                                                    '.MuiBadge-badge': {
                                                        right: -10, // 将徽章稍微往右推
                                                        top: 15,    // 稍微往下推
                                                        padding: '0 8px',
                                                        height: 25,
                                                        borderRadius: 12,
                                                        fontSize: 12,
                                                        fontWeight: 'bold',
                                                        border: '2px solid white', // 增加白色描边以增强对比
                                                        backgroundColor: '#9694c2ff'

                                                    }
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="large" // 增大尺寸，更易点击
                                                    onClick={manualLoadNextPage}

                                                    sx={{
                                                        py: 1.5,
                                                        px: 5, // 增加横向填充
                                                        borderRadius: '30px', // 增加圆角，提升设计感
                                                        fontWeight: 'bold',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': {
                                                            transform: 'scale(1.05)', // 鼠标悬停时的微交互
                                                            backgroundColor: '#7471b8ff'
                                                        },
                                                        backgroundColor: '#9694c2ff'

                                                    }}
                                                >
                                                    加载更多...({remainingCount} 个作品)
                                                </Button>
                                            </Badge>
                                        )}

                                        {/* 状态 3: 列表中没有作品 (无结果) */}
                                        {artworks.length === 0 && !isLoading && (
                                            <Typography variant="h6" color="text.secondary">
                                                未找到符合条件的作品 🤔
                                            </Typography>
                                        )}

                                        {/* 状态 4: 已加载全部作品 (没有下一页) */}
                                        {!hasNextPage && artworks.length > 0 && !isLoading && !isFetchingNextPage && (
                                            <Typography variant="subtitle1" color="text.secondary">
                                                已加载全部作品 🖼️
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>
                    <Grid item xs={12} md={1}></Grid>
                </Grid>
            </Container>
        </Container >
    );
}