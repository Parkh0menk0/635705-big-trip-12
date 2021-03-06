import moment from "moment";
import AbstractView from "./abstract.js";
import {EVENT_ACTIVITIES} from '../const';
import he from 'he';

export const createPoinTemplate = (event) => {
  const {type, destination, startDate, endDate, offers = [], cost} = event;

  const formatDate = (date) => {
    const momentDate = moment(date);
    return momentDate.format(`HH:mm`);
  };

  const getDuration = (start, end) => {
    const momentStart = moment(start);
    const momentEnd = moment(end);

    const diff = momentEnd.diff(momentStart);

    const duration = moment.duration(diff);

    const dateParts = [`days`, `hours`, `minutes`];

    let resultString = ``;

    for (let part of dateParts) {
      if (duration[part]() !== 0) {
        resultString = resultString.concat(`${duration[part]()}${(part.substring(0, 1)).toUpperCase()} `);
      }
    }

    return resultString;
  };

  const duration = getDuration(startDate, endDate);

  const createSelectedOffersTemplate = (offersToRender) => {
    if (offersToRender.length === 0) {
      return (`<li class="event__offer"></li>`);
    } else {
      return offersToRender.map((item) => {
        const offerCost = item.cost;
        const offerName = item.name;
        return (
          `<li class="event__offer">
            <span class="event__offer-title">${offerName}</span> &plus;&euro;&nbsp;<span class="event__offer-price">${offerCost}</span>
          </li>`
        );
      }).join(``);
    }
  };

  const selectedOffersToRender = offers.filter((offer) => offer.isChecked).slice(0, 3);

  const selectedOffersTemplate = createSelectedOffersTemplate(selectedOffersToRender);

  const getEventTitle = () => {
    if (EVENT_ACTIVITIES.map((evt) => evt.toLowerCase()).includes(type.toLowerCase())) {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} in ${he.encode(destination)}`;
    } else {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} to ${he.encode(destination)}`;
    }
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getEventTitle()}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${moment(startDate).format()}">${formatDate(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${moment(startDate).format()}">${formatDate(endDate)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffersTemplate}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
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
