"use strict";

import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createFormTemplate} from "./view/form.js";
import {createWaypointTemplate} from "./view/waypoint.js";
import {createRouteInfoTemplate} from "./view/route-info.js";
import {createDayListTemplate} from "./view/day-list.js";
import {createDayTemplate} from "./view/day.js";
import {createTripСostTemplate} from "./view/trip-cost.js";

const EVENT_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);

render(tripMain, createRouteInfoTemplate(), `afterbegin`);

const tripInfo = header.querySelector(`.trip-info`);

render(tripInfo, createTripСostTemplate());

const tripControls = tripMain.querySelector(`.trip-controls`);

render(tripControls, createSiteMenuTemplate(), `afterbegin`);
render(tripControls, createFilterTemplate());

const main = document.querySelector(`.page-main`);
const tripEvents = main.querySelector(`.trip-events`);

render(tripEvents, createSortTemplate());
render(tripEvents, createFormTemplate());
render(tripEvents, createDayListTemplate());

const tripDays = tripEvents.querySelector(`.trip-days`);

render(tripDays, createDayTemplate());

const tripEventsList = tripDays.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripEventsList, createWaypointTemplate());
}
