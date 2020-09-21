"use strict";

import RouteInfoView from "./view/route-info.js";
import TripСostView from "./view/trip-cost.js";
import SiteMenuView from "./view/site-menu.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {events} from "./mock/events.js";

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const filterModel = new FilterModel();

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);

render(tripMain, new RouteInfoView(), RenderPosition.AFTERBEGIN);

const tripInfo = header.querySelector(`.trip-info`);

render(tripInfo, new TripСostView());

const tripControls = tripMain.querySelector(`.trip-controls`);

render(tripControls, new SiteMenuView(), RenderPosition.AFTERBEGIN);

const tripEvents = document.querySelector(`.trip-events`);

const boardPresenter = new BoardPresenter(tripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControls, filterModel, pointsModel);

filterPresenter.init();
boardPresenter.init();

const getFullPrice = events.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).value = getFullPrice;

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});
