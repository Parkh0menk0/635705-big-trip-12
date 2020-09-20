import moment from "moment";

const MILLISECONDS_IN_DAY = 86340000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MAX_DAYS_IN_MONTH = 31;

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
  const interval = (timeEnd - timeStart);
  const totalMinutes = moment.duration(interval).asMinutes();
  const totalHours = moment.duration(interval).asHours();
  const totalDays = moment.duration(interval).asDays();
  const wholeDays = Math.trunc(totalDays);
  const remainingHours = Math.trunc(totalHours - (wholeDays * HOURS_IN_DAY));

  const wholeDaysAsMinutes = wholeDays * HOURS_IN_DAY * MINUTES_IN_HOUR;
  const remainingHoursAsMinutes = remainingHours * MINUTES_IN_HOUR;
  const remainingMinutes = Math.trunc(Math.ceil(totalMinutes - wholeDaysAsMinutes - remainingHoursAsMinutes));

  if (totalMinutes < MINUTES_IN_HOUR) {
    return moment.utc(interval).format(`mm[m]`);
  }

  if (totalHours < HOURS_IN_DAY) {
    return moment.utc(interval).format(`hh[h] mm[m]`);
  }

  if (totalDays < MAX_DAYS_IN_MONTH) {
    return moment.utc(interval - MILLISECONDS_IN_DAY).format(`DD[D] hh[h] mm[m]`);
  }

  return `${wholeDays}D ${remainingHours}H ${remainingMinutes}M`;
};

export const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};
