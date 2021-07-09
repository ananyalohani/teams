export default async function getUsersByRoom(roomId) {
  try {
    const data = await fetch(`/api/rooms?roomId=${roomId}`);
    const jsonData = await data.json();

    return jsonData;
  } catch (e) {
    console.error(e);
  }
}
