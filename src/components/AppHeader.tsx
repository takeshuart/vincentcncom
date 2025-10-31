import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HEADER_HEIGHT from '../App';

const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const shouldShowBack = location.pathname.startsWith('/vincent/');

    //go back searchPage
    const goBack = () => {
        //返回上一页 而不是直接到搜索页。
        //navigate(-1)
        //location.search start with '?'
        navigate(`/search${location.search}`);//recover search fitlers from querystring
    };
    return (
        <AppBar
            position="absolute" //脱离文档流，固定视口位置
            color='transparent'
            sx={{
                // boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', //轻微阴影
                boxShadow: 'none',
                height: `40px`,
                zIndex: 999// 确保更高的层级
            }

            }>
            <Toolbar sx={{
                bgcolor: 'transparent'
            }}>

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
                    to="/"
                    sx={{
                        color: 'black',
                        fontWeight: '500',
                        textDecoration: 'none', //remove 'underline'
                        fontSize: { xs: '1rem', sm: '1rem', md: '1.25rem' }
                    }}
                >
                    梵·高档案馆
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>

                    <Button  sx={{ color: 'black' }}>
                        登录
                    </Button>
                </Box>

            </Toolbar>
        </AppBar >
    );
};

export default AppHeader;


