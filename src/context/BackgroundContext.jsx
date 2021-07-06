import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { url, virtualBackgroundImages } from '@/lib';
import { useRoomContext } from './RoomContext';
import { trackpubsToTracks } from '@/utils';

const BackgroundContext = createContext();

const BackgroundContextProvider = ({ children }) => {
  const { room, isChatSession } = useRoomContext(); // twilio room object
  const [virtualBackground, setVirtualBackground] = useState(); // virtualBackground library export
  const [blurBackground, setBlurBackground] = useState(); // blurBackground library export
  const librariesLoaded = useRef(false); // checks if virtual and blur background libraries are loaded
  const [videoTracks, setVideoTracks] = useState(null); // localParticipant's video track

  useEffect(() => {
    if (virtualBackground && blurBackground) {
      if (room) {
        const vt = trackpubsToTracks(room.localParticipant.videoTracks);
        if (vt) {
          setVideoTracks(vt);
          librariesLoaded.current = true;
          console.log('background libraries loaded');
        }
      }
    }
  }, [virtualBackground, blurBackground, room]);

  useEffect(() => {
    if (isChatSession) return;
    const loadBlurBgLib = async () => {
      try {
        const { GaussianBlurBackgroundProcessor } = await import(
          '@twilio/video-processors'
        );
        const blurBg = new GaussianBlurBackgroundProcessor({
          assetsPath: `${url.client}/twilio-video-processor/assets`,
        });
        setBlurBackground(blurBg);
      } catch (e) {
        console.error(e);
      }
    };

    const loadVirtualBgLib = async () => {
      try {
        const { VirtualBackgroundProcessor } = await import(
          '@twilio/video-processors'
        );

        const img = new Image();
        img.src = '/twilio-video-processor/backgrounds/beach.jpg';
        img.onload = () => {
          const virtualBg = new VirtualBackgroundProcessor({
            assetsPath: `${url.client}/twilio-video-processor/assets`,
            backgroundImage: img,
          });
          setVirtualBackground(virtualBg);
        };
      } catch (e) {
        console.error(e);
      }
    };

    loadVirtualBgLib();
    loadBlurBgLib();
  }, [isChatSession]);

  const setProcessor = (processor, track) => {
    removeProcessor();
    if (processor) {
      track?.addProcessor(processor);
    }
  };

  const removeProcessor = (track) => {
    if (track?.processor) {
      track?.removeProcessor(track.processor);
    }
  };

  function toggleBackground(type) {
    if (type === null) {
      removeProcessor(backgroundProcessor, videoTracks[0]);
      return;
    }

    const backgroundProcessor =
      type === 'blur' ? blurBackground : virtualBackground;

    backgroundProcessor
      .loadModel()
      .then(() => setProcessor(backgroundProcessor, videoTracks[0]))
      .catch((e) => console.error(e));
  }

  function changeUserBackground(type) {
    toggleBackground(type);
  }

  const contextProps = {
    changeUserBackground,
    librariesLoaded,
  };

  return (
    <BackgroundContext.Provider value={contextProps}>
      {children}
    </BackgroundContext.Provider>
  );
};

const useBackgroundContext = () => useContext(BackgroundContext);

export { BackgroundContextProvider, useBackgroundContext };
