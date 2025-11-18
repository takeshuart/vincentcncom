import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Snackbar, Alert, Box, Divider, Grid, Typography,
  useMediaQuery, List, ListItem, ListItemButton, Skeleton, IconButton,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isAddAction, setIsAddAction] = useState(false);

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const artworkId: string = id!;
  const {
    artwork,
    activeSection,
    lettersData,
    isLoadingLetters,
    isLoadingArtwork,
    sections,
    setActiveSection
  } = useArtworkDetails(artworkId);

  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    const apiFavoritedStatus = artwork?.isFavorited ?? false;

    if (!isLoadingArtwork && artworkId) {
      setIsFavorited(apiFavoritedStatus);
    }

  }, [artwork, artworkId, isLoadingArtwork]);

  const { canGoNext, canGoPrev, goToNext, goToPrev } = useSearchContextNavigation(id);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return; // 阻止点击外部关闭
    }
    setSnackbarOpen(false);
  };

  const handleActionClick = () => {
    setSnackbarOpen(false);
    navigate('/favorites');
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const previousFavoritedStatus = isFavorited;
    //optimistic UI: Update the local status first and do not wait for the server's result
    setIsFavorited((prev) => !prev);
    setSnackbarOpen(false);//close previous snackbar

    try {
      const variables = { userId: user.userId as string, artworkId: artworkId as string };
      if (previousFavoritedStatus) {
        await removeFavoriteMutation.mutateAsync(variables);
        setSnackbarMessage('已从“我的收藏”中移除!');
        setIsAddAction(false);
        setSnackbarOpen(true);
      } else {
        await addFavoriteMutation.mutateAsync(variables);
        setSnackbarMessage('添加收藏成功!');
        setIsAddAction(true);
        setSnackbarOpen(true);
        setTimeout(() => { setSnackbarOpen(false); }, 5000);//auto close after 5s
      }

    } catch (error) {
      //rollback 
      setIsFavorited(previousFavoritedStatus);
      const errorMessage = isFavorited ? '取消收藏失败' : '收藏失败';
      console.error(errorMessage, error);
      setSnackbarMessage(errorMessage);
      setIsAddAction(false);
      setSnackbarOpen(true);
    }
  };

  const renderContent = () => {
    if (!artwork) return null;
    switch (activeSection) {
      case 'overview':
        return <ArtworkOverview artwork={artwork} />;
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
  const renderSnackbarContent = () => {
    if (isAddAction) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fab027ff',
            padding: '8px 16px',
            borderRadius: '4px',
            boxShadow: 3,
            color: 'white'
          }}
        >
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {snackbarMessage}
          </Typography>
          <Button
            color="inherit"
            size="small"
            onClick={handleActionClick}
            sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
          >
            查看
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    } else {
      return (
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes('失败') ? "error" : "success"}
          variant="filled"
          sx={{ backgroundColor: snackbarMessage.includes('移除') ? '#388e3c' : undefined }}
        >
          {snackbarMessage}
        </Alert>
      );
    }
  };

  //snackbar position
  const anchorOrigin = isMobile
    ? { vertical: 'center' as const, horizontal: 'center' as const } 
    : { vertical: 'bottom' as const, horizontal: 'center' as const }; 

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

        {/** pre/next Button */}
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
            <Grid
              item
              xs={12}
              md={2}
              sx={{
                pr: { xs: 0, md: 3 },
                borderRight: { xs: 'none', md: '1px solid #eee' },
                mb: { xs: 3, md: 0 }
              }}
            >
              {isLoadingArtwork ? (
                <List sx={{ p: 0 }}>
                  {[...Array(4)].map((_, i) => (
                    <ListItem key={i}>
                      <Skeleton width="80%" height={24} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box
                  component="nav"
                  sx={{
                    p: 0,
                    display: { xs: 'flex', md: 'block' },
                    overflowX: { xs: 'auto', md: 'hidden' }, //slide on mobile
                    whiteSpace: { xs: 'nowrap', md: 'normal' },
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {sections.map((section: Section) => (
                    <ListItem
                      key={section.id}
                      disablePadding
                      sx={{
                        display: 'inline-block',
                        minWidth: 'fit-content',
                        mr: { xs: 1, md: 0 }
                      }}
                    >
                      <ListItemButton
                        selected={activeSection === section.id}
                        onClick={() => setActiveSection(section.id)}
                        sx={{
                          borderRadius: '4px',
                          '&.Mui-selected': {
                            backgroundColor: '#f0f0f0',
                            borderRight: { xs: 'none', md: '3px solid #C93636' },
                            borderBottom: { xs: '3px solid #C93636', md: 'none' },
                            color: '#C93636',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#e0e0e0' }
                          },
                          py: { xs: 0.5, md: 1 },
                          px: { xs: 2, md: 1 }
                        }}
                      >
                        <Typography variant="body1">{section.label}</Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              md={10}
              sx={{ pl: { xs: 0, md: 3 } }}
            >
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={isAddAction ? null : 3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={anchorOrigin}
        sx={{
          top: isMobile ? 'auto' : '150px', 
          right: isMobile ? 'auto' : '10%',
        }}
      >
        {renderSnackbarContent()}
      </Snackbar>

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
