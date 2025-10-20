import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const shouldShowBack = !(location.pathname === '/vincent');

    const goBack = () => {
        navigate(-1);
    };
    return (
        <AppBar position="static" sx={{ backgroundColor: '#FDB813', boxShadow: 'none' }}>
            <Toolbar>

                {shouldShowBack ? (
                    <Box
                        display="flex"
                        alignItems="center"
                        onClick={goBack}
                        style={{ cursor: 'pointer', color: 'black' }}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </Box>
                ) : (
                    // Return Logo Placeholder
                    <Box sx={{ width: 30, mr: 2 }} />
                )}

                <Typography
                    component={Link}
                    to="/vincent"
                    sx={{
                        flexGrow: 1,
                        color: 'black',
                        fontWeight: 'bold',
                        textDecoration: 'none', //remove 'underline'
                        fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' } 
                    }}
                >
                    梵·高档案馆
                </Typography>

                <Button color="inherit" sx={{ color: 'black' }}>
                    登录
                </Button>

            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;


