import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';

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

const colors = {
  rose: '#fb7185',
  pink: '#f472b6',
  fuchsia: '#e879f9',
  purple: '#c084fc',
  violet: '#a78bfa',
  indigo: '#818cf8',
  blue: '#60a5fa',
  lightBlue: '#38bdf8',
  cyan: '#22d3ee',
  teal: '#2dd4bf',
  emerald: '#34d399',
  green: '#4ade80',
  lime: '#a3e635',
  yellow: '#facc15',
  amber: '#fbbf24',
  orange: '#fb923c',
  red: '#f87171',
};

export function assignRandomColor() {
  const i = Math.floor(Math.random() * Object.keys(colors).length);
  const key = Object.keys(colors)[i];
  return colors[key];
}
