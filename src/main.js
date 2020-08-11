"use strict";

import {render, create} from "./utils.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createFormTemplate} from "./view/form.js";
import {createWaypointTemplate} from "./view/waypoint.js";
import {createRouteInfoTemplate} from "./view/route-info.js";
import {createDayListTemplate} from "./view/day-list.js";
import {createDayTemplate} from "./view/day.js";
import {createTripСostTemplate} from "./view/trip-cost.js";
import {createOfferTemplate} from "./view/offer.js";
import {events} from "./mock/events.js";

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);

render(tripMain, createRouteInfoTemplate(events), `afterbegin`);

const tripInfo = header.querySelector(`.trip-info`);

render(tripInfo, createTripСostTemplate());

const tripControls = tripMain.querySelector(`.trip-controls`);

render(tripControls, createSiteMenuTemplate(), `afterbegin`);
render(tripControls, createFilterTemplate());

const tripEvents = document.querySelector(`.trip-events`);

render(tripEvents, createSortTemplate());
render(tripEvents, createFormTemplate(events));
render(tripEvents, createDayListTemplate());

const tripDays = tripEvents.querySelector(`.trip-days`);

const dates = [...new Set(events.map((item) => new Date(item.startDate).toDateString()))];

dates.forEach((date, dateIndex) => {
  const day = create(createDayTemplate(new Date(date), dateIndex + 1));

  events
    .filter((_event) => new Date(_event.startDate.toDateString === date))
    .forEach((_event, eventIndex) => {
      render(day.querySelector(`.trip-events__list`), createWaypointTemplate(_event));
      _event.offers.forEach(offer => render(day.querySelectorAll(`.event__selected-offers`)[eventIndex], createOfferTemplate(offer)));
    });

  render(tripDays, day.parentElement.innerHTML);
});

const getFullPrice = events.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).value = getFullPrice;
