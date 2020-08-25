import {toISODate, toHoursAndMinutes, durationTime} from "./../utils/task.js";
import AbstractView from "./abstract.js";

const createPoinTemplate = (event) => {
  return (
    `
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.point} to ${event.destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${toISODate(event.startDate)}">${toHoursAndMinutes(event.startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${toISODate(event.endDate)}">${toHoursAndMinutes(event.endDate)}</time>
          </p>
          <p class="event__duration">${durationTime(event.endDate, event.startDate)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${event.offers.map((offer) => (`
            <li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.cost}</span>
            </li>
          `)).slice(0, 3).join(``)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    `
  );
};

export default class Point extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createPoinTemplate(this._event);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

}
