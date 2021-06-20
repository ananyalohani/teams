import React, { useEffect, useRef } from 'react';

import { useCallContext } from '@/context/callContext';

const Video = React.forwardRef(({ peer }, userVideoRef) => {
  const ref = !userVideoRef ? useRef() : null;
  const { userVideo: video, connectPeerStream } = useCallContext();

  useEffect(() => {
    if (peer) connectPeerStream(peer, ref);
  }, []);

  return userVideoRef ? (
    video ? (
      <video
        className='bg-black w-56 h-32 sm:h-72 sm:w-100 rounded object-cover transform -scale-x-1 m-2'
        muted
        playsInline
        autoPlay
        ref={userVideoRef}
      />
    ) : (
      <>
        <video
          className='hidden'
          muted
          playsInline
          autoPlay
          ref={userVideoRef}
        />
        <video
          className='bg-black w-56 h-32 sm:h-72 sm:w-100 rounded object-cover transform -scale-x-1 m-2'
          muted
          playsInline
          autoPlay
          src={null}
        />
      </>
    )
  ) : (
    <video
      className='bg-black w-56 h-32 sm:h-72 sm:w-100 rounded object-cover m-2'
      playsInline
      autoPlay
      ref={ref}
    />
  );
});

export default Video;
