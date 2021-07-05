import React, { useState, useEffect } from 'react';

import Participant from '@/components/Participant/Participant';
import { trackpubsToTracks } from '@/utils';
import { useBackgroundContext } from '@/context/BackgroundContext';

// ! DELETE THIS PAGE LATER BECAUSE IT'S PROBABLY NOT REQUIRED

export default function LocalParticipant({ participant }) {
  const { changeUserBackground, librariesLoaded } = useBackgroundContext();

  useEffect(() => {
    if (librariesLoaded.current) {
      changeUserBackground('blur');
    }
  }, [librariesLoaded.current]);

  return <Participant participant={participant} me={true} />;
}
