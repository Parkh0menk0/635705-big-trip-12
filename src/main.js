"use strict";

import RouteInfoView from "./view/route-info.js";
import TripСostView from "./view/trip-cost.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import BoardPresenter from "./presenter/board.js";
import PointsModel from './model/points.js';
import {render, RenderPosition} from "./utils/render.js";
import {events} from "./mock/events.js";

const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);

render(tripMain, new RouteInfoView(), RenderPosition.AFTERBEGIN);

const tripInfo = header.querySelector(`.trip-info`);

render(tripInfo, new TripСostView());

const tripControls = tripMain.querySelector(`.trip-controls`);

render(tripControls, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(tripControls, new FilterView());

const tripEvents = document.querySelector(`.trip-events`);

const boardPresenter = new BoardPresenter(tripEvents);

boardPresenter.init(events);

const getFullPrice = events.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).value = getFullPrice;
