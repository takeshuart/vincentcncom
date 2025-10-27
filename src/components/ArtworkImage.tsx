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
  // 每次 fullSrc 变化时，重置状态
  setLoaded(false); 

  let active = true; 
  const img = new Image();
  img.src = fullSrc; // 触发加载

  // 1. 检查图片是否已加载完成 (complete)
  if (img.complete && img.naturalWidth > 0) {
    // 图片已在缓存中，且已同步完成加载
    setLoaded(true);
  } else {
    // 2. 否则，设置异步监听器
    img.onload = () => {
      if (active) { 
        setLoaded(true);
      }
    };
    img.onerror = () => {
      console.error('图片加载失败：', fullSrc);
      if (active) {
        setLoaded(true); // 即使失败也要更新状态，显示占位图或错误
      }
    };
  }
  
  return () => {
    active = false; 
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
          // maxWidth: '800px',
          // aspectRatio: isMobile ? '1 / 1' : '4 / 3',
          // height: isMobile ? 300 : 650,
          height: isMobile ? '80vh' : 650,
          overflow: 'hidden',
          borderRadius: '10px',
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
