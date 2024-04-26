import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArtworkById } from './ArtworkApi';
import { Box, Divider, Grid, Link, Typography, useMediaQuery} from '@mui/material';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const ArtworkDetailPage = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const { id } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [extLinks, setExtLinks] = useState('');
    const navigate = useNavigate();



    useEffect(() => {
        console.log('fetchartwork')
        const fetchArtwork = async () => {
            try {
                //TODO 不暴露api，返回渲染后的html
                const artwork = await fetchArtworkById(id);
                if (artwork.extLinks) {
                    setExtLinks(JSON.parse(artwork.extLinks))
                }
                if (artwork.primaryImageLarge) {
                    artwork.primaryImageLarge = `/all-collections/${artwork.primaryImageLarge}`
                } else {
                    artwork.primaryImageLarge = `https://www.pubhist.com${artwork.primaryImageSmall}`
                }

                setArtwork(artwork);

            } catch (error) {
                console.error('Error fetching artwork data', error);
            }
        };

        fetchArtwork();

    }, []);

    const goBack = () => {
        navigate(-1);
    }


    return (
        <Grid container justifyContent="center">
            <Grid container sx={{ margin: '20px 10px 20px 10px' }} >
                <Grid item md={2} >
                    <Box display="flex" alignItems="center" onClick={goBack} style={{ cursor: 'pointer' }}>
                        <ArrowBackIcon />
                        <Typography
                            variant='h6'
                            style={{ display: 'inline', letterSpacing: '2px', marginLeft: '20px' }}
                        >
                            <strong>梵·高档案馆</strong>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            {artwork && (<>
                <Box justifyContent="center" sx={{ marginTop: '50px', marginBottom: '30px' }}>
                    <PhotoProvider
                        maskOpacity={isMobile ? 0.9 : 0.1}
                        bannerVisible={false}
                        speed={() => (isMobile ? 500 : 1500)}>

                        <PhotoView src={artwork.primaryImageLarge} >
                            <img
                                src={`https://www.pubhist.com${artwork.primaryImageSmall}`}
                                alt=""
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: isMobile ? '200px' : '500px',
                                }}
                            />
                        </PhotoView>
                    </PhotoProvider>
                </Box>
                <Grid container justifyContent="center" sx={{ marginBottom: '10px' }}>
                    <Grid item md={6}>
                        <Divider />
                    </Grid>
                </Grid>
                <Grid container justifyContent="center">
                    <Grid item xs={10} sm={6} md={6}>
                        <Typography sx={titleStyle}>{artwork.titleZh || artwork.titleEn}</Typography>
                        <Typography sx={{ fontFamily: 'Microsoft YaHei', lineHeight: '2.5', fontSize: { xs: 18, md: 18 } }}>详情</Typography>
                        <Typography sx={typographyStyle}><strong>原标题：</strong>{artwork.titleEn}</Typography>
                        <Typography sx={typographyStyle}><strong>创作时间：</strong>{artwork.displayDate}</Typography>
                        <Typography sx={typographyStyle}><strong>创作地点：</strong>{artwork.placeOfOrigin}</Typography>
                        <Typography sx={typographyStyle}><strong>收藏地：</strong>{artwork.collection}</Typography>
                        <Typography sx={typographyStyle}><strong>尺寸：</strong>{artwork.dimension}</Typography>
                        <Typography sx={typographyStyle}><strong>材料：</strong>{artwork.material}</Typography>
                        {extLinks && Object.keys(extLinks).length > 0 && (
                            <>
                                <Typography sx={{ ...typographyStyle, display: 'inline' }}><strong>外部链接：</strong></Typography>
                                {Object.keys(extLinks).length === 1 ? (
                                    <Link href={extLinks[0].url} target="_self" rel="noopener noreferrer">
                                        <Typography sx={{ ...typographyStyle, display: 'inline' }}>{extLinks[0].linkName}</Typography>
                                    </Link>
                                ) : (
                                    <ul>
                                        {Object.keys(extLinks).map((key, index) => (
                                            <li key={index}>
                                                <Link href={extLinks[key].url} target="_self" rel="noopener noreferrer">
                                                    <Typography sx={typographyStyle}>{extLinks[key].linkName}</Typography>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}

                    </Grid>
                </Grid>

            </>
            )}
        </Grid >
    );
};

const typographyStyle = {
    fontFamily: 'Microsoft YaHei',
    lineHeight: '1.5',
    fontSize: { xs: 14, md: 15 }
};

const titleStyle = {
    fontWeight: 'bold',
    lineHeight: '2',
    fontFamily: 'Microsoft YaHei',
    fontSize: { xs: 18, md: 18 }
}

export default ArtworkDetailPage;
