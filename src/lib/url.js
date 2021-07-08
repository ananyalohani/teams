module.exports = {
  client:
    process.env.NODE_ENV === 'production'
      ? 'https://msft.lohani.dev'
      : 'http://localhost:3000',
  server: 'https://ws.msft.lohani.dev',
};
