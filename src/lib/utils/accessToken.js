import url from '@/lib/url';

export default async function getToken(roomId, identity) {
  // fetches an access token for twilio from the server's API
  try {
    const data = await fetch(`${url.server}/video/token`, {
      method: 'POST',
      body: JSON.stringify({
        identity,
        room: roomId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jsonData = await data.json();
    return jsonData.token;
  } catch (e) {
    console.error(e);
    return null;
  }
}
