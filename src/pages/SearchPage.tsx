import { useRef, useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Box,
    CircularProgress,
    Button,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Link, useLocation, Location } from 'react-router-dom';
import { useArtSearch } from '../hooks/useArtSearch';
import { SearchInput } from './Filters';
import ColorSearchBar from '../components/ColorSearchBar';
import PeriodTimelineFilter from '../components/PeriodBar';
import { keyframes, styled } from '@mui/material/styles';
import '../styles/ArtTableStyles.css';

const STORAGE_KEY = 'currentPageContext';

// ----------------------------
// 类型定义
// ----------------------------
interface ArtworkType {
    id: number;
    primaryImageSmall: string;
    titleZh?: string;
    titleEn?: string;
    displayDateZh?: string;
    placeOfOrigin?: string;
    collection?: string;
    collectionZh?: string;
}

interface ThemedLoadingOverlayProps {
    isLoading: boolean;
}

interface TransitioningOverlayProps {
    isLeaving: boolean;
}

interface ArtworkCardProps {
    artwork: ArtworkType;
    querystring: string;
    saveSearchContext: (id: number | string) => void;
    isNewSearchPending: boolean;
}

// ----------------------------
// ArtSearchPage
// ----------------------------
export default function ArtSearchPage() {
    const location: Location = useLocation();
    const querystring = location.search;

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const {
        query,
        keywordInput,
        setKeywordInput,
        artworks,
        totalResults,
        isConfigLoaded,
        isInitialLoading,
        isNewSearch,
        hasNextPage,
        autoLoadNextPage,
        manualLoadNextPage,
        isFetchingNextPage,
        canAutoLoad,
        remainingCount,
        handleColorSelect,
        handlePeriodChange,
        handleSearchTrigger,
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

    // ----------------------------
    // IntersectionObserver 自动加载
    // ----------------------------
    useEffect(() => {
        if (!loadMoreRef.current || !canAutoLoad || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    autoLoadNextPage();
                }
            },
            {
                rootMargin: '200px 0px',
                threshold: 0.1,
            }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [canAutoLoad, isFetchingNextPage, autoLoadNextPage]);

    const isNewSearchPending = isNewSearch && artworks.length > 0;
    const isReady = isConfigLoaded && !isInitialLoading;

    return (
        <>
            <ThemedLoadingOverlay isLoading={!isReady} />
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
                                            if (e.key === 'Enter') handleSearchTrigger(e);
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
                                    <ColorSearchBar onColorSelect={handleColorSelect} initialColor={query.color} />
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

                                <Grid item xs={12}>
                                    <Box
                                        ref={loadMoreRef}
                                        sx={{
                                            py: 4,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            minHeight:
                                                isFetchingNextPage || (hasNextPage && !isNewSearchPending) ? '150px' : '50px',
                                        }}
                                    >
                                        {isFetchingNextPage && (
                                            <>
                                                <CircularProgress size={40} />
                                                <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
                                                    加载中...
                                                </Typography>
                                            </>
                                        )}
                                        {hasNextPage && !isNewSearchPending && !isFetchingNextPage && (
                                            <Button
                                                onClick={manualLoadNextPage}
                                                disabled={isFetchingNextPage}
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

const TransitioningOverlay = styled(Box)<TransitioningOverlayProps>(({ theme, isLeaving }) => ({
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
// Artwork Card
// ----------------------------
const ArtworkCard: React.FC<ArtworkCardProps> = ({
    artwork,
    querystring,
    saveSearchContext,
    isNewSearchPending,
}) => {
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
                    to={`/vincent/${artwork.id}${querystring}`}
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
                <CardContent sx={{
                    textAlign: 'left',
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
                        {artwork.displayDateZh}{artwork.placeOfOrigin ? `, ${artwork.placeOfOrigin}` : ''}
                    </Typography>
                    {artwork.collection && (
                        <Typography variant="body2" color="text.secondary" textAlign='left'>
                            {artwork.collectionZh}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};