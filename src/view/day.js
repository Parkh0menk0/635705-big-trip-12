import {toYyyyMmDd, toLocaleDate} from "./../utils.js";

export const createDayTemplate = (date, count) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time
          class="day__date"
          datetime="${toYyyyMmDd(date)}"
        >${toLocaleDate(date)}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};
