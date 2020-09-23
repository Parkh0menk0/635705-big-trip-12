
import "../node_modules/flatpickr/dist/themes/material_blue.css";

import {generateEvent} from "./mock/events.js";
import {render, RenderPosition} from "./utils/render.js";

import SiteMenuView from "./view/site-menu.js";

import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import BoardInfoPresenter from "./presenter/board-info.js";

import PointsModel from "./model/points.js";
import FiltersModel from "./model/filter.js";

const EVENT_COUNT = 20;
const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const filtersModel = new FiltersModel();

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);
const tripControls = header.querySelector(`.trip-controls`);


const boardInfoPresenter = new BoardInfoPresenter(tripMain, pointsModel);
boardInfoPresenter.init(events);

const tripControsElements = [...tripControls.querySelectorAll(`h2`)];

render(tripControsElements[0], new SiteMenuView(), RenderPosition.AFTEREND);

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`);

const boardPresenter = new BoardPresenter(tripEventsContainerElement, pointsModel, filtersModel);
boardPresenter.init();

new FilterPresenter(tripControsElements[1], filtersModel, pointsModel).init();

const newTaskButton = document.querySelector(`.trip-main__event-add-btn`);

newTaskButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
})
