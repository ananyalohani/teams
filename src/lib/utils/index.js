import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';

export function generateCallID(length = 8) {
  const nanoid = customAlphabet(nolookalikes, length);
  return nanoid();
}

export function formattedTimeString() {
  const date = new Date();

  let hours = date.getHours();
  const suffix = hours % 12 === hours ? 'AM' : 'PM';
  hours = hours % 12 === 0 ? 12 : hours % 12;

  let minutes = date.getMinutes();
  minutes = minutes % 10 === minutes ? '0' + minutes : minutes;

  return `${hours}:${minutes} ${suffix}`;
}

export function trackpubsToTracks(trackMap) {
  return Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter((track) => track !== null);
}

export function assignRandomColor(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export const allowedChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=";

export function validateRoomName(roomName) {
  for (let i = 0; i < roomName.length; i++) {
    if (allowedChars.indexOf(roomName.charAt(i)) === -1) return false;
  }
  return true;
}
