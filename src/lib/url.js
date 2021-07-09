module.exports = {
  client:
    process.env.NODE_ENV === 'production'
      ? 'https://msft.lohani.dev'
      : 'http://localhost:3000',
  server: 'http://localhost:5100',
};
