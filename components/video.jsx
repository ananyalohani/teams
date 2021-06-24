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
        className='video transform -scale-x-1'
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
          className='video transform -scale-x-1'
          muted
          playsInline
          autoPlay
          src={null}
        />
      </>
    )
  ) : (
    <video className='video' playsInline autoPlay ref={ref} />
  );
});

export default Video;
