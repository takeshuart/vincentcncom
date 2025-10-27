import { useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, useMediaQuery, List, ListItem, ListItemButton, CircularProgress } from '@mui/material';
import 'react-photo-view/dist/react-photo-view.css';
import useArtworkDetails from '../hooks/useArtworkDetails';
import ArtworkImage from '../components/ArtworkImage';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ArtworkExhibition, ArtworkLetters, ArtworkOverview } from '../components/ArtworkSections';
import { ArrowForwardIos } from '@mui/icons-material';
import useSearchContextNavigation from '../hooks/useSearchContextNavigation';

const titleStyle = {
    fontWeight: '600',
    lineHeight: '2',
    fontFamily: 'Microsoft YaHei',
    fontSize: { xs: 18, md: 18 },
    color: '#333'
}

const DetailsPage = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const { id } = useParams();//current artwork id from url path
    const {
        artwork,
        extLinks,
        activeSection,
        lettersData,
        isLoadingLetters,
        isLoadingArtwork,
        sections,
        setActiveSection,
    } = useArtworkDetails(id);

    const { canGoNext, canGoPrev, goToNext, goToPrev } = useSearchContextNavigation(id);

    const renderContent = () => {
        if (!artwork) return null;

        switch (activeSection) {
            case 'overview':
                return <ArtworkOverview artwork={artwork} extLinks={extLinks} />;
            case 'letters':
                return <ArtworkLetters isLoading={isLoadingLetters} lettersData={lettersData} />;
            case 'exhibition':
                return <ArtworkExhibition exhibitions={artwork.exhibitionHistory} />;
            case 'provenance':
                return <Typography>{artwork.provenance || '暂无作品出处信息。'}</Typography>;
            case 'references':
                return <Typography>{artwork.references || '暂无参考文献。'}</Typography>;
            default:
                return null;
        }
    };

    if (isLoadingArtwork) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!artwork) {
        return <Box sx={{ p: 5, textAlign: 'center' }}>未能加载作品详情。</Box>;
    }


    return (
        <Grid container justifyContent="center" sx={{
            paddingTop: 10, 
        }}>
            {/* Image Box */}
            <Box
                sx={{
                    position: 'relative', // <-- 关键：成为绝对定位按钮的参照物
                    width: '100%', display: 'flex', justifyContent: 'center',
                    // maxWidth: isMobile ? '100%' : '800px', // 移动端允许宽度撑满
                    height: isMobile ? '80vh' : 650, //
                }}
            >
                <ArtworkImage src={artwork.primaryImageMedium} isMobile={isMobile} />

                {canGoPrev && (
                    <Box // left arrow
                        onClick={goToPrev}
                        sx={{ ...NAV_BUTTON_STYLE, left: '5%' }}
                    >
                        <ArrowBackIosIcon fontSize="small" sx={{ ...ARROWICON }} />
                    </Box>
                )}

                {canGoNext && (
                    <Box // right arrow
                        onClick={goToNext}
                        sx={{ ...NAV_BUTTON_STYLE, right: '5%' }}
                    >
                        <ArrowForwardIos fontSize="small" sx={{ ...ARROWICON }} />
                    </Box>
                )}
            </Box>

            {/* Title Box */}
            <Grid container justifyContent="center">
                <Grid item xs={10} sm={8} md={6}>
                    <Divider sx={{ my: 3 }} />
                    <Typography sx={titleStyle}>{artwork.titleZh || artwork.titleEn}</Typography>
                    <Typography color='#999595ff' fontWeight='600' sx={{ mb: 2, fontSize: 14 }}>{artwork.displayDate}</Typography>
                </Grid>
            </Grid>

            {/* Short Description Box */}
            {
                artwork.shortDesc && (
                    <Grid container justifyContent={'center'}>
                        <Grid item xs={10} sm={8} md={6}>
                            <Box sx={{ mb: 3, mt: 3 }}>
                                <Typography>{artwork.shortDesc}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                )
            }

            {/*  More information sections  */}
            <Grid container justifyContent="center" sx={{ mt: 5, mb: 10 }}>
                <Grid item xs={10} sm={8} md={8}>
                    <Grid container>
                        {/* 1. 左侧导航目录 (在移动端隐藏) */}
                        {!isMobile && (
                            <Grid item md={2} sx={{ pr: 3, borderRight: '1px solid #eee' }}>
                                <List component="nav" sx={{ p: 0 }}>
                                    {sections.map((section) => (
                                        <ListItem key={section.id} disablePadding>
                                            <ListItemButton
                                                selected={activeSection === section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                sx={{
                                                    borderRadius: '4px',
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#f0f0f0',
                                                        borderRight: '3px solid #C93636',
                                                        color: '#C93636',
                                                        fontWeight: 'bold',
                                                        '&:hover': {
                                                            backgroundColor: '#e0e0e0',
                                                        }
                                                    },
                                                    py: 1,
                                                }}
                                            >
                                                <Typography variant="body1">{section.label}</Typography>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        )}

                        {/* 2. 右侧内容显示区域 */}
                        <Grid item xs={12} md={10} sx={{ pl: isMobile ? 0 : 3 }}>
                            <Box sx={{ minHeight: '400px' }}>
                                {renderContent()}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Footer */}
            <Grid container mt='50px' justifyContent='center' sx={{ backgroundColor: '#fafafa', height: '100px', width: '100%', py: 3 }}>
                <Typography alignContent='center'>梵·高档案馆 2024</Typography>
            </Grid>
        </Grid >
    );
};

export default DetailsPage;


const NAV_BUTTON_STYLE = {
    position: 'absolute', //相对父容器 绝对定位
    top: '50%', // 垂直居中
    transform: 'translateY(-50%)',
    zIndex: 100,
    cursor: 'pointer',

    width: '60px',
    height: '60px', // 强制高度，使其接近圆形
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // 带透明度的白色背景
    borderRadius: '50%', // 确保圆形
    ml: 2,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 3,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: 4
    },
    '@media (max-width:600px)': {
        width: '40px',
        height: '40px',
        ml: 1,
        boxShadow: 1,
        '&:hover': {
            boxShadow: 2,
        },
    },
};

const ARROWICON = {
    ml: 0.5,
    color: 'text.secondary',
    color: '#31d847ff'
}