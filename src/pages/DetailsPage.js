import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArtworkById } from '../api/ArtworkApi';
import { Box, Divider, Grid, Link, Typography, useMediaQuery } from '@mui/material';
import 'react-photo-view/dist/react-photo-view.css';
import ArtworkImage from '../components/ArtworkImage';

const DetailsPage = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const { id } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [extLinks, setExtLinks] = useState('');

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

    }, [id]);

    return (
        <Grid container justifyContent="center" sx={{
            paddingTop: 5,
            // bgcolor: '#CBCFEA'
        }}>
            {artwork && (<>
                <ArtworkImage src={artwork.primaryImageMedium} isMobile={isMobile} />
                <Grid container justifyContent="center">
                    <Grid item xs={10} sm={6} md={6} sx={{mb:1}}>
                        <Box>
                            <Typography sx={titleStyle}>{artwork.titleZh || artwork.titleEn}</Typography>
                            <Typography color='GrayText'   fontWeight='500'>{artwork.displayDate}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center" sx={{ marginBottom: '10px' }}>
                    <Grid item md={6}>
                        <Divider />
                    </Grid>
                </Grid>
                {artwork.shortDesc && (<>
                    <Grid container justifyContent={'center'}>
                        <Grid item md={6}>
                            <Box sx={{ mb: 3, mt: 3 }}>
                                <Typography>{artwork.shortDesc}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </>)}
                {/** Details information */}
                <Grid container justifyContent="center" sx={{mt:5}}>
                    <Grid item xs={10} sm={6} md={6}>
                        <Box>
                            <Box sx={rowStyle}>
                                <Typography component="span" sx={keyStyle}>原标题：</Typography>
                                <Typography component="span" sx={valueStyle}>{artwork.titleEn}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography component="span" sx={keyStyle}>创作时间：</Typography>
                                <Typography component="span" sx={valueStyle}>{artwork.displayDate}</Typography>
                            </Box>
                            <Box sx={rowStyle}>
                                <Typography component="span" sx={keyStyle}>收藏地：</Typography>
                                <Typography component="span" sx={valueStyle}>{artwork.collection}</Typography>
                            </Box>
                            <Box sx={rowStyle}>
                                <Typography component="span" sx={keyStyle}>创作地点：</Typography>
                                <Typography component="span" sx={valueStyle}>{artwork.placeOfOrigin}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography component="span" sx={keyStyle}>尺寸：</Typography>
                                <Typography component="span" sx={valueStyle}>{artwork.dimension}</Typography>
                            </Box>
                            <Box sx={rowStyle}>
                                <Typography component="span" sx={keyStyle}>材料：</Typography>
                                <Typography component="span" sx={valueStyle}>{artwork.material}</Typography>
                            </Box>
                            <Box sx={rowStyle}>
                                <Typography component="span" sx={keyStyle}>作品编码：</Typography>
                                <Typography component="span" sx={valueStyle}>{artwork.jhCode} / {artwork.fCode}</Typography>
                            </Box>
                        </Box>
                        {extLinks && Object.keys(extLinks).length > 0 && (
                            <>
                                <Typography sx={{ ...typographyStyle, display: 'inline' }}>外部链接：</Typography>
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

                {/* Footer */}
                <Grid container mt='50px' justifyContent='center' sx={{ backgroundColor: '#fafafa', height: '100px', width: '100%' }}>
                    <Typography alignContent='center' >梵·高档案馆 2024</Typography>
                </Grid>
            </>
            )}
        </Grid >
    );
};

const titleStyle = {
    fontWeight: 'bold',
    lineHeight: '2',
    fontFamily: 'Microsoft YaHei',
    fontSize: { xs: 18, md: 20 },
    marginBottom: 0,
    color: '#5F5E7B'

}


const typographyStyle = {
    lineHeight: '1.5',
    fontWeight: 500,
    fontSize: { xs: 12, md: 14 },
    marginBottom: 0.5,
};

const rowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    ...typographyStyle,
};

const keyStyle = {
    width: '100px',
    minWidth: '80px',
    marginRight: '8px',
    fontWeight: '400',
};
const valueStyle = {
    color: 'text.secondary',
    fontSize: { xs: 12, md: 16 },
};
export default DetailsPage;
