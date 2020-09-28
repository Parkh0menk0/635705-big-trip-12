import "../node_modules/flatpickr/dist/themes/material_blue.css";

import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import BoardInfoPresenter from "./presenter/board-info.js";
import SiteMenuPresenter from './presenter/site-menu';

import PointsModel from "./model/points.js";
import FiltersModel from "./model/filter.js";
import DestinationsModel from "./model/destinations";
import OffersModel from "./model/offers";

import {UpdateType} from "./const";

import Api from "./api.js";

const AUTHORIZATION = `Basic mnbvcxzlkjhgfdsap`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);
const tripControls = header.querySelector(`.trip-controls`);

const addNewPointButton = document.querySelector(`.trip-main__event-add-btn`);

const tripControsElements = [...tripControls.querySelectorAll(`h2`)];

const mainContentContainerElemant = document.querySelector(`.page-main`);
const tripEventsContainerElement = mainContentContainerElemant.querySelector(`.trip-events`);

const boardInfoPresenter = new BoardInfoPresenter(tripMain, pointsModel);
const boardPresenter = new BoardPresenter(tripEventsContainerElement, pointsModel, filtersModel, destinationsModel, offersModel, api);
const siteMenuPresenter =  new SiteMenuPresenter(tripControsElements[0], tripEventsContainerElement, boardPresenter, pointsModel);
const filterPresenter =  new FilterPresenter(tripControsElements[1], filtersModel, pointsModel);

boardInfoPresenter.init();
siteMenuPresenter.init();
boardPresenter.init();
filterPresenter.init();

const newPointFormCloseHandler = (evt) => {
  addNewPointButton.removeAttribute(`disabled`);
}

addNewPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint(newPointFormCloseHandler);
  addNewPointButton.setAttribute(`disabled`, `disabled`);
})

api.getPoints().then((points) => {
  pointsModel.setPoints(UpdateType.INIT, points);
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
});

api.getDestinations().then((destinations) => {
  destinationsModel.setDestinations(null, destinations);
})
.catch(() => {
  destinationsModel.setDestinations(UpdateType.INIT, []);
});

api.getOffers().then((offers) => {
  offersModel.setOffers(null, offers);
})
.catch(() => {
  offersModel.setOffers(UpdateType.INIT, []);
});

