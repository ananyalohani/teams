import { allowedChars } from '@/lib/utils';

module.exports = {
  allowedURLs: ['http://localhost:5100', 'https://ws.msft.lohani.dev'],
  virtualBackgroundImages: {
    beach: '/twilio-video-processor/backgrounds/beach.jpg',
    bokeh: '/twilio-video-processor/backgrounds/bokeh.jpg',
    kitchen: '/twilio-video-processor/backgrounds/kitchen.jpg',
    lobby: '/twilio-video-processor/backgrounds/lobby.jpg',
    office1: '/twilio-video-processor/backgrounds/office1.jpg',
    // office2: '/twilio-video-processor/backgrounds/office2.jpg',
    office3: '/twilio-video-processor/backgrounds/office3.jpg',
    park: '/twilio-video-processor/backgrounds/park.jpg',
    pattern1: '/twilio-video-processor/backgrounds/pattern1.jpg',
    stars1: '/twilio-video-processor/backgrounds/stars1.jpg',
    // stars2: '/twilio-video-processor/backgrounds/stars2.jpg',
    // stars3: '/twilio-video-processor/backgrounds/stars3.jpg',
    sunset: '/twilio-video-processor/backgrounds/sunset.jpg',
  },
  netQualConfig: {
    0: {
      label: 'Broken (Reconnecting)',
      color: 'bg-gray-400',
    },
    1: {
      label: 'Very Poor',
      color: 'bg-red-500',
    },
    2: {
      label: 'Poor',
      color: 'bg-orange-400',
    },
    3: {
      label: 'Average',
      color: 'bg-yellow-300',
    },
    4: {
      label: 'Good',
      color: 'bg-lime-500',
    },
    5: {
      label: 'Excellent',
      color: 'bg-green-500',
    },
  },
  alerts: {
    roomFull: 'This room is full, please join a different room.',
    alreadyInRoom:
      "It looks like you're already in this room. You cannot join the same room twice.",
    invalidRoomName: `Your room name can only contain the following characters: ${allowedChars}`,
    emptyRoomName: 'Please enter a name for your chat room.',
  },
};
