import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchArtData, fetchConfigData } from '../api/ArtworkApi';

const pageSize = 11;
const DEFAULT_QUERY = {
    page: 1,
    hasImage: true,
    genre: '',
    technique: '',
    keyword: '',
    color: '',
};

export const useArtSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Local state for the text input (transient state for typing speed)
    const [keywordInput, setKeywordInput] = useState('');

    // Derived state from URL (the canonical source of truth)
    const query = useMemo(() => {
        return {
            page: parseInt(searchParams.get('page') || String(DEFAULT_QUERY.page), 10),
            hasImage: searchParams.get('hasImage') === 'true' || DEFAULT_QUERY.hasImage,
            genre: searchParams.get('genre') || DEFAULT_QUERY.genre,
            periods: searchParams.get('periods') ? searchParams.get('periods').split(',') : [],
            technique: searchParams.get('technique') || DEFAULT_QUERY.technique,
            keyword: searchParams.get('keyword') || DEFAULT_QUERY.keyword,
            color: searchParams.get('color') || DEFAULT_QUERY.color,
        };
    }, [searchParams]);

    // Initialize keywordInput from URL on mount/URL update
    useEffect(() => {
        setKeywordInput(query.keyword);
    }, [query.keyword]);

    // --- Data and Loading States ---
    const [artworks, setArtWorks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    const [configData, setConfigData] = useState({ genres: [], techniques: [] });

    // --- Configuration Fetch (Run Once) ---
    useEffect(() => {
        fetchConfigData()
            .then(data => { setConfigData(data); setIsConfigLoaded(true); })
            .catch(error => { console.error('Error fetching config data', error); setIsConfigLoaded(true); });
    }, []);

    // --- Utility Function to Update URL Parameters ---
    const updateSearchParams = (newValues, resetPage = true) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        let newParams = { ...currentParams };

        for (const key in newValues) {
            let value = newValues[key];
            
            if (key === 'periods' && Array.isArray(value)) {
                value = value.join(',');
            }
            
            const isEmpty = (value === '' || value === false || (Array.isArray(value) && value.length === 0));

            if (isEmpty) {
                delete newParams[key];
            } else {
                newParams[key] = String(value);
            }
        }
        
        if (resetPage) {
            newParams.page = String(1);
        }

        // Apply the new parameter set to the URL
        setSearchParams(newParams);
    };

    // --- Handlers (Update URL) ---

    // Handler for general filter changes (genre, technique, etc.)
    const handleFilterChange = (key) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        updateSearchParams({ [key]: value });
    };

    // Handler for color selection
    const handleColorSelect = (color) => {
        updateSearchParams({ color: color, keyword: keywordInput });
    };
    
    // Handler for period changes (timeline)
    const handlePeriodChange = (values) => {
        updateSearchParams({ periods: values });
    };

    // Handler for search button click and Enter key press
    const handleSearchTrigger = (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        // Sync keywordInput to URL
        updateSearchParams({ keyword: keywordInput });
    };

    // Handler for Pagination (only changes page parameter, does not reset other filters)
    const handlePageChange = (event, value) => {
        updateSearchParams({ page: value }, false); 
    };

    // --- Main Data Fetching Logic (Runs on query change) ---
    async function fetchData() {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            setIsLoading(true);
            const artData = await fetchArtData(
                query.page, pageSize, query.keyword, query.hasImage, 
                query.genre, query.periods, query.technique, query.color
            );

            setArtWorks(artData.rows);
            setTotalPages(Math.ceil(artData.count / pageSize));
            setTotalResults(artData.count);
        } catch (error) {
            console.error('Error fetching art data', error);
            setArtWorks([]);
            setTotalPages(0);
            setTotalResults(0);
        } finally {
            setIsLoading(false);
        }
    }

    // Effect to trigger data fetching whenever 'query' changes
    useEffect(() => {
        fetchData();
    }, [query]);

    // --- Return all necessary states and handlers ---
    return {
        // Query/Input States
        query,
        keywordInput,
        setKeywordInput, // Only keywordInput setter is needed by the component
        
        // Data States
        artworks,
        totalPages,
        totalResults,
        isLoading,
        isConfigLoaded,
        configData,
        
        // Handlers
        handleFilterChange,
        handleColorSelect,
        handlePeriodChange,
        handleSearchTrigger,
        handlePageChange,
    };
};