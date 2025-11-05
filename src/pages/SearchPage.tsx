import { useRef, useEffect, useState, useMemo } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress, Button, useMediaQuery, useTheme, } from '@mui/material';
import { Link, useLocation, Location, useSearchParams } from 'react-router-dom';
import { useArtSearch } from '../hooks/useArtSearch';
import { SearchInput } from './Filters';
import ColorSearchBar from '../components/ColorSearchBar';
import PeriodTimelineFilter from '../components/PeriodBar';
import { keyframes, styled } from '@mui/material/styles';
import '../styles/ArtTableStyles.css';
import { Artwork } from '@/types/Artwork';
import { QueryParams } from '@/api/ArtworkApi';
import { QueryKeys } from '@/types/enum';

const STORAGE_KEY = 'currentPageContext';
interface ThemedLoadingOverlayProps {
    isLoading: boolean;
}
interface TransitioningOverlayProps {
    isLeaving: boolean;
}
interface ArtworkCardProps {
    artwork: Artwork;
    querystring: string;
    saveSearchContext: (id: number | string) => void;
    isNewSearchPending: boolean;
}

export default function ArtSearchPage() {
    //这是页面最底部的那个元素，追踪它。一旦它进入用户的视野，加载下一页
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const querystring = useLocation().search;//query string start with '?'

    const [keywordInput, setKeywordInput] = useState('');


    const {
        query,
        artworks,
        totalResults,
        isConfigLoaded,
        isFirstLoad,
        isNewSearch,
        hasNextPage,
        autoLoadNextPage,
        manualLoadNextPage,
        isFetching,
        canAutoLoad,
        remainingCount,
        updateFilter,
    } = useArtSearch();
    

    const saveSearchContext = (currentId: number | string) => {
        const allLoadedIds = artworks.map((item: any) => String(item.id));
        const indexInList = allLoadedIds.findIndex((id) => id === String(currentId));

        const context = {
            idList: allLoadedIds,
            currentIndex: indexInList,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    };

    useEffect(() => {
        // !loadMoreRef.current: DOM未渲染
        if (!loadMoreRef.current || !canAutoLoad || isFetching) return;

        //create Observer
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                autoLoadNextPage();//execute load
            }
        },
            {
                //锚点元素距离浏览器底部还有 200 像素时，就会触发 isIntersecting，开始提前加载。
                rootMargin: '200px 0px',
                threshold: 0.1,
            }
        );
        //监视自动加载下一页的锚点元素
        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [canAutoLoad, isFetching, autoLoadNextPage]);

    const isNewSearchPending = isNewSearch;

    const handleHasImageChange = (key: string) => (event: any) => {
        const value =
            event.target.type === 'checkbox'
                ? event.target.checked
                : event.target.value;
        updateFilter(QueryKeys.HAS_IMAGE, value);
    };


    const handleSearch = (event?: any) => {
        //prevent browser default submit action
        if (event && event.preventDefault) event.preventDefault();
        updateFilter(QueryKeys.SEARCH_TEXT, keywordInput);
    };

    return (
        <>
            {/** first load overlay */}
            {/* <ThemedLoadingOverlay isLoading={isFirstLoad} /> */}
            <Container maxWidth={false} disableGutters>
                <Container
                    maxWidth={false}
                    sx={{
                        width: '90%',
                        mx: 'auto',
                        '@media (max-width: 600px)': { width: '100%', px: '1px' },
                        pt: '60px',
                    }}
                >
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={10}>
                            <Box
                                sx={{
                                    '@media (max-width: 600px)': { width: '90%', mx: 'auto' },
                                }}
                            >
                                <Grid container sx={{ mb: { xs: '20px', md: '30px' } }}>
                                    <SearchInput
                                        value={keywordInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setKeywordInput(e.target.value)
                                        }
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter') handleSearch(e);
                                        }}
                                        onClick={handleSearch}
                                    />
                                </Grid>
                                <Grid container>
                                    <PeriodTimelineFilter
                                        selectedValue={query.period}
                                        updateQueryFilter={updateFilter}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ColorSearchBar
                                        selectedColor={query.color}
                                        updateQueryFilter={updateFilter} />
                                </Grid>
                            </Box>

                            <Grid container justifyContent="center">
                                <Box
                                    sx={{
                                        minHeight: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {isNewSearchPending ? (
                                        <CircularProgress size={20} sx={{ color: '#9694c2ff', m: 0 }} />
                                    ) : (
                                        <Typography variant="subtitle1" sx={{ color: 'grey' }}>
                                            发现{' '}
                                            <span style={{ fontWeight: 'bold' }}>{totalResults}</span> 个作品
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid
                                container
                                justifyContent="center"
                                sx={{ mt: 4, minHeight: 600, '@media (max-width: 600px)': { mt: 0 } }}
                            >
                                {artworks.length === 0 && !isNewSearch && (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            minHeight: 300,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            py: 5,
                                        }}
                                    >
                                        <Typography variant="h6" color="text.secondary">
                                            未找到符合条件的作品 🤔
                                        </Typography>
                                    </Box>
                                )}

                                {artworks?.map((artwork, index) => (
                                    <ArtworkCard
                                        key={index}
                                        artwork={artwork}
                                        querystring={querystring}
                                        saveSearchContext={saveSearchContext}
                                        isNewSearchPending={isNewSearchPending}
                                    />
                                ))}


                                {/** Auto load next page when the DOM element enters the  brower viewport. */}
                                <Grid item xs={12}>
                                    <Box
                                        ref={loadMoreRef} //Anchor element at the bottom of the current page.
                                        sx={{
                                            py: 4,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            minHeight:
                                                isFetching || (hasNextPage && !isNewSearchPending)
                                                    ? '150px'
                                                    : '50px',
                                        }}
                                    >
                                        {isFetching && (
                                            <>
                                                <CircularProgress size={40} />
                                                <Typography
                                                    variant="body1"
                                                    sx={{ ml: 2, color: 'text.secondary' }}
                                                >
                                                    加载中...
                                                </Typography>
                                            </>
                                        )}
                                        {hasNextPage && !isNewSearchPending && !isFetching && (
                                            <Button
                                                onClick={manualLoadNextPage}
                                                disabled={isFetching}
                                                variant="text"
                                                size="large"
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    py: 0.5,
                                                    px: 2,
                                                    '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
                                                }}
                                            >
                                                加载更多... (剩余{remainingCount})
                                            </Button>
                                        )}
                                        {!hasNextPage && artworks.length > 0 && !isFetching && (
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
            </Container>
        </>
    );
}

// ----------------------------
// Loading Overlay
// ----------------------------
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const TransitioningOverlay = styled(Box)<TransitioningOverlayProps>(({ isLeaving }) => ({
    position: 'absolute',
    paddingTop: 10,
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: 998,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    transition: 'opacity 0.5s ease-out',
    animation: isLeaving ? `${fadeOut} 0.5s ease-out forwards` : 'none',
    pointerEvents: isLeaving ? 'none' : 'auto',
}));

const ThemedLoadingOverlay: React.FC<ThemedLoadingOverlayProps> = ({ isLoading }) => {
    const [controlVisibility, setControlVisibility] = useState(isLoading);

    useEffect(() => {
        if (isLoading) {
            setControlVisibility(true);
        } else {
            const timer = setTimeout(() => setControlVisibility(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!controlVisibility) return null;

    return (
        <TransitioningOverlay isLeaving={!isLoading}>
            {isLoading && <CircularProgress size={60} sx={{ color: '#FFC700' }} />}
        </TransitioningOverlay>
    );
};

// ----------------------------
// Single Artwork Card
// ----------------------------
const ArtworkCard: React.FC<ArtworkCardProps> = ({
    artwork,
    querystring, //pass to DetailPage url
    saveSearchContext,
    isNewSearchPending,
}) => {
    const showCardOverlay = isNewSearchPending;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const HOVER_OVERLAY_CLASS = 'hover-ripple-overlay';
    // 1. 定义蒙版的透明度 (Alpha)。
    const HOVER_ALPHA = 0.15;
    const hoverOverlayColor = `rgba(${artwork.r}, ${artwork.g}, ${artwork.b}, ${HOVER_ALPHA})`;
    return (
        <Grid
            item xs={12} sm={4} md={4}
            sx={{
                padding: '20px',
                position: 'relative',
                '@media (max-width: 600px)': { p: 1 },
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none',
                    position: 'relative',
                    '&:hover': {
                        cursor: 'pointer',
                        // 1. 悬停覆盖层展开并显示
                        [`& .${HOVER_OVERLAY_CLASS}`]: {
                            transform: 'scale(1)',
                            opacity: 1,
                        },
                        // 2. 图片和文字透明度降低（如果您需要这个效果）
                        '& .MuiCardMedia-root, & .MuiCardContent-root': {
                            opacity: 0.99,
                            transition: 'opacity 0.5s',
                        },
                    },
                }}
            >
                {/** 加载中动画层 */}
                {showCardOverlay && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            zIndex: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pointerEvents: 'none',
                        }}
                    />
                )}
                {/* 2.悬停动画层 (Hover Overlay) 灵感来自YouTube PC*/}
                {/* 确保 zIndex 小于 Loading Overlay (10) 并且高于图片/文字 (通常是 0) */}
                <Box
                    className={HOVER_OVERLAY_CLASS}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: hoverOverlayColor, // 使用作品主色调作为悬停颜色（会加深图片的饱和度)
                        zIndex: 1, // 确保在图片和文字之上，但在加载蒙版之下
                        pointerEvents: 'none',

                        //实现扩散蒙版效果
                        transform: 'scale(0.95)',//悬停蒙版放大初始值,0.9-1
                        opacity: 0,
                        // 动画过渡
                        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                    }}
                />
                <Link
                    target="_self"
                    style={{ textDecoration: 'none' }}
                    to={`/vincent/${artwork.id}${querystring}`}
                    onClick={() => saveSearchContext(artwork.id)}
                >
                    <CardMedia
                        component="img"
                        image={`https://artworks-1257857866.cos.ap-beijing.myqcloud.com${artwork.primaryImageSmall}`}
                        alt=""
                        sx={{
                            width: '100%',
                            height: { xs: 'auto', sm: '250px', md: '300px' }, //Image Box size
                            objectFit: { xs: 'initial', sm: 'contain' },
                            objectPosition: 'center',
                            backgroundColor: '#fdfbfbff',
                            // '&:hover': { backgroundColor: '#f0f0f0' },
                            opacity: showCardOverlay ? 0.6 : 1,
                            transition: 'opacity 0.3s',
                        }}
                    />
                    <CardContent
                        sx={{
                            textAlign: 'left',
                            opacity: showCardOverlay ? 0.6 : 1,
                            transition: 'opacity 0.3s',
                            pb: 0,
                        }}
                    >
                        <Typography sx={{
                            fontWeight: 400,
                            fontSize: { xs: 14, md: 18 },
                            textAlign: 'left',
                            color: 'black'
                        }}>
                            {artwork.titleZh || artwork.titleEn}
                        </Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'left' }}>
                            {artwork.displayDateZh}
                            {artwork.placeOfOrigin ? `, ${artwork.placeOfOrigin}` : ''}
                        </Typography>
                        {artwork.collection && (
                            <Typography variant="body2" color="text.secondary" textAlign="left">
                                {artwork.collectionZh}
                            </Typography>
                        )}
                    </CardContent>
                </Link>

            </Card>
        </Grid>
    );
};
