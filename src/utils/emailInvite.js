export default async function sendInvite(data) {
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
