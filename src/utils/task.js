const DAY_IN_MS = 24 * 3600 * 1000;
const HOUR_IN_MS = 3600 * 1000;
const MINUTE_IN_MS = 60 * 1000;

export const toYyyyMmDd = (date) => {
  return `${date.getFullYear()}-${(`0` + (date.getMonth() + 1)).slice(-2)}-${(`0` + date.getDate()).slice(-2)}`;
};

export const toDdMmYy = (date) => {
  return `${(`0` + date.getDate()).slice(-2)}/${(`0` + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear().slice(-2)}`;
};

export const toLocaleDate = (date) => {
  return date.toLocaleString(`en-US`, {
    month: `short`,
    day: `2-digit`
  }).toUpperCase();
};

export const toISODate = (date) => {
  const dStr = new Date(date).toISOString();

  return dStr.substring(0, dStr.indexOf(`:`, dStr.indexOf(`:`) + 1));
};

export const toHoursAndMinutes = (date) => {
  const shortTime = [
    `0${new Date(date).getHours()}`,
    `0${new Date(date).getMinutes()}`
  ].map((item) => item.slice(-2));

  return shortTime.join(`:`);
};

export const toForwardSlashDate = (date) => {
  let d = new Date(date);

  return [
    `0` + d.getDate(),
    `0` + (d.getMonth() + 1),
    `` + d.getFullYear()
  ].map((component) => component.slice(-2)).join(`/`);
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
