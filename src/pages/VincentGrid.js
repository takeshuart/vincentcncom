import { useEffect, useState } from 'react';
import { Container, Typography, ThemeProvider, Grid, Card, CardMedia, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { SearchInput, FilterAccordion } from './VincentFilter';
import { fetchArtData, fetchConfigData } from './ArtworkApi';

import '../ArtTableStyles.css';


export default function ArtTable() {
  const pageSize = 21
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width:600px)');
  const [artworks, setArtWorks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [hasImage, setHasImage] = useState(true); //default only image artwork
  const [genres, setGenres] = useState([]);
  const [genreSelected, setGenreSelected] = useState('');
  const [periods, setPeriods] = useState([]);
  const [periodSelected, setPeriodSelected] = useState('');
  const [techniques, setTechniques] = useState([]);
  const [techniqueSelected, setTechniqueSelected] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  useEffect(() => {

    fetchData()
    console.log('fetchDate')
    //listening  data change
  }, [page, hasImage, genreSelected, periodSelected, techniqueSelected]);

  async function fetchData() {

    try {
      setIsLoading(true);
      const artData = await fetchArtData(page, pageSize, searchKeyword, hasImage, genreSelected, periodSelected, techniqueSelected);
      setArtWorks(artData.rows);
      setTotalPages(Math.ceil(artData.count / pageSize));
      setTotalResults(artData.count);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      //异步获取配置信息，不影响结果列表的渲染
      fetchConfigData().then(configData => {
        setGenres(configData.genres);
        setPeriods(configData.periods);
        setTechniques(configData.techniques);
      });

    } catch (error) {
      console.error('Error fetching art data', error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching data
    }

  }

  //restore filter state
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('artTableState')) || {};
    console.log('saveState:\t' + JSON.stringify(savedState))
    setHasImage(savedState.hasImage || true);
    setGenreSelected(savedState.genreSelected || '');
    setPeriodSelected(savedState.periodSelected || '');
    setTechniqueSelected(savedState.techniqueSelected || '');
    setSearchKeyword(savedState.searchKeyword || '');
  }, []);

  //save filter state
  useEffect(() => {
    localStorage.setItem('artTableState', JSON.stringify({ hasImage, genreSelected, periodSelected, techniqueSelected, searchKeyword }));
  }, [hasImage, genreSelected, periodSelected, techniqueSelected, searchKeyword]);


  const handleSearch = async (value) => {
    await fetchData();
    //reset 
    setHasImage(false);
    setGenreSelected('');
    setPeriodSelected('');
    setTechniqueSelected('');
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }
  const goHome = () => {
    navigate('/vincent');
  };

  return (

    <Container maxWidth={false}>

      {/* -----Banner------ */}
      <Grid container sx={{ margin: '20px 10px 20px 10px' }}>
        <Grid item md={9} justifyContent="center" >
          <Box onClick={goHome} style={{ cursor: 'pointer' }}>
            <ThemeProvider theme={theme}>
              <Typography
                variant='h6'
                style={{ display: 'inline', letterSpacing: '2px', marginLeft: '20px' }}
              >
                <strong>梵·高档案馆</strong>
              </Typography>
            </ThemeProvider>
          </Box>
        </Grid>
        <Grid item md={2} sx={{ marginRight: '20px' }} display="flex" justifyContent='right' >
          <Typography >登录</Typography>
        </Grid>
      </Grid>

      {/* Content Box */}
      <Container justifyContent="center" width='70%' >

        {/* -----Filter Box------ */}
        <Grid container sx={{ margin: '10px 1px 20px 10px' }}>
          <SearchInput
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onKeyDown={handleKeyDown}
            onSearch={handleSearch}
          />
        </Grid>
        <Grid container >
          <FilterAccordion
            genreSelected={genreSelected}
            periodSelected={periodSelected}
            techniqueSelected={techniqueSelected}
            hasImage={hasImage}
            handleGenreChange={(event) => setGenreSelected(event.target.value)}
            handlePeriodChange={(event) => setPeriodSelected(event.target.value)}
            handleTechniqueChange={(event) => setTechniqueSelected(event.target.value)}
            handleHasImageChange={(event) => setHasImage(event.target.checked)}
            genresCond={genres}
            periodCond={periods}
            techniqueCond={techniques}
          />
        </Grid>
        <Grid container justifyContent="center" sx={{ marginBottom: '20px', marginTop: '20px' }}>
          <Typography variant="subtitle1" sx={{ color: 'grey' }}>
            发现 <span style={{ fontWeight: 'bold' }}>{totalResults}</span> 个作品
          </Typography>
        </Grid>

        {/* ----- Artworks Box ------- */}
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          {isLoading ? (<Typography>数据加载中...</Typography>) :
            (artworks.map((artwork, index) => (
              <Grid item xs={6} sm={6} md={4} key={index}
                sx={{
                  padding: '10px 40px 10px 10px',
                  '@media (max-width: 600px)': {
                    padding: '0px 10px 10px 10px'
                  }
                }}>
                <Link to={`/vincent/id/${artwork.id}`} target="_self" style={{ textDecoration: 'none' }}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: 'none' }}>
                    <CardMedia
                      component="img"
                      image={`https://www.pubhist.com${artwork.primaryImageSmall}`}
                      alt=""
                      sx={{
                        height: '250px', width: '100%', objectFit: 'contain', objectPosition: 'center',
                        '@media (max-width: 600px)': {
                          height: '150px'
                        },

                        // backgroundColor: '#fafafa'
                      }}
                    />
                    <CardContent align="left">
                      <Typography sx={{ fontWeight: 'bold', fontSize: { xs: 12, md: 16 } }}>
                        {artwork.titleZh || artwork.titleEn}
                      </Typography>
                      {isDesktop && <Typography sx={{ fontStyle: 'italic' }} >{artwork.collection}</Typography>}
                      <Typography sx={{ fontSize: { xs: 14, md: 16 }, fontStyle: 'italic' }} >{artwork.placeOfOrigin}</Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))
            )};

          {/* ----- Pagination Box ------- */}
          <Grid container justifyContent="center" >
            <Grid item xs={6} sx={{ pb: 8 }}>
              <Pagination
                count={totalPages} page={page}
                onChange={(event, value) => setPage(value)}
                color="secondary" siblingCount={isDesktop ? 2 : 0} size="large" />
            </Grid>
          </Grid>
        </Grid>

      </Container>

    </Container>

  );
}


const theme = createTheme({
  typography: {
    h3: {
      '@media (max-width: 600px)': {
        fontSize: '1.5rem', // Adjust font size for smaller screens
      },
    },
  },
});