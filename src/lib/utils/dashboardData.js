async function getRoomsByUser(userId) {
  // fetch the room data by user
  try {
    const data = await fetch(`/api/user-rooms?userId=${userId}`);
    const jsonData = await data.json();

    return jsonData;
  } catch (e) {
    console.error(e);
  }
}

async function getUsersByRoom(roomId) {
  // fetch the user data by room
  try {
    const data = await fetch(`/api/rooms?roomId=${roomId}`);
    const jsonData = await data.json();

    return jsonData;
  } catch (e) {
    console.error(e);
  }
}

export default async function getRecentMeetingData(user, setMeetings) {
  // get recent meetings of user
  try {
    const roomsByUser = await getRoomsByUser(user.id);
    const temp = [];
    const len = await roomsByUser.length;
    return roomsByUser.forEach(async (room) => {
      const usersByRoom = await getUsersByRoom(room.roomId);
      const dict = {
        ...room,
        users: await usersByRoom.filter((u) => u.email !== user.email),
      };

      temp.push(await dict);
      if (len === temp.length) setMeetings(temp);
    });
  } catch (e) {
    console.error(e);
  }
}
