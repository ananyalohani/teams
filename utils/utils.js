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
