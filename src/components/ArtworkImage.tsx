import { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface ArtworkImageProps {
  src: string;
  isMobile: boolean;
}
/**
 * Show skeleton while the image is loading, to prevent layout shift.
 */
export default function ArtworkImage({ src, isMobile }: ArtworkImageProps) {
  const [loaded, setLoaded] = useState(false);
  const fullSrc = `https://artworks-1257857866.cos.ap-beijing.myqcloud.com${src}`;

  return (
    <Box
      sx={{
        marginTop: '50px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          aspectRatio: isMobile ? '1 / 1' : '4 / 3',
          height: isMobile ? 300 : 650, 
          overflow: 'hidden',
          borderRadius: '12px',
        }}
      >
        {!loaded && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={48} thickness={4} />
          </Box>
        )}

        <PhotoProvider maskOpacity={0.1} bannerVisible={false}>
          <PhotoView src={fullSrc}>
            <img
              src={fullSrc}
              alt=""
              onLoad={() => setLoaded(true)}
              onError={() => console.error('图片加载失败：', fullSrc)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.5s ease',
                display: 'block',
              }}
            />
          </PhotoView>
        </PhotoProvider>
      </Box>
    </Box>
  );
}
