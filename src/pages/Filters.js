import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { FilterSelect } from '../components/Selector';
import { GridSearchIcon } from '@mui/x-data-grid';

export function FilterAccordion({
    changeHandler,
    genreSelected,
    techniqueSelected,
    hasImage,

    // Config Data (你传入的 configData={configData} 对应的 Prop)
    configData

}) {
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isMobile) {
        return (
            <Accordion style={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
                    <Typography>过滤器</Typography>
                </AccordionSummary>
                {/* <AccordionDetails>
                    <FilterSection {...filterSectionProps} />
                </AccordionDetails> */}
            </Accordion>);
    }
    return (
        <Grid container sx={{ marginTop: '10px', marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={3} sx={{ '@media (min-width: 600px)': { marginRight: '20px' } }}>
                <Grid item xs={12} sm={6} md={3} sx={{ '@media (min-width: 600px)': { marginRight: '20px' } }}>
                    <FilterSelect
                        label="主题"
                        value={genreSelected}
                        onChange={changeHandler("genre")}
                        items={configData.genres}
                        itemValueKey="genre"
                        itemLabelKey="genre"
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} sm={6} md={2} sx={{ '@media (min-width: 600px)': { marginRight: '20px' } }}>
                <FilterSelect
                    label="技法类型"
                    value={techniqueSelected}
                    onChange={changeHandler("technique")}
                    items={configData.techniques}
                    itemValueKey="technique" // 指定 value 对应的字段名
                    itemLabelKey="technique" // 指定显示文本对应的字段名
                />
            </Grid>
            <Grid item xs={12} sm={6} md={2} justifyContent="center" alignItems="center">
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={hasImage} onChange={changeHandler("hasImage")} />}
                        label="有图片"
                    />
                </FormGroup>
            </Grid>
        </Grid>
    )
}


export const SearchInput = ({ value, onChange, onKeyDown, onClick }) => {
    return (
        <TextField
            variant="standard"
            size="medium"
            fullWidth
            label="作品名词/博物馆/作品编码（支持中/英）"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={onClick}>
                            <GridSearchIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
};
