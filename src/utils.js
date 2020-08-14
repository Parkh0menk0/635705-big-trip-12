const DAY_IN_MS = 24 * 3600 * 1000;
const HOUR_IN_MS = 3600 * 1000;
const MINUTE_IN_MS = 60 * 1000;

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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

export const toYyyyMmDd = (date) => {
  return `${date.getFullYear()}-${(`0` + (date.getMonth() + 1)).slice(-2)}-${(`0` + date.getDate()).slice(-2)}`;
};

export const toLocaleDate = (date) => {
  return date.toLocaleString(`en-US`, {
    month: `short`,
    day: `2-digit`
  }).toUpperCase();
};

export const toISODate = (date) => {
  const dStr = new Date(date).toISOString();

  return dStr.substring(0, dStr.indexOf(`:`, dStr.indexOf(`:`) + 1))
};

export const toHoursAndMinutes = (date) => {
  const shortTime = [
    `0${new Date(date).getHours()}`,
    `0${new Date(date).getMinutes()}`
  ].map((item) => item.slice(-2));

  return shortTime.join(`:`);
};

export const durationTime = (timeEnd, timeStart) => {
  const duration = (timeEnd - timeStart);
  if (duration < HOUR_IN_MS) {

    return `0${Math.floor(duration / MINUTE_IN_MS)}M`.slice(-3);

  } else if (duration < DAY_IN_MS) {
    const hours = Math.floor(duration / HOUR_IN_MS);
    const minutes = Math.floor((duration - hours * HOUR_IN_MS) / (60 * 1000));
    const stringHours = `0${hours}H`.slice(-3);
    const stringMinutes = `0${minutes}M`.slice(-3);

    return `${stringHours} ${stringMinutes}`;

  } else {
    const days = Math.floor(duration / (DAY_IN_MS));
    const hours = Math.floor((duration - days * DAY_IN_MS) / HOUR_IN_MS);
    const minutes = Math.floor((duration - days * DAY_IN_MS - hours * HOUR_IN_MS) / MINUTE_IN_MS);
    const stringDays = `0${days}D`.slice(-3);
    const stringHours = `0${hours}H`.slice(-3);
    const stringMinutes = `0${minutes}M`.slice(-3);

    return `${stringDays} ${stringHours} ${stringMinutes}`;
  }
};
