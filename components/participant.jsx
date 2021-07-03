import React, { useState, useEffect, useRef } from 'react';
import { trackpubsToTracks } from 'utils';
import { useRoomCallContext } from '@/context/roomCallContext';

const Participant = ({ participant, me = false }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const { setScreenTrack } = useRoomCallContext();

  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    participant.on('trackPublished', (remoteTrackPublication) => {
      console.log(remoteTrackPublication);
      setScreenTrack(remoteTrackPublication.track);
    });

    participant.on('trackUnpublished', (remoteTrackPublication) => {
      setScreenTrack(null);
    });

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        trackDisabled(publication.track);
      }
      publication.on('subscribed', trackDisabled);
    });

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        trackEnabled(publication.track);
      }
      publication.on('subscribed', trackEnabled);
    });

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  const trackSubscribed = (track) => {
    if (track.kind === 'video') {
      setVideoTracks((videoTracks) => [...videoTracks, track]);
    } else if (track.kind === 'audio') {
      setAudioTracks((audioTracks) => [...audioTracks, track]);
    }
  };

  const trackUnsubscribed = (track) => {
    if (track.kind === 'video') {
      setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
    } else if (track.kind === 'audio') {
      setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
    }
  };

  const trackDisabled = (track) => {
    track.on('disabled', () => {
      // replace user video with avatar
    });
  };

  function trackEnabled(track) {
    track.on('enabled', () => {
      // Hide the avatar image and show the associated <video> element.
    });
  }

  return (
    <div>
      <div className='video-wrapper bg-gray-950'>
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className={`video ${me && 'transform -scale-x-1'}`}
        />
        <audio ref={audioRef} autoPlay muted={me} />
      </div>
    </div>
  );
};

export default Participant;
