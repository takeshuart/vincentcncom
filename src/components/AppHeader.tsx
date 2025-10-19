import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const shouldShowBack = !isHomePage;

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
                    <Box sx={{ width: 40, mr: 2 }} />
                )}

                <Typography component={Link} to="/vincent"
                    variant="h6" sx={{ flexGrow: 1, color: 'black', fontWeight: 'bold' }}
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


