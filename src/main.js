"use strict";

import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import FormView from "./view/form.js";
import WaypointView from "./view/waypoint.js";
import RouteInfoView from "./view/route-info.js";
import DayListView from "./view/day-list.js";
import DayView from "./view/day.js";
import TripСostView from "./view/trip-cost.js";
import {render, RenderPosition} from "./utils.js";
import {events} from "./mock/events.js";

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);

render(tripMain, new RouteInfoView().getElement(), RenderPosition.AFTERBEGIN);

const tripInfo = header.querySelector(`.trip-info`);

render(tripInfo, new TripСostView().getElement());

const tripControls = tripMain.querySelector(`.trip-controls`);

render(tripControls, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(tripControls, new FilterView().getElement());

const tripEvents = document.querySelector(`.trip-events`);

render(tripEvents, new SortView().getElement());
render(tripEvents, new DayListView().getElement());

const tripDays = tripEvents.querySelector(`.trip-days`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new WaypointView(task);
  const taskEditComponent = new FormView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  taskComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  taskEditComponent.getElement().querySelector(`.event__save-btn`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(taskListElement, taskComponent.getElement());
};

const dates = [...new Set(events.map((item) => new Date(item.startDate).toDateString()))];

dates.forEach((date, dateIndex) => {
  const day = new DayView(new Date(date), dateIndex + 1).getElement();

  events
    .filter((_event) => new Date(_event.startDate.toDateString === date))
    .forEach((_event) => {
      renderTask(day.querySelector(`.trip-events__list`), _event);
    });

  render(tripDays, day.parentElement);
});

const getFullPrice = events.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).value = getFullPrice;
