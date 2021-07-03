import React, { useEffect, useRef } from 'react';
import { useRoomCallContext } from '@/context/roomCallContext';

export default function SharedScreen() {
  const { screenTrack } = useRoomCallContext();
  const screenRef = useRef();

  useEffect(() => {
    if (screenTrack) {
      screenTrack.attach(screenRef.current);
    }
  }, [screenTrack]);

  return <video ref={screenRef} autoPlay className='video' />;
}
