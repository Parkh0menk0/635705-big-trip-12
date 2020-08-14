import {toYyyyMmDd, toLocaleDate} from "./../utils.js";
import {createElement} from "../utils.js";

const createDayTemplate = (date, count) => {
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

export default class Day {
  constructor(date, count) {
    this._date = date;
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
