import React, { useEffect } from 'react';

import SidePanel from '@/components/Panels/SidePanel';
import { virtualBackgroundImages as bg } from '@/lib';
import { MdBlurOn } from 'react-icons/md';
import { IoBanOutline } from 'react-icons/io5';
import { useBackgroundContext } from '@/context/BackgroundContext';
import { useRoomContext } from '@/context/RoomContext';
import { trackpubsToTracks } from '@/lib/utils';

function BackgroundPanel() {
  const { room } = useRoomContext();
  const {
    virtualBackground,
    blurBackground,
    librariesLoaded,
    changeUserBackground,
    loadVirtualBgLib,
    loadBlurBgLib,
    setVideoTracks,
  } = useBackgroundContext();

  useEffect(() => {
    // load the background processor libraries
    loadBlurBgLib();
    loadVirtualBgLib(bg.beach);
  }, []);

  useEffect(() => {
    if (virtualBackground && blurBackground) {
      // once virtual and blur background libraries are loaded
      if (room) {
        const vt = trackpubsToTracks(room.localParticipant.videoTracks);
        if (vt) {
          setVideoTracks(vt);
          librariesLoaded.current = true;
        }
      }
    }
  }, [virtualBackground, blurBackground, room]);

  return (
    <SidePanel title='Select Background' name='background'>
      <div className='p-2'>
        <div className='grid grid-cols-3 gap-2'>
          <div
            className='w-24 h-16 bg-gray-850 rounded-sm flex items-center justify-center active:border-2 active:border-blue-400'
            onClick={() => changeUserBackground(null)}
          >
            <IoBanOutline className='w-10 h-10' />
          </div>
          <div
            className='w-24 h-16 bg-gray-850 rounded-sm flex items-center justify-center active:border-2 active:border-blue-400'
            onClick={() => changeUserBackground('blur')}
          >
            <MdBlurOn className='w-12 h-12' />
          </div>
          {Object.keys(bg).map((key, idx) => (
            <img
              src={bg[key]}
              className='w-24 h-16 active:border-2 active:border-blue-400'
              key={idx}
              alt={key}
              onClick={() => changeUserBackground('virtual', bg[key])}
            />
          ))}
        </div>
      </div>
    </SidePanel>
  );
}

export default BackgroundPanel;
