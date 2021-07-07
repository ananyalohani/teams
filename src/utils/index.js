import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import { colors, url } from '@/lib';

export function checkForDuplicates(array, parameter, value) {
  array.map((element) => {
    if (element[parameter] === value) {
      return true;
    }
  });
  return false;
}

export function generateCallID(length = 8) {
  const nanoid = customAlphabet(nolookalikes, length);
  return nanoid();
}

export function formattedTimeString() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours % 12 === hours ? 'AM' : 'PM';
  const timeString = `${hours % 12 === 0 ? 12 : hours % 12}:${
    minutes % 10 === minutes ? `0${minutes}` : minutes
  } ${suffix}`;

  return timeString;
}

export function assignRandomColor() {
  const i = Math.floor(Math.random() * Object.keys(colors).length);
  const key = Object.keys(colors)[i];
  return colors[key];
}

export function trackpubsToTracks(trackMap) {
  return Array.from(trackMap.values())
    .map((publication) => publication.track)
    .filter((track) => track !== null);
}

export async function sendInvite(data) {
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

export async function getToken(roomId, identity) {
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

export function printNetworkQualityStats(
  networkQualityLevel,
  networkQualityStats
) {
  // Print in console the networkQualityLevel using bars
  console.log(
    {
      1: '▃',
      2: '▃▄',
      3: '▃▄▅',
      4: '▃▄▅▆',
      5: '▃▄▅▆▇',
    }[networkQualityLevel] || ''
  );

  if (networkQualityStats) {
    // Print in console the networkQualityStats, which is non-null only if Network Quality
    // verbosity is 2 (moderate) or greater
    console.log('Network Quality statistics:', networkQualityStats);
  }
}
