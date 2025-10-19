// ArtTable.js

import { useEffect, useState, useRef } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { SearchInput, FilterAccordion } from './VincentFilter';
import { fetchArtData, fetchConfigData, fetchSurpriseArt } from './ArtworkApi';
import '../ArtTableStyles.css';
import ColorSearchBar from '../components/ColorSearchBar';
import SurprisemeBlock from '../components/SurprisemeBlock';


export default function ArtTable() {
  const pageSize = 21
  const isDesktop = useMediaQuery('(min-width:600px)');

  const [artworks, setArtWorks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [hasImage, setHasImage] = useState(true);
  const [genres, setGenres] = useState([]);
  const [genreSelected, setGenreSelected] = useState('');
  const [periods, setPeriods] = useState([]);
  const [periodSelected, setPeriodSelected] = useState('');
  const [techniques, setTechniques] = useState([]);
  const [techniqueSelected, setTechniqueSelected] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [surpriseArtwork, setSurpriseArtwork] = useState(null);
  const [isSurpriseLoading, setIsSurpriseLoading] = useState(true);
  const surpriseRef = useRef(null); // localtion surpriseme box 
  const searchRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('');

  // firstly olny load Surprise Artwork
  useEffect(() => {
    fetchSurpriseArtWork();
  }, []);

  useEffect(() => {
    if (!isSurpriseLoading) {
      fetchData(true);
    }
  }, [
    page, //监控page值变化
    hasImage,
    genreSelected,
    periodSelected,
    techniqueSelected,
    isSurpriseLoading,
    selectedColor
  ]);
  

  async function fetchData(shouldCheckScroll) {

    try {
      setIsLoading(true);
      const artData = await fetchArtData(
        page,
        pageSize,
        searchKeyword,
        hasImage,
        genreSelected,
        periodSelected,
        techniqueSelected,
        selectedColor);

      setArtWorks(artData.rows);
      setTotalPages(Math.ceil(artData.count / pageSize));
      setTotalResults(artData.count);

      if (shouldCheckScroll) {
        if (surpriseRef.current && searchRef.current) {
          const surpriseRect = surpriseRef.current.getBoundingClientRect();

          if (surpriseRect.bottom > 0 && surpriseRect.bottom <= window.innerHeight) {
            console.log("Surprise 区域在视口内，首次加载不滚动。");
          } else if (searchRef.current) {
            console.log("Surprise 区域不可见或超出视口，滚动到搜索框。");
            surpriseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (searchRef.current) {
        console.log("后续操作，滚动到搜索框。");
        searchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      fetchConfigData().then(configData => {
        setGenres(configData.genres);
        setPeriods(configData.periods);
        setTechniques(configData.techniques);
      });

    } catch (error) {
      console.error('Error fetching art data', error);
    } finally {
      setIsLoading(false);
    }

  }

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


  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('artTableState')) || {};
    console.log('saveState:\t' + JSON.stringify(savedState))
    setHasImage(savedState.hasImage || true);
    setGenreSelected(savedState.genreSelected || '');
    setPeriodSelected(savedState.periodSelected || '');
    setTechniqueSelected(savedState.techniqueSelected || '');
    setSearchKeyword(savedState.searchKeyword || '');
  }, []);

  useEffect(() => {
    localStorage.setItem('artTableState', JSON.stringify({ hasImage, genreSelected, periodSelected, techniqueSelected, searchKeyword }));
  }, [hasImage, genreSelected, periodSelected, techniqueSelected, searchKeyword]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setPage(1);
  };
  const handleSearch = async (value) => {
    await fetchData(false);
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

  return (
    <Container maxWidth={false} disableGutters >
      <Container maxWidth={false} sx={{ width: '90%', mx: 'auto' }}>

        <SurprisemeBlock
          surpriseArtwork={surpriseArtwork}
          isSurpriseLoading={isSurpriseLoading}
          fetchSurpriseArtWork={fetchSurpriseArtWork}
          ref={surpriseRef}
        />

        <Grid container spacing={2}>
          {/* --- Main Layout: 1/10/1 --- */}
          {/** left  */}
          <Grid item xs={12} md={1}>
          </Grid>
          {/* --- Center (10) --- */}
          <Grid item xs={12} md={10}>
            <Box ref={searchRef}>
              {!isSurpriseLoading && (
                <>
                  {/* -----Filter Box------ */}
                  <Grid container sx={{ margin: '10px 1px 10px 1px' }}>
                    <SearchInput
                      value={searchKeyword}
                      onChange={(event) => setSearchKeyword(event.target.value)}
                      onKeyDown={handleKeyDown}
                      onSearch={handleSearch}
                    />
                  </Grid>
                  <Grid container >
                    <FilterAccordion
                      handleGenreChange={(event) => setGenreSelected(event.target.value)}
                      handlePeriodChange={(event) => setPeriodSelected(event.target.value)}
                      handleTechniqueChange={(event) => setTechniqueSelected(event.target.value)}
                      handleHasImageChange={(event) => setHasImage(event.target.checked)}
                      genresCond={genres}
                      periodCond={periods}
                      techniqueCond={techniques}
                    />
                  </Grid>
                  {/** Color search */}
                  <Grid item xs={12}>
                    <ColorSearchBar
                      onColorSelect={handleColorSelect}
                      initialColor="#800080"
                    />
                  </Grid>
                  <Grid container justifyContent="center" sx={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Typography variant="subtitle1" sx={{ color: 'grey' }}>
                      发现 <span style={{ fontWeight: 'bold' }}>{totalResults}</span> 个作品
                    </Typography>
                  </Grid>

                  {/* ----- Artworks Box ------- */}
                  <Grid container justifyContent="center" sx={{ mt: 4, minHeight: 600 }}>
                    {isLoading ? (
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4, minHeight: 700, }}>
                        <CircularProgress size={100} />
                      </Box>
                    ) : (artworks.map((artwork, index) => (
                      <Grid item xs={6} sm={6} md={4} key={index}
                        sx={{
                          padding: '10px 40px 10px 10px',
                          '@media (max-width: 600px)': {
                            padding: '0px 10px 10px 10px'
                          }
                        }}>
                        <Card variant="outlined"
                          sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: 'none' }}>
                          <Link to={`/vincent/id/${artwork.id}`} target="_self" style={{ textDecoration: 'none' }}>
                            <CardMedia
                              component="img"
                              image={`https://artworks-1257857866.cos.ap-beijing.myqcloud.com${artwork.primaryImageSmall}`}
                              alt=""
                              sx={{
                                height: '250px', width: '100%', objectFit: 'contain', objectPosition: 'center',
                                '@media (max-width: 600px)': {
                                  height: '150px'
                                },
                                backgroundColor: '#fafafa'
                              }}
                            />
                          </Link>
                          <CardContent align="left">
                            <Typography
                              sx={{
                                fontWeight: 400, //'bold' too heavy 
                                fontSize: { xs: 12, md: 18 },
                                textAlign: 'center'
                              }}>
                              {artwork.titleZh || artwork.titleEn}
                            </Typography>
                            <Typography color="text.secondary" variant="body2"
                              sx={{
                                fontStyle: 'italic',
                                textAlign: 'center'
                              }} >
                              {artwork.displayDate}{artwork.placeOfOrigin ? `, ${artwork.placeOfOrigin}` : ''}
                            </Typography>
                            {artwork.collection && (
                              <Typography variant="body2" color="text.secondary" textAlign='center'>
                                {artwork.collection}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    )))}

                    {/* ----- Pagination Box ------- */}
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Box sx={{ pb: 8, display: 'flex', justifyContent: 'center' }}>
                          <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(event, value) => setPage(value)}
                            color="secondary"
                            siblingCount={isDesktop ? 2 : 0}
                            size="large"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </>)}
            </Box>
          </Grid>

          {/** right */}
          <Grid item xs={12} md={1}>
          </Grid>
        </Grid>
      </Container>

    </Container >

  );
}
