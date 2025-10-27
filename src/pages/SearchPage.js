import React, { useRef, useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress, Button, Badge, Skeleton } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // 【在此处添加这行代码】  
// 导入新的 Hook
import { useArtSearch } from '../hooks/useArtSearch';

import { FilterAccordion, SearchInput } from './Filters';
import '../styles/ArtTableStyles.css';
import ColorSearchBar from '../components/ColorSearchBar';
import PeriodTimelineFilter from '../components/PeriodBar';
import { keyframes, useTheme } from '@mui/material/styles';
import styled from '@emotion/styled';

const STORAGE_KEY = 'currentPageContext';

export default function ArtSearchPage() {

    const querystring = useLocation().search;

    // 【新增】引用：用于观察列表末尾的元素
    const loadMoreRef = useRef(null);

    // 1. Call the custom hook and destructure all necessary values
    const {
        query, keywordInput, setKeywordInput, artworks,
        totalResults, isConfigLoaded, configData, isInitialLoading,
        isNewSearch, //loading first page

        // 【关键新增】混合加载相关的状态和函数
        hasNextPage,
        autoLoadNextPage, // 供 Observer 使用
        manualLoadNextPage, // 供按钮使用
        isFetchingNextPage,
        canAutoLoad, // 是否允许自动加载

        remainingCount, // 剩余数量
        remainingPages, // 剩余页数
        handleFilterChange, handleColorSelect, handlePeriodChange,
        handleSearchTrigger,

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


    const isNewSearchPending = isNewSearch && artworks.length > 0;
    const isReady = isConfigLoaded && !isInitialLoading; // 页面内容是否准备就绪
    return (
        <>
            <ThemedLoadingOverlay isLoading={!isReady} />

            <Container maxWidth={false} disableGutters >
                <Container maxWidth={false} sx={{
                    width: '90%', mx: 'auto',
                    '@media (max-width: 600px)': {
                        width: '100%',
                        px: '1px'
                    },
                    pt: '60px', //bgcolor对margin无效

                }}>
                    <Grid container justifyContent='center'>
                        <Grid item xs={12} md={10}>

                            <Box
                                sx={{
                                    '@media (max-width: 600px)': {
                                        width: '90%',
                                        mx: 'auto'//水平居中
                                    }
                                }}>
                                {/* ... (Filters and Search Input UI remains the same) ... */}
                                <Grid container sx={{
                                    mb: {
                                        xs: '20px',
                                        md: '30px'
                                    }
                                }}>
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
                            </Box>
                            <Grid container justifyContent="center"  >
                                <Box
                                    sx={{
                                        minHeight: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {isNewSearchPending ? (
                                        // 状态 1: 正在加载
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                color: '#9694c2ff',
                                                // 确保加载指示器不会因为其默认边距而导致额外的跳动
                                                m: 0
                                            }}
                                        />
                                    ) : (
                                        // 状态 2: 显示结果
                                        <Typography variant="subtitle1"
                                            sx={{
                                                color: 'grey'
                                            }}>
                                            发现 <span style={{ fontWeight: 'bold' }}>{totalResults}</span> 个作品
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            {/* ----- Artworks Box ------- */}
                            <Grid container justifyContent="center" sx={{
                                mt: 4, minHeight: 600,
                                '@media (max-width: 600px)': {
                                    mt: 0,
                                }
                            }}>
                                {artworks.length === 0 && !isNewSearch && (
                                    <Box sx={{
                                        width: '100%',
                                        minHeight: 300,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        py: 5
                                    }}>
                                        <Typography variant="h6" color="text.secondary">
                                            未找到符合条件的作品 🤔
                                        </Typography>
                                    </Box>
                                )}

                                {/** artoworks */}
                                {artworks?.map((artwork, index) => (
                                    <ArtworkCard
                                        key={index}
                                        artwork={artwork}
                                        querystring={querystring}
                                        saveSearchContext={saveSearchContext}
                                        isNewSearchPending={isNewSearchPending}
                                    />
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
                                            <Button
                                                onClick={manualLoadNextPage}
                                                disabled={isFetchingNextPage}
                                                variant="text" // **关键：改为文本样式**
                                                // color="primary" // 可选：如果默认主题色不够突出，可指定颜色
                                                size="large"
                                                sx={{
                                                    // 移除所有药丸、背景色等样式，只保留链接的样式
                                                    textTransform: 'none', // 保持文字自然大小写
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    py: 0.5,
                                                    px: 2,
                                                    // 增加微交互，例如悬停时添加下划线
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                        backgroundColor: 'transparent'
                                                    }
                                                }}
                                                startIcon={isFetchingNextPage ? <CircularProgress size={20} color="inherit" /> : null}
                                            >
                                                加载更多... (剩余{remainingCount})

                                            </Button>
                                        )}



                                        {/* 状态 4: 已加载全部作品 (没有下一页) */}
                                        {!hasNextPage && artworks.length > 0 && !isFetchingNextPage && (
                                            <Typography variant="subtitle1" color="text.secondary">
                                                已加载全部作品 🖼️
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Container>
            </Container >
        </>
    );
}


const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

//数据加载完成后，淡入效果
const TransitioningOverlay = styled(Box)(({ theme, isLeaving }) => ({
    position: 'absolute',
    paddingTop: 10, //显示header
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: 998, // 在Header之下，header 999
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    //当 isLeaving 为 true 时应用淡出动画
    transition: 'opacity 0.5s ease-out', // 400ms 的平滑过渡
    animation: isLeaving ? `${fadeOut} 0.5s ease-out forwards` : 'none',
    pointerEvents: isLeaving ? 'none' : 'auto', // 动画开始后禁用指针事件
}));

// 3. 具有淡出逻辑的组件
const ThemedLoadingOverlay = ({ isLoading }) => {
    const [controlVisibility, setControlVisibility] = useState(isLoading);

    useEffect(() => {
        if (isLoading) {
            setControlVisibility(true);
        } else {
            // 如果加载结束，设置一个定时器等待淡出动画完成
            const timer = setTimeout(() => { setControlVisibility(false); }, 500);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!controlVisibility) {
        return null; // 动画结束后从 DOM 中移除
    }

    return (
        <TransitioningOverlay isLeaving={!isLoading}>
            {isLoading && (
                <CircularProgress size={60} sx={{ color: '#FFC700' }} />
            )}
        </TransitioningOverlay>
    );
};
// --------------------------------------------------------
// 单个卡片
// --------------------------------------------------------

const ArtworkCard = ({ artwork, querystring, saveSearchContext, isNewSearchPending }) => {

    // 如果正在进行新搜索/筛选，且旧数据不为空，则显示蒙版占位
    const showCardOverlay = isNewSearchPending;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid item xs={12} sm={4} md={4}
            sx={{
                padding: '10px 40px 20px 10px',
                position: 'relative', // 允许绝对定位蒙版
                '@media (max-width: 600px)': {
                    p: 1
                },

            }}
        >
            <Card variant="outlined" sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: 'none'
            }}>

                {/* 新数据加载中时，使用单卡片蒙版 */}
                {showCardOverlay && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)', // 半透明白色蒙版
                            zIndex: 10, // 确保在卡片内容之上
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pointerEvents: 'none', // 允许点击穿透
                        }}
                    >
                        {/* 可以用一个小的加载指示器代替全局大指示器 */}
                        {/* <CircularProgress size={30} sx={{ color: '#9694c2ff', mb: 1 }} /> */}
                    </Box>
                )}

                <Link target="_self" style={{ textDecoration: 'none' }}
                    to={`/vincent/id/${artwork.id}${querystring}`}
                    onClick={() => saveSearchContext(artwork.id)}
                // // 当蒙版显示时，指针事件会被上面的 Box 阻止。这里仅作视觉提醒。
                // style={showCardOverlay ? { pointerEvents: 'none' } : {}} 
                >
                    <CardMedia
                        component="img"
                        image={`https://artworks-1257857866.cos.ap-beijing.myqcloud.com${artwork.primaryImageSmall}`}
                        alt=""
                        sx={{
                            width: '100%',
                            height: { xs: 'auto', sm: '250px' },
                            objectFit: { xs: 'initial', sm: 'contain' },
                            objectPosition: 'center',
                            backgroundColor: '#fdfbfbff',
                            '&:hover': {
                                backgroundColor: '#f0f0f0'
                            },
                            // 蒙版显示时，降低卡片内容本身的亮度/透明度
                            opacity: showCardOverlay ? 0.6 : 1,
                            transition: 'opacity 0.3s',
                        }}
                    />
                </Link>
                <CardContent align="left" sx={{
                    opacity: showCardOverlay ? 0.6 : 1,
                    transition: 'opacity 0.3s',
                    pb: 0
                }}>
                    <Typography sx={{ fontWeight: 400, fontSize: { xs: 14, md: 18 }, textAlign: 'left' }}>
                        {artwork.titleZh || artwork.titleEn}
                    </Typography>
                    <Typography color="text.secondary" variant="body2"
                        sx={{
                            textAlign: 'left',
                            // display: { xs: 'none', md: 'block' },
                        }} >
                        {artwork.displayDate}{artwork.placeOfOrigin ? `, ${artwork.placeOfOrigin}` : ''}
                    </Typography>
                    {artwork.collection && (
                        <Typography variant="body2" color="text.secondary" textAlign='left'>
                            {artwork.collection}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};