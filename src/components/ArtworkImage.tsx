import React, { useState, useRef, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

interface ArtworkImageProps {
  src: string;
  isMobile: boolean;
}

export default function ArtworkImage({ src, isMobile }: ArtworkImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const fullSrc = `https://artworks-1257857866.cos.ap-beijing.myqcloud.com${src}`;

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => {
      console.error('图片加载失败：', fullSrc);
      setLoaded(true);
    };
    img.src = fullSrc;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [fullSrc]);

  const openFancybox = () => {
    if (loaded && imageRef.current) {
      Fancybox.show([
        {
          src: fullSrc,
          type: 'image',
        },
      ]);
    }
  };

  return (
    <Box
      sx={{
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
          cursor: loaded ? 'zoom-in' : 'default', // 放大光标
          //图片轻微放大
          // '&:hover img': { transform: loaded ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.3s' },
        }}
        onClick={openFancybox}
      >
        {!loaded && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <CircularProgress size={48} thickness={4} />
          </Box>
        )}

        <img
          ref={imageRef}
          src={fullSrc}
          alt="Artwork"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
}
