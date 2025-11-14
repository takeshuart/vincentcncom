// src/pages/HomePage.tsx
import { Container, Box, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SurpriseBox from '../components/SurpriseBox';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSurpriseArt } from '../api/ArtworkApi';
import { Artwork } from '../types/Artwork'


export default function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: surpriseArtwork,
    isLoading: isSurpriseLoading,
    isFetching,
    isError,
    refetch: refetchSurpriseArt
  } = useQuery<Artwork>({
    queryKey: ['surpriseArtwork'],
    queryFn: fetchSurpriseArt,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const handleStartExplore = () => {
    navigate('/search');
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ bgcolor: '#d8dbf0ff', pt: 10 }}>
      <Container maxWidth={false}
        sx={{
          width: '100%',
          height: '100vh',
          px: { xs: 1, sm: 3, md: 30 }
        }}
      >
        <SurpriseBox
          artwork={surpriseArtwork ?? null}
          isSurpriseLoading={isFetching}
          fetchSurpriseArtWork={async () => { await refetchSurpriseArt(); }}

        />

        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleStartExplore}
            disabled={isSurpriseLoading}
            sx={{
              padding: { xs: '10px 20px', md: '15px 40px' },
              fontSize: '1.2rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#FFC700',
              color: '#212121',
              '&:hover': {
                backgroundColor: '#FFA500',
                boxShadow: '0 6px 15px rgba(255, 199, 0, 0.6)',
              },
            }}
          >
            {isSurpriseLoading ? <CircularProgress size={24} color="inherit" /> : '开始探索'}
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            点击进入完整的作品检索和筛选目录
          </Typography>
        </Box>
      </Container>
    </Container>
  );
}
