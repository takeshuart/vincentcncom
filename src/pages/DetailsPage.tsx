import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
  Skeleton
} from '@mui/material';
import 'react-photo-view/dist/react-photo-view.css';
import useArtworkDetails from '../hooks/useArtworkDetails';
import ArtworkImage from '../components/ArtworkImage';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ArtworkExhibition, ArtworkLetters, ArtworkOverview } from '../components/ArtworkSections';
import { ArrowForwardIos } from '@mui/icons-material';
import useSearchContextNavigation from '../hooks/useSearchContextNavigation';

interface Section {
  id: string;
  label: string;
}

const titleStyle = {
  fontWeight: 600,
  lineHeight: 2,
  fontFamily: 'Microsoft YaHei',
  fontSize: { xs: 18, md: 18 },
  color: '#333'
};

const DetailsPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { id } = useParams<{ id: string }>();
  const artworkId: string = id!;
  const {
    artwork,
    extLinks,
    activeSection,
    lettersData,
    isLoadingLetters,
    isLoadingArtwork,
    sections,
    setActiveSection
  } = useArtworkDetails(artworkId);

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

  // 如果加载完成但 artwork 为空，说明加载失败
  if (!isLoadingArtwork && !artwork) {
    return <Box sx={{ p: 5, textAlign: 'center' }}>未能加载作品详情。</Box>;
  }

  // 页面结构始终存在，只根据加载状态切换内容
  return (
    <Grid container justifyContent="center" sx={{ paddingTop: 10 }}>
      {/* 图片区域 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          height: isMobile ? '80vh' : 650,
          backgroundColor: '#fafafa'
        }}
      >
        {isLoadingArtwork ? (
          <Skeleton
            variant="rectangular"
            width={isMobile ? '100%' : 600}
            height={isMobile ? '80vh' : 650}
            sx={{ borderRadius: 2 }}
          />
        ) : (
          <ArtworkImage src={artwork?.primaryImageMedium} isMobile={isMobile} />
        )}

        {!isLoadingArtwork && canGoPrev && (
          <Box onClick={goToPrev} sx={{ ...NAV_BUTTON_STYLE, left: '5%' }}>
            <ArrowBackIosIcon fontSize="small" sx={{ ...ARROWICON }} />
          </Box>
        )}
        {!isLoadingArtwork && canGoNext && (
          <Box onClick={goToNext} sx={{ ...NAV_BUTTON_STYLE, right: '5%' }}>
            <ArrowForwardIos fontSize="small" sx={{ ...ARROWICON }} />
          </Box>
        )}
      </Box>

      {/* 标题 */}
      <Grid container justifyContent="center">
        <Grid item xs={10} sm={8} md={6}>
          <Divider sx={{ my: 3 }} />
          {isLoadingArtwork ? (
            <>
              <Skeleton width="60%" height={30} />
              <Skeleton width="40%" height={20} />
            </>
          ) : (
            <>
              <Typography sx={titleStyle}>{artwork?.titleZh || artwork?.titleEn}</Typography>
              <Typography color="#999595ff" fontWeight={600} sx={{ mb: 2, fontSize: 14 }}>
                {artwork?.displayDate}
              </Typography>
            </>
          )}
        </Grid>
      </Grid>

      {/* 简介 */}
      <Grid container justifyContent="center">
        <Grid item xs={10} sm={8} md={6}>
          {isLoadingArtwork ? (
            <>
              <Skeleton width="100%" height={20} />
              <Skeleton width="90%" height={20} />
              <Skeleton width="80%" height={20} />
            </>
          ) : (
            artwork?.shortDesc && (
              <Box sx={{ mb: 3, mt: 3 }}>
                <Typography>{artwork.shortDesc}</Typography>
              </Box>
            )
          )}
        </Grid>
      </Grid>

      {/* 内容区 */}
      <Grid container justifyContent="center" sx={{ mt: 5, mb: 10 }}>
        <Grid item xs={10} sm={8} md={8}>
          <Grid container>
            {!isMobile && (
              <Grid item md={2} sx={{ pr: 3, borderRight: '1px solid #eee' }}>
                {isLoadingArtwork ? (
                  <List sx={{ p: 0 }}>
                    {[...Array(4)].map((_, i) => (
                      <ListItem key={i}>
                        <Skeleton width="80%" height={24} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <List component="nav" sx={{ p: 0 }}>
                    {sections.map((section: Section) => (
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
                              '&:hover': { backgroundColor: '#e0e0e0' }
                            },
                            py: 1
                          }}
                        >
                          <Typography variant="body1">{section.label}</Typography>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>
            )}

            <Grid item xs={12} md={10} sx={{ pl: isMobile ? 0 : 3 }}>
              <Box sx={{ minHeight: '400px' }}>
                {isLoadingArtwork ? (
                  <>
                    <Skeleton width="100%" height={30} />
                    <Skeleton width="90%" height={20} />
                    <Skeleton width="95%" height={20} />
                    <Skeleton width="85%" height={20} />
                  </>
                ) : (
                  renderContent()
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Footer */}
      <Grid
        container
        mt="50px"
        justifyContent="center"
        sx={{ backgroundColor: '#fafafa', height: '100px', width: '100%', py: 3 }}
      >
        <Typography alignContent="center">梵·高档案馆 2024</Typography>
      </Grid>
    </Grid>
  );
};

export default DetailsPage;

const NAV_BUTTON_STYLE = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 100,
  cursor: 'pointer',
  width: '60px',
  height: '60px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '50%',
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
    '&:hover': { boxShadow: 2 }
  }
};

const ARROWICON = {
  ml: 0.5,
  color: '#31d847ff'
};
