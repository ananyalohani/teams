export default async function sendInvite(data) {
  // send a POST request to `/api/invite` with invite data
  try {
    await fetch('/api/invite', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error(e);
  }
}
