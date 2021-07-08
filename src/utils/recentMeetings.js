export default async function getRecentMeetings(userId) {
  try {
    const data = await fetch(`/api/user-rooms?userId=${userId}`);
    const jsonData = await data.json();

    return jsonData;
  } catch (e) {
    console.error(e);
  }
}
