// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

const ART_BLUE = "#215A8F"; // 深普鲁士蓝

// 创建主题
const customTheme = createTheme({
  palette: {
    primary: {
      main: ART_BLUE,
    },
    secondary: {
      main: '#DAB459', 
    },
    background: {
      default: '#F7F7F7', 
    },
  },

  components: {
    MuiFormLabel: {
      styleOverrides: {
        // remove  TextField/FormControl requiew *
        asterisk: {
          display: 'none', 
        },
      },
    },
    // MuiButton: {
    //   defaultProps: {
    //     disableElevation: true,
    //   },
    //   styleOverrides: {
    //     root: {
    //       textTransform: 'none', 
    //     },
    //   },
    // },
  },
});

export default customTheme;