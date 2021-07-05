import React, { useState, useEffect } from 'react';

import Participant from 'components/Participant/Participant';
import { useRoomContext } from 'context/RoomContext';
import { trackpubsToTracks } from 'utils';
import { url } from 'lib';

export default function LocalParticipant({ participant }) {
  const { userBg } = useRoomContext();
  const [virtualBackground, setVirtualBackground] = useState();
  const [blurBackground, setBlurBackground] = useState();
  const [videoTracks, setVideoTracks] = useState([]);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
  }, [participant]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (virtualBackground && blurBackground) {
      toggleBackground(userBg);
    }
  }, [userBg, virtualBackground, blurBackground]);

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
    if (!videoTracks[0]) return;
    const videoTrack = videoTracks[0];
    if (type === null) {
      removeProcessor(backgroundProcessor, videoTrack);
      return;
    }

    const backgroundProcessor =
      type === 'blur' ? blurBackground : virtualBackground;

    backgroundProcessor
      .loadModel()
      .then(() => setProcessor(backgroundProcessor, videoTrack))
      .catch((e) => console.error(e));
  }

  return <Participant participant={participant} me={true} />;
}
