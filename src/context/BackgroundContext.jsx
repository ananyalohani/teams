import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { virtualBackgroundImages as bg } from '@/lib';
import url from 'url';
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
    // load the GaussianBlurBackgroundProcessor library
    const loadBlurBgLib = async () => {
      try {
        const { GaussianBlurBackgroundProcessor } = await import(
          '@twilio/video-processors'
        );
        const blurBg = new GaussianBlurBackgroundProcessor({
          assetsPath: `${url.client}/twilio-video-processor/assets`,
          maskBlurRadius: 5,
          blurFilterRadius: 10,
        });
        setBlurBackground(blurBg);
      } catch (e) {
        console.error(e);
      }
    };

    loadBlurBgLib();
    loadVirtualBgLib(bg.beach);
  }, [isChatSession]);

  const loadVirtualBgLib = async (imagePath) => {
    // load the VirtualBackgroundProcessor library
    try {
      const { VirtualBackgroundProcessor } = await import(
        '@twilio/video-processors'
      );

      const img = new Image();
      img.src = imagePath;
      img.onload = () => {
        const virtualBg = new VirtualBackgroundProcessor({
          assetsPath: `${url.client}/twilio-video-processor/assets`,
          backgroundImage: img,
          fitType: 'Fill',
          historyCount: 1,
          maskBlurRadius: 5,
        });
        setVirtualBackground(virtualBg);
      };
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    toggleBackground('virtual');
  }, [virtualBackground]);

  const setProcessor = (processor, track) => {
    // set a new processor on a given track
    removeProcessor(track);
    if (processor) {
      track.addProcessor(processor);
    }
  };

  const removeProcessor = (track) => {
    // remove the existing processor from the track
    if (track.processor) {
      track.removeProcessor(track.processor);
    }
  };

  function toggleBackground(type) {
    // toggle background of the user's video
    if (!videoTracks) return;

    removeProcessor(videoTracks[0]);
    if (type === null) return;

    const backgroundProcessor =
      type === 'blur' ? blurBackground : virtualBackground;

    backgroundProcessor
      .loadModel()
      .then(() => setProcessor(backgroundProcessor, videoTracks[0]))
      .catch((e) => console.error(e));
  }

  function changeUserBackground(type, imagePath = null) {
    // ? type = 'blur' | 'virtual' | null ; imagePath = string | null
    // exposed function to change user's video background
    if (imagePath) {
      loadVirtualBgLib(imagePath);
    }
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
