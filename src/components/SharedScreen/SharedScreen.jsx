import React, { useEffect, useRef } from 'react';

import { useRoomContext } from '@/context/RoomContext';

export default function SharedScreen() {
  const { screenTrack } = useRoomContext();
  const screenRef = useRef();

  useEffect(() => {
    // attach the screen track to the video element
    if (screenTrack) {
      screenTrack.attach(screenRef.current);
    } else {
      screenTrack.detach();
    }
    return () => {
      screenTrack.detach();
    };
  }, [screenTrack]);

  return (
    <video
      ref={screenRef}
      autoPlay
      style={{ maxHeight: '80%', maxWidth: '80%' }}
    />
  );
}
