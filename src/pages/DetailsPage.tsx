import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Divider, Grid, Typography, useMediaQuery, List, ListItem, ListItemButton, Skeleton, IconButton } from '@mui/material';
import 'react-photo-view/dist/react-photo-view.css';
import useArtworkDetails from '../hooks/useArtworkDetails';
import ArtworkImage from '../components/ArtworkImage';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ArtworkExhibition, ArtworkLetters, ArtworkOverview } from '../components/ArtworkSections';
import { ArrowForwardIos } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useSearchContextNavigation from '../hooks/useSearchContextNavigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '@/hooks/useFavorites';

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
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const [isFavorited, setIsFavorited] = useState<boolean | undefined>(artwork?.isFavorited);


  const { canGoNext, canGoPrev, goToNext, goToPrev } = useSearchContextNavigation(id);


  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }


    //optimistic UI: Update the local status first and do not wait for the server's result
    setIsFavorited((prev) => !prev);

    try {
      const variables = { userId: user.userId as string, artworkId: artworkId as string };
      if (isFavorited) {
        await removeFavoriteMutation.mutateAsync(variables);
      } else {
        await addFavoriteMutation.mutateAsync(variables);
      }

    } catch (error) {
      //rollback 
      setIsFavorited((prev) => !prev);
      const errorMessage = isFavorited ? '取消收藏失败' : '收藏失败';
      console.error(errorMessage, error);
      toast.error(errorMessage);
    }
  };

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

  if (!isLoadingArtwork && !artwork) {
    return <Box sx={{ p: 5, textAlign: 'center' }}>未能加载作品详情。</Box>;
  }

  const renderFavoriteButton = () => {
    // const isMutating = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

    if (isLoadingArtwork) {
      return <Skeleton variant="circular" width={40} height={40} sx={{ ml: 1 }} />;
    }

    const IconComponent = isFavorited ? FavoriteIcon : FavoriteBorderIcon;
    const tooltipText = isFavorited ? '取消收藏' : (user ? '收藏' : '登录后收藏');

    return (
      <IconButton
        onClick={handleToggleFavorite}
        // disabled={isMutating}
        aria-label={tooltipText}
        sx={{ color: '#C93636', ml: 1 }}
      >
        <IconComponent sx={{ fontSize: 30 }} />
      </IconButton>
    );
  };
  return (
    <Grid container justifyContent="center" sx={{ paddingTop: 10 }}>
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
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box flexGrow={1}>
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
            </Box>

            {!isLoadingArtwork && renderFavoriteButton()}
          </Box>
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
