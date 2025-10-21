import React from 'react'; // Only need React here, other hooks are inside useArtSearch
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

// Import the new custom hook
import { useArtSearch } from '../hooks/useArtSearch';

import { FilterAccordion, SearchInput } from './Filters';
// Removed imports for fetchArtData, fetchConfigData, useEffect, useState, useMemo, useSearchParams
import '../styles/ArtTableStyles.css';
import ColorSearchBar from '../components/ColorSearchBar';
import PeriodTimelineFilter from '../components/PeriodBar';

export default function ArtSearchPage() {
    const isDesktop = useMediaQuery('(min-width:600px)');

    // 1. Call the custom hook and destructure all necessary values
    const {
        query, keywordInput, setKeywordInput, artworks, totalPages,
        totalResults, isLoading, isConfigLoaded, configData,
        handleFilterChange, handleColorSelect, handlePeriodChange,
        handleSearchTrigger, handlePageChange,
    } = useArtSearch();

    if (!isConfigLoaded) {
        // Option 1: Display a simple full-page loader until config is ready
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={80} />
            </Container>
        );
    }

    // The rest is pure rendering logic, significantly cleaner
    return (
        <Container maxWidth={false} disableGutters >
            <Container maxWidth={false} sx={{ width: '90%', mx: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={1}></Grid>
                    <Grid item xs={12} md={10}>
                        <Box >
                            {/* -----Filter Box------ */}
                            <Grid container sx={{ margin: '40px 1px 40px 1px' }}>
                                <SearchInput
                                    // Binds to the local input state
                                    value={keywordInput}
                                    // Updates local input state on every keystroke
                                    onChange={(event) => setKeywordInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleSearchTrigger(event);
                                        }
                                    }}
                                    // search Icon
                                    onClick={handleSearchTrigger}
                                />
                            </Grid>
                            {/** filters */}
                            {/* <Grid container >
                                <FilterAccordion
                                    // Use unified handlers
                                    changeHandler={handleFilterChange}
                                    // Pass current selected values
                                    genreSelected={query.genre}
                                    periodSelected={query.period}
                                    techniqueSelected={query.technique}
                                    hasImage={query.hasImage}

                                    configData={configData}
                                />
                            </Grid> */}
                            <Grid container>

                                <PeriodTimelineFilter
                                    selectedValues={query.periods}
                                    onSelectionChangeFunc={handlePeriodChange}
                                />
                            </Grid>
                            {/* Color search */}
                            <Grid item xs={12}>
                                <ColorSearchBar
                                    onColorSelect={handleColorSelect}
                                    initialColor={query.color || "#800080"}
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

                                    <Grid item xs={6} sm={4} md={4} key={index}
                                        sx={{
                                            padding: '10px 40px 10px 10px',
                                            '@media (max-width: 600px)': {
                                                padding: '0px 0px 0px 20px'
                                            }
                                        }}>
                                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: 'none' }}>
                                            <Link to={`/vincent/id/${artwork.id}`} target="_self" style={{ textDecoration: 'none' }}>
                                                <CardMedia
                                                    component="img"
                                                    image={`https://artworks-1257857866.cos.ap-beijing.myqcloud.com${artwork.primaryImageSmall}`}
                                                    alt=""
                                                    sx={{
                                                        height: '250px', width: '100%', objectFit: 'contain', objectPosition: 'center',
                                                        '@media (max-width: 600px)': { height: '150px' }, backgroundColor: '#fdfbfbff',
                                                        '&:hover': {
                                                            backgroundColor: '#f0f0f0'
                                                        }
                                                    }}
                                                />
                                            </Link>
                                            <CardContent align="left">
                                                <Typography sx={{ fontWeight: 400, fontSize: { xs: 12, md: 18 }, textAlign: 'left' }}>
                                                    {artwork.titleZh || artwork.titleEn}
                                                </Typography>
                                                <Typography color="text.secondary" variant="body2"
                                                    sx={{
                                                        textAlign: 'left',
                                                        display: { xs: 'none', md: 'block' },
                                                    }} >
                                                    {artwork.displayDate}{artwork.placeOfOrigin ? `, ${artwork.placeOfOrigin}` : ''}
                                                </Typography>
                                                {artwork.collection && (
                                                    <Typography variant="body2" color="text.secondary" textAlign='left'
                                                        sx={{
                                                            display: { xs: 'none', md: 'block' },
                                                        }}>
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
                                                page={query.page}
                                                onChange={handlePageChange}
                                                color="secondary"
                                                siblingCount={isDesktop ? 2 : 0}
                                                size="large"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>
                    <Grid item xs={12} md={1}></Grid>
                </Grid>
            </Container>
        </Container >
    );
}