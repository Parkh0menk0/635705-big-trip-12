import {toISOStringWithoutSecsAndMillisecs, toHoursAndMinutes, durationTime} from "./../utils.js";

export const createWaypointTemplate = (event) => {
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.point} to ${event.destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${toISOStringWithoutSecsAndMillisecs(event.startDate)}">${toHoursAndMinutes(event.startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${toISOStringWithoutSecsAndMillisecs(event.endDate)}">${toHoursAndMinutes(event.endDate)}</time>
          </p>
          <p class="event__duration">${durationTime(event.endDate, event.startDate)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers"></ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
