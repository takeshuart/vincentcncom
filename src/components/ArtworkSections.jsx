// src/components/ArtworkSections.jsx
import React from 'react';
import { Box, Typography, List, ListItem, Link, Grid, CircularProgress } from '@mui/material';

export const ArtworkOverview = ({ artwork, extLinks }) => (
  <Box>
    {/* 简介 & 深度阅读引导 （没有相关数据，demo）*/}
    {artwork.fullArticleUrl && (
      <Box
        sx={{
          mb: 3,
          p: 2,
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          📚 深度解读：
        </Typography>
        <Link
          href={artwork.fullArticleUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#C93636', fontWeight: '600', fontSize: '1rem' }}
        >
          探索作品背后的完整创作故事 →
        </Link>
      </Box>
    )}

    {/* 基本信息 */}
    <InfoRow label="原标题" value={artwork.titleEn} />
    <InfoRow label="创作时间" value={artwork.displayDate} />
    <InfoRow label="收藏地" value={artwork.collection} />
    <InfoRow label="创作地点" value={artwork.placeOfOrigin} />
    <InfoRow label="尺寸" value={artwork.dimension} />
    <InfoRow label="材料" value={artwork.material} />
    <InfoRow label="作品编码" value={`${artwork.jhCode} / ${artwork.fCode}`} />

    {/* 外部链接 */}
    {Object.keys(extLinks || {}).length > 0 && (
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>外部链接：</Typography>
        <List sx={{ p: 0, ml: 2, listStyleType: 'disc', '& .MuiListItem-root': { display: 'list-item', py: 0.5, px: 0 } }}>
          {Object.keys(extLinks).map((key, i) => (
            <ListItem key={i} disablePadding>
              <Link href={extLinks[key].url} target="_blank" rel="noopener noreferrer">
                <Typography color="text.secondary">{extLinks[key].linkName}</Typography>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    )}
  </Box>
);

// ========== ArtworkLetters ==========
export const ArtworkLetters = ({ isLoading, lettersData }) => {
  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (!lettersData || lettersData.length === 0) {
    return <Typography>暂无与此作品相关的书信记录。</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        本作品曾在以下书信中被提及：
      </Typography>
      <List sx={{ border: '1px solid #eee', borderRadius: '4px' }}>
        {lettersData.map((letter, index) => (
          <ListItem key={letter.id} divider={index < lettersData.length - 1} sx={{ p: 0 }}>
            <Link
              href={letter.vglUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                p: 2,
                display: 'block',
                width: '100%',
                '&:hover': { backgroundColor: '#f5f5f5', color: '#C93636' },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                No. {letter.letterId} - 致 {letter.recipientZh}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                发件人: {letter.senderZh} | 地点: {letter.placeZh} | 日期: {letter.dateZh}
              </Typography>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// ========== ArtworkExhibition ==========
export const ArtworkExhibition = ({ exhibitions }) => {
  if (!exhibitions || exhibitions.length === 0) {
    return <Typography>暂无本作品的公开展览记录。</Typography>;
  }

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        本作品曾在以下重要展览中展出：
      </Typography>

      <List sx={{ border: '1px solid #eee', borderRadius: '4px', p: 0 }}>
        {exhibitions.map((item, index) => {
          const match = item.match(/^(\d{4})\s(.+)/);
          const year = match ? match[1] : null;
          const details = match ? match[2] : item;

          return (
            <ListItem key={index} divider={index < exhibitions.length - 1} sx={{ py: 1.5 }}>
              <Grid container spacing={1}>
                <Grid item xs={3} sm={2}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#C93636' }}>
                    {year || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={9} sm={10}>
                  <Typography variant="body2">{details}</Typography>
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
    <Typography sx={{ width: 100, minWidth: 80, mr: 1, fontWeight: 600, color: '#555' }}>{label}：</Typography>
    <Typography color="text.secondary" sx={{ fontSize: { xs: 12, md: 14 } }}>
      {value || '—'}
    </Typography>
  </Box>
);
