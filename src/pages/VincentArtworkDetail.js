import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArtworkById } from './ArtworkApi';
import { CardMedia, Divider, Grid, Link, Typography } from '@mui/material';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const ArtworkDetailPage = () => {
    const { id } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [extLinks, setExtLinks] = useState('');


    useEffect(() => {
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

    return (
        <Grid container justifyContent="center">

            <Grid item md={11} align='left' sx={{ marginTop: '30px' }}>
                <Typography variant='h5'
                    style={{ letterSpacing: '2px' }}
                > 梵·高档案馆 </Typography>
            </Grid>

            {artwork && (<>
                <Grid item md={12} sx={{ marginTop: '50px', marginBottom: '30px' }}>
                    <PhotoProvider>
                        <PhotoView src={artwork.primaryImageLarge}>
                            <img src={artwork.primaryImageSmall} alt="" />
                        </PhotoView>
                    </PhotoProvider>
                    <CardMedia
                        component="img"
                        image={artwork.primaryImageLarge}
                        alt=""
                        sx={{
                            height: '500px', width: '100%', objectFit: 'contain', objectPosition: 'center',
                            '@media (max-width: 600px)': {
                                height: '250px'
                            },
                        }}
                    />
                </Grid>
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
                <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>

                </Grid>
            </>
            )};
            {/* <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
                {exhibitions.length > 0 && (
                    <Grid item md={6}>
                        <Typography variant="h6">展览信息：</Typography>
                        {exhibitions
                            .filter(exhibition => exhibition.trim() !== "")
                            .map((exhibition, index) => (
                                <li key={index}>
                                    <Typography>{exhibition.trim()}</Typography>
                                </li>
                            ))}
                    </Grid>
                )}
            </Grid> */}

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
