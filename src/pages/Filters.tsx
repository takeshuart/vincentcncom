import React from 'react';
import { Grid, IconButton, InputAdornment, TextField, FormGroup, FormControlLabel, Checkbox, Typography, useMediaQuery, Accordion, AccordionSummary } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { FilterSelect } from '../components/Selector';
import { GridSearchIcon } from '@mui/x-data-grid';

// 定义 FilterAccordion Props 类型
interface FilterAccordionProps {
  changeHandler: (field: 'genre' | 'technique' | 'hasImage') => (event: React.ChangeEvent<HTMLInputElement> | any) => void;
  genreSelected: string;
  techniqueSelected: string;
  hasImage: boolean;
  configData: {
    genres: { genre: string }[];
    techniques: { technique: string }[];
  };
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
  changeHandler,
  genreSelected,
  techniqueSelected,
  hasImage,
  configData
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  if (isMobile) {
    return (
      <Accordion style={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
          <Typography>过滤器</Typography>
        </AccordionSummary>
        {/* 可在此添加 AccordionDetails */}
      </Accordion>
    );
  }

  return (
    <Grid container sx={{ marginTop: '10px', marginBottom: '20px' }}>
      <Grid item xs={12} sm={6} md={3} sx={{ '@media (min-width: 600px)': { marginRight: '20px' } }}>
        <FilterSelect
          label="主题"
          value={genreSelected}
          onChange={changeHandler('genre')}
          items={configData.genres}
          itemValueKey="genre"
          itemLabelKey="genre"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2} sx={{ '@media (min-width: 600px)': { marginRight: '20px' } }}>
        <FilterSelect
          label="技法类型"
          value={techniqueSelected}
          onChange={changeHandler('technique')}
          items={configData.techniques}
          itemValueKey="technique"
          itemLabelKey="technique"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2} justifyContent="center" alignItems="center">
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={hasImage} onChange={changeHandler('hasImage')} />}
            label="有图片"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

// 定义 SearchInput Props 类型
interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onKeyDown, onClick }) => {
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
