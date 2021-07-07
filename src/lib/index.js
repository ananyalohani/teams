module.exports = {
  url: {
    client:
      process.env.NODE_ENV === 'production'
        ? 'https://msft.lohani.dev'
        : 'http://localhost:3000',
    server: 'https://ws.msft.lohani.dev',
  },
  colors: {
    rose: '#fb7185',
    pink: '#f472b6',
    fuchsia: '#e879f9',
    purple: '#c084fc',
    violet: '#a78bfa',
    indigo: '#818cf8',
    blue: '#60a5fa',
    lightBlue: '#38bdf8',
    cyan: '#22d3ee',
    teal: '#2dd4bf',
    emerald: '#34d399',
    green: '#4ade80',
    lime: '#a3e635',
    yellow: '#facc15',
    amber: '#fbbf24',
    orange: '#fb923c',
    red: '#f87171',
  },
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
};
