import { useRef, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { useArtSearch } from '../hooks/useArtSearch';

import '../styles/ArtTableStyles.css';
import ColorSearchBar from '../components/ColorSearchBar';
import PeriodTimelineFilter from '../components/PeriodBar';
import { SearchInput } from './Filters';

const STORAGE_KEY = 'currentPageContext';

export default function ArtSearchPage() {
    const isDesktop = useMediaQuery('(min-width:600px)');
    //a URL querystring, start with '?'
    const querystring = useLocation().search;
    // 【修改 1.3】创建一个引用，用于观察列表末尾的元素
    const loadMoreRef = useRef(null);

    // 1. Call the custom hook and destructure all necessary values
    const {
        query, keywordInput, setKeywordInput, artworks, 
        totalResults, isLoading, isConfigLoaded, configData,
        handleFilterChange, handleColorSelect, handlePeriodChange,
        handleSearchTrigger, 
        hasNextPage, fetchNextPage, isFetchingNextPage,
    } = useArtSearch();

    /**
     * execute  while click artwork in searchPage
     * 为实现详情页的上一个/下一个功能，需存储当前页的id列表。
     * 不支持跨页：如果展示下一页的作品，用户返回之前的列表页时，会造成不一致。
     * 跨页查询的实现逻辑也会更复杂，暂不考虑
     */
    const saveSearchContext = (currentId) => {
        const allLoadedIds = artworks.map(item => String(item.id)); // 【修改 1.5】列表改为所有已加载的作品
        const indexInPage = allLoadedIds.findIndex(id => id === String(currentId));
        //Todo 改用ts 定义类型
        const context = {
            idList: allLoadedIds,
            currentIndex: indexInPage,
        };
        //
        console.log(JSON.stringify(context))
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    }
    useEffect(() => {
        // 如果没有下一页，或者当前正在加载下一页，则无需设置观察者
        if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                // 当目标元素进入视口时
                if (entries[0].isIntersecting) {
                    // 调用加载下一页的函数
                    fetchNextPage();
                }
            },
            {
                // 提前触发加载，提供 200px 的裕度
                rootMargin: '200px 0px',
                threshold: 0.1,
            }
        );

        // 开始观察目标元素
        observer.observe(loadMoreRef.current);

        // 清理函数
        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };

    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (!isConfigLoaded) {
        // Option 1: Display a simple full-page loader until config is ready
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={80} />
            </Container>
        );
    }
    // 【修改 1.7】 新搜索/筛选时的初始加载
    if (isLoading && artworks.length === 0) {
        return (
            <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
                <CircularProgress size={100} />
            </Container>
        );
    }

    // The rest is pure rendering logic, significantly cleaner
    return (
        <Container maxWidth={false} disableGutters >
            <Container maxWidth={false} sx={{ width: '90%', mx: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={1}></Grid>
                    <Grid item xs={12} md={10}>
                        <Box >
                            {/* -----Filter Box------ */}
                            <Grid container sx={{ margin: '40px 1px 40px 1px' }}>
                                <SearchInput
                                    // Binds to the local input state
                                    value={keywordInput}
                                    // Updates local input state on every keystroke
                                    onChange={(event) => setKeywordInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleSearchTrigger(event);
                                        }
                                    }}
                                    // search Icon
                                    onClick={handleSearchTrigger}
                                />
                            </Grid>
                            {/** filters */}
                            {/* <Grid container >
                                <FilterAccordion
                                    // Use unified handlers
                                    changeHandler={handleFilterChange}
                                    // Pass current selected values
                                    genreSelected={query.genre}
                                    periodSelected={query.period}
                                    techniqueSelected={query.technique}
                                    hasImage={query.hasImage}

                                    configData={configData}
                                />
                            </Grid> */}
                            <Grid container>

                                <PeriodTimelineFilter
                                    selectedValue={query.period}
                                    onSelectionChange={handlePeriodChange}
                                />
                            </Grid>
                            {/* Color search */}
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
                                {isLoading ? (
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4, minHeight: 700, }}>
                                        <CircularProgress size={100} />
                                    </Box>
                                ) : (
                                    artworks?.map((artwork, index) => (
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
                                    )))}

                                <Grid item xs={12}>
                                    <Box ref={loadMoreRef} sx={{ py: 4, display: 'flex', justifyContent: 'center', minHeight: '50px' }}>
                                        {/* 正在加载下一页 */}
                                        {isFetchingNextPage && (
                                            <CircularProgress size={40} />
                                        )}
                                        {/* 已加载全部作品 (只有在有作品且没有下一页，并且不在加载中才显示) */}
                                        {!hasNextPage && artworks.length > 0 && !isLoading && !isFetchingNextPage && (
                                            <Typography variant="subtitle1" color="text.secondary">
                                                已加载全部作品 🖼️
                                            </Typography>
                                        )}
                                        {/* 未找到作品 */}
                                        {artworks.length === 0 && !isLoading && (
                                            <Typography variant="h6" color="text.secondary">
                                                未找到符合条件的作品 🤔
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