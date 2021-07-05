import React, { useEffect, useRef } from 'react';

import { useRoomContext } from '@/context/RoomContext';

export default function SharedScreen() {
  const { screenTrack } = useRoomContext();
  const screenRef = useRef();

  useEffect(() => {
    if (screenTrack) {
      screenTrack.attach(screenRef.current);
    }
    return () => {
      screenTrack.detach();
    };
  }, [screenTrack]);

  return <video ref={screenRef} autoPlay className='video' />;
}
