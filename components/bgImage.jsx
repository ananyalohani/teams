import React, { useEffect, useRef } from 'react';
// import { VirtualBackgroundProcessor } from '@twilio/video-processors';

export default function BgImage({ path, videoTrack }) {
  const imgRef = useRef();

  useEffect(() => {
    console.log(imgRef);
    const loadVirtualBgLib = async () => {
      if (imgRef.current) {
        const { VirtualBackgroundProcessor } = await import(
          '@twilio/video-processors'
        );
        const virtualBackground = new VirtualBackgroundProcessor({
          assetsPath: 'http://localhost:3000/virtual_backgrounds',
          backgroundImage: imgRef.current,
        });

        if (videoTrack) {
          virtualBackground.loadModel().then(() => {
            videoTrack.addProcessor(virtualBackground);
          });
        }
      }
    };
    // if (imgRef.current)
    // loadVirtualBgLib();
  }, [imgRef.current]);

  return <img src={path} ref={imgRef} />;
}
