import React, { useRef, useEffect } from 'react';

const Video = React.forwardRef(({ peer, audio = true }, userVideoRef) => {
  const ref = !userVideoRef ? useRef() : null;

  useEffect(() => {
    peer?.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  });

  return userVideoRef ? (
    <video
      className='w-56 h-32 sm:h-72 sm:w-100 rounded object-cover transform -scale-x-1 m-2'
      muted
      playsInline
      autoPlay
      ref={userVideoRef}
    />
  ) : (
    <video
      className='sm:h-72 sm:w-100 rounded object-cover m-2'
      muted={!audio}
      playsInline
      autoPlay
      ref={ref}
    />
  );
});

export default Video;
