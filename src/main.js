"use strict";

import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import PointEditView from "./view/point-edit.js";
import PoinView from "./view/poin.js";
import RouteInfoView from "./view/route-info.js";
import DayListView from "./view/day-list.js";
import DayView from "./view/day.js";
import TripСostView from "./view/trip-cost.js";
import NoPointsView from "./view/no-points.js";
import {render, RenderPosition} from "./utils.js";
import {events} from "./mock/events.js";

const ESC_KEY = `Escape`;

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);

render(tripMain, new RouteInfoView().getElement(), RenderPosition.AFTERBEGIN);

const tripInfo = header.querySelector(`.trip-info`);

render(tripInfo, new TripСostView().getElement());

const tripControls = tripMain.querySelector(`.trip-controls`);

render(tripControls, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(tripControls, new FilterView().getElement());

const tripEvents = document.querySelector(`.trip-events`);

const renderTask = (taskListElement, event) => {
  const eventComponent = new PoinView(event);
  const eventEditComponent = new PointEditView(event);
  const _event = eventComponent.getElement().querySelector(`.event`);
  const _form = eventEditComponent.getElement();

  const replaceCardToForm = () => {
    eventComponent.getElement().replaceChild(_form, _event);
  };

  const replaceFormToCard = () => {
    eventComponent.getElement().replaceChild(_event, _form);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === ESC_KEY || evt.key === ESC_KEY.slice(0, 3)) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, eventComponent.getElement());
};

const renderBoard = (boardContainer, boardPoints) => {
  if (boardPoints == 0) {
    render(boardContainer, new NoPointsView().getElement());
    return;
  } else {
    const dates = [...new Set(boardPoints.map((item) => new Date(item.startDate).toDateString()))];

    render(boardContainer, new SortView().getElement());
    render(boardContainer, new DayListView().getElement());

    const tripDays = boardContainer.querySelector(`.trip-days`);

    dates.forEach((date, dateIndex) => {
      const day = new DayView(new Date(date), dateIndex + 1).getElement();

      boardPoints
        .filter((point) => new Date(point.startDate.toDateString === date))
        .forEach((point) => {
          renderTask(day.querySelector(`.trip-events__list`), point);
        });

      render(tripDays, day);
    });
  }
};

renderBoard(tripEvents, events);

const getFullPrice = events.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).value = getFullPrice;
