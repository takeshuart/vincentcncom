import { useEffect, useState } from 'react';
import { Container, Box, Button, CircularProgress, Typography } from '@mui/material';
import SurprisemeBlock from '../components/SurprisemeBlock';
import { fetchSurpriseArt } from '../api/ArtworkApi';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    const [surpriseArtwork, setSurpriseArtwork] = useState(null);
    const [isSurpriseLoading, setIsSurpriseLoading] = useState(true);

    useEffect(() => {
        fetchSurpriseArtWork();
    }, []);

    const fetchSurpriseArtWork = async () => {
        setIsSurpriseLoading(true);
        setSurpriseArtwork(null);
        try {
            const surpriseData = await fetchSurpriseArt();
            setSurpriseArtwork(surpriseData);
        } catch (error) {
            console.error('Error fetching surprise artwork', error);
        } finally {
            setIsSurpriseLoading(false);
        }
    };

    const handleStartExplore = () => {
        navigate('/vincent/search');
    };

    return (
        <Container maxWidth={false} disableGutters sx={{ bgcolor: '#d8dbf0ff'}}>
            <Container maxWidth={false}
                sx={{
                    width: '90%', mx: 'auto',
                    paddingTop: 5 //与Surprise Box 保持距离
                }} >


                {/* 1. Surpriseme Block */}

                <SurprisemeBlock
                    surpriseArtwork={surpriseArtwork}
                    isSurpriseLoading={isSurpriseLoading}
                    fetchSurpriseArtWork={fetchSurpriseArtWork}
                />

                {/** enter Search page */}
                <Box sx={{
                    marginTop: 0,
                    marginBottom: 0,
                    textAlign: 'center',
                    padding: 4,
                    width: '100%'
                }}>
                    {/** CTA(Call to action)按钮 */}
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleStartExplore}
                        disabled={isSurpriseLoading}
                        sx={{
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#FFC700',
                            color: '#212121',//font color
                            '&:hover': {
                                backgroundColor: '#FFA500', // 悬停时略微变深
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