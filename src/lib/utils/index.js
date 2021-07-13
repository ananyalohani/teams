import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';

// allowed characters for a room name
export const allowedChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=";

export function validateRoomName(roomName) {
  // validate a room name string
  if (!roomName) return true;
  for (let i = 0; i < roomName.length; i++) {
    if (allowedChars.indexOf(roomName.charAt(i)) === -1) return false;
  }
  return true;
}

export function generateCallID(length = 8) {
  // generates a random id for a room
  const nanoid = customAlphabet(nolookalikes, length);
  return nanoid();
}

export function assignRandomColor(str) {
  // generate colors based on the hashcode of a string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export function formattedDateString(date) {
  // return a formatted datetime string
  const d = new Date(date);
  const time = formatTimeString(d);
  return `${d.toLocaleString().split(',')[0]}, ${time}`;
}

function formatTimeString(date) {
  // returns time of a date object in a readable format
  let hours = date.getHours();
  const suffix = hours % 12 === hours ? 'AM' : 'PM';
  hours = hours % 12 === 0 ? 12 : hours % 12;

  let minutes = date.getMinutes();
  minutes = minutes % 10 === minutes ? '0' + minutes : minutes;

  return `${hours}:${minutes} ${suffix}`;
}

export function formattedTimeString() {
  // returns current time in a readable format
  return formatTimeString(new Date());
}

export function trackpubsToTracks(trackMap) {
  // convert the map of track publications to an array of corresponding tracks
  return Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter((track) => track !== null);
}

export function sortByDate(arr) {
  // sort array by date
  const compare = (a, b) => {
    return new Date(b.date) - new Date(a.date);
  };
  return arr.sort(compare);
}
