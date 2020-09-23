import {groupBy, range, isEqual, cloneDeep, isNumber} from 'lodash';

export {groupBy, range, isEqual, cloneDeep, isNumber};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const updateItem = (source, updatedItem) => {
  const index = source.findIndex((item) => item.id === updatedItem.id);

  if (index < 0) {
    return source;
  } else {
    source[index] = Object.defineProperties({}, Object.getOwnPropertyDescriptors(updatedItem));
    return source;
  }
};
