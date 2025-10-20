import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { SearchInput, FilterAccordion } from './Filters'; // Assuming path is correct
import { fetchArtData, fetchConfigData } from './ArtworkApi'; // Assuming path is correct
import '../ArtTableStyles.css';
import ColorSearchBar from '../components/ColorSearchBar';

export default function ArtSearchPage() {
    const pageSize = 21;
    const isDesktop = useMediaQuery('(min-width:600px)');

    // updates on every keystroke, but DOES NOT trigger search
    const [keywordInput, setKeywordInput] = useState('');

    // States for all ACTUAL query parameters (updates trigger search via useEffect)
    //query: current state value
    //setQuery: update state
    const [query, setQuery] = useState({
        page: 1,
        hasImage: true,
        genre: '',
        period: '',
        technique: '',
        keyword: '',
        color: '',
    });

    // States for fetched results and static config data
    const [artworks, setArtWorks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    const [configData, setConfigData] = useState({
        genres: [],
        periods: [],
        techniques: [],
    });
    // Effect for fetching config data (Runs once on mount), trigger search via useEffect
    useEffect(() => {
        fetchConfigData().then(configData => {
            setConfigData(configData);
            setIsConfigLoaded(true);
        }).catch(error => {
            console.error('Error fetching config data', error);
            setIsConfigLoaded(true);//empty selector
        });
    }, []);


    // Main Data Fetching Logic 
    async function fetchData() {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            setIsLoading(true);
            const artData = await fetchArtData(
                query.page,
                pageSize,
                query.keyword,
                query.hasImage,
                query.genre,
                query.period,
                query.technique,
                query.color
            );

            setArtWorks(artData.rows);
            setTotalPages(Math.ceil(artData.count / pageSize));
            setTotalResults(artData.count);

        } catch (error) {
            console.error('Error fetching art data', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Main Effect for data fetching (Triggers on any query change)
    useEffect(() => {
        fetchData();
    }, [query]);

    /**
     * To create a unified change handler for various filter types (Select, Checkbox, etc.).
     * This function accepts the target key (the state property to update) 
     * and returns the actual event handler function.
     *
     * @param {string} key - The key of the property in the 'query' state object to be updated 
     * (e.g., 'genre', 'period', 'hasImage').
     * @returns {function(event): void} The event handler function.
     */
    const handleFilterChange = (key) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setQuery(prev => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to page 1 for any new filter change
        }));

        if (key !== 'keyword') {
            setQuery(prev => ({
                ...prev,
                keyword: keywordInput, // Sync current input (maybe has Uncommitted input)
                page: 1,
                [key]: value,
            }));
        }
    };
    const handleColorSelect = (color) => {
        setQuery(prev => ({
            ...prev,
            color: color,
            keyword: keywordInput, 
            page: 1
        }));
    };

    // Handler for search button click and Enter key press (Triggers the search)
    const handleSearchTrigger = (event) => {
        // Essential fix for Enter key: prevents form submission/page reload
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        // This update to the 'query' state will trigger the useEffect and run the search.
        setQuery(prev => ({
            ...prev,
            keyword: keywordInput, // Sync input value to query state
            page: 1
        }));
    };

    // Handler for Pagination (only changes page)
    const handlePageChange = (event, value) => {
        setQuery(prev => ({ ...prev, page: value }));
    };

    if (!isConfigLoaded) {
        // Option 1: Display a simple full-page loader until config is ready
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={80} />
            </Container>
        );
    }
    return (

        <Container maxWidth={false} disableGutters >
            <Container maxWidth={false} sx={{ width: '90%', mx: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={1}></Grid>
                    <Grid item xs={12} md={10}>
                        <Box >
                            {/* -----Filter Box------ */}
                            <Grid container sx={{ margin: '10px 1px 10px 1px' }}>
                                <SearchInput
                                    // Binds to the temporary input state
                                    value={keywordInput}
                                    // Updates temporary input state on every keystroke
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
                            <Grid container >
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
                            </Grid>
                            {/* Color search */}
                            <Grid item xs={12}>
                                <ColorSearchBar
                                    onColorSelect={handleColorSelect}
                                    initialColor="#800080"
                                />
                            </Grid>
                            <Grid container justifyContent="center" sx={{ marginBottom: '20px', marginTop: '20px' }}>
                                <Typography variant="subtitle1" sx={{ color: 'grey' }}>
                                    Found <span style={{ fontWeight: 'bold' }}>{totalResults}</span> results
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
                                                    sx={{ height: '250px', width: '100%', objectFit: 'contain', objectPosition: 'center', '@media (max-width: 600px)': { height: '150px' }, backgroundColor: '#fafafa' }}
                                                />
                                            </Link>
                                            <CardContent align="left">
                                                <Typography sx={{ fontWeight: 400, fontSize: { xs: 12, md: 18 }, textAlign: 'center' }}>
                                                    {artwork.titleZh || artwork.titleEn}
                                                </Typography>
                                                <Typography color="text.secondary" variant="body2"
                                                    sx={{
                                                        fontStyle: 'italic',
                                                        textAlign: 'center',
                                                        display: { xs: 'none', md: 'block' },
                                                    }} >
                                                    {artwork.displayDate}{artwork.placeOfOrigin ? `, ${artwork.placeOfOrigin}` : ''}
                                                </Typography>
                                                {artwork.collection && (
                                                    <Typography variant="body2" color="text.secondary" textAlign='center'
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