import React, { useState, useEffect, useRef } from 'react';
import {
  IoMicSharp,
  IoMicOffSharp,
  IoVideocamOff,
  IoVideocam,
  IoHandRightSharp,
} from 'react-icons/io5';
import classNames from 'classnames';

import { trackpubsToTracks } from '@/lib/utils';
import { useRoomContext } from '@/context/RoomContext';
import { useSocketContext } from '@/context/SocketContext';
import postNetworkQualityStats from '@/lib/utils/networkQuality';

const Participant = ({ participant, me = false }) => {
  const [participantUser, setParticipantUser] = useState(null); // next-auth `user` object associated with this participant
  const [videoTracks, setVideoTracks] = useState([]); // participant's video tracks
  const [audioTracks, setAudioTracks] = useState([]); // participant's audio tracks
  const [isVideoEnabled, setIsVideoEnabled] = useState(true); // video status
  const [isAudioEnabled, setIsAudioEnabled] = useState(true); // audio status
  const { setScreenTrack, setUserNetQual } = useRoomContext();
  const { findUser, usersRaisedHand, user, roomId } = useSocketContext();

  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    // initialise basic values for the participants
    setParticipantUser(findUser(participant.identity));
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    participant.on('trackSubscribed', (track) => {
      trackDisabled(track);
      trackEnabled(track);
      trackSubscribed(track);
    });

    participant.on('trackUnsubscribed', trackUnsubscribed);

    participant.on('trackPublished', async (remoteTrackPublication) => {
      // when a user publishes a screen track
      while (true) {
        if (remoteTrackPublication.track) break;
        await new Promise((res) => {
          setTimeout(res, 1);
        });
      }
      setScreenTrack(remoteTrackPublication.track);
    });

    participant.on('trackUnpublished', (remoteTrackPublication) => {
      // when a user unpublishes a screen track
      setScreenTrack(null);
    });

    participant.tracks.forEach((publication) => {
      if (publication.track) {
        trackDisabled(publication.track);
        trackEnabled(publication.track);

        publication.track.on('disabled', (track) => trackDisabled(track));
        publication.track.on('enabled', (track) => trackEnabled(track));
      }
    });

    if (me) {
      // set the initial Network Quality Level and statistics
      postNetworkQualityStats(
        roomId,
        participant.identity,
        participant.networkQualityLevel,
        participant.networkQualityStats
      );

      setUserNetQual(participant.networkQualityLevel);

      // set changes to Network Quality Level and statistics
      participant.on('networkQualityLevelChanged', (level, stats) => {
        postNetworkQualityStats(roomId, participant.identity, level, stats);
        if (level) setUserNetQual(level);
        else setUserNetQual(null);
      });
    }

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
    track.on('disabled', (track) => trackDisabled(track));
    track.on('enabled', (track) => trackEnabled(track));
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
      if (track.kind === 'video') {
        setIsVideoEnabled(false);
      }
      if (track.kind === 'audio') {
        setIsAudioEnabled(false);
      }
    });
  };

  function trackEnabled(track) {
    track.on('enabled', () => {
      if (track.kind === 'video') {
        setIsVideoEnabled(true);
      }
      if (track.kind === 'audio') {
        setIsAudioEnabled(true);
      }
    });
  }

  return (
    <div className='participant-video'>
      <div className='video-wrapper'>
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className={classNames('video', { inverted: me })}
        />
      </div>
      <audio ref={audioRef} autoPlay muted={me} />
      <div className='video-label'>
        <p>
          {participantUser && participantUser.name}
          {participantUser && participantUser.id === user.id ? ' (You)' : ''}
        </p>
        <div className='flex flex-row items-center space-x-2'>
          {usersRaisedHand.includes(participant.identity) && (
            <IoHandRightSharp className='text-gray-200 w-4 h-4' />
          )}
          {isAudioEnabled ? (
            <IoMicSharp className='text-gray-200 w-5 h-5' />
          ) : (
            <IoMicOffSharp className='text-gray-200 w-5 h-5' />
          )}
          {isVideoEnabled ? (
            <IoVideocam className='text-gray-200 w-5 h-5' />
          ) : (
            <IoVideocamOff className='text-gray-200 w-5 h-5' />
          )}
        </div>
      </div>
    </div>
  );
};

export default Participant;
