import SortView from "../view/sort.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import SortedDayView from "../view/day-sorted.js";
import NoPointsView from "../view/no-points.js";
import PointPresenter from "./task.js";
import {render, remove} from "../utils/render.js";
import {SortType, UpdateType, UserAction} from "../const.js";
import {EVENTS_AMOUNT} from "../mock/events.js";

export default class Board {
  constructor(boardContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._currentSortType = SortType.EVENT;
    this._boardContainer = boardContainer;
    this._pointPresenter = Object.create(null);
    this._dayStorage = [];

    this._boardList = new DayListView();
    this._boardDay = null;
    this._sortComponent = null;
    this._noPointComponent = new NoPointsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelPointsChange = this._handleModelPointsChange.bind(this);

    this._pointsModel.addObserver(this._handleModelPointsChange);
  }

  init() {
    this._renderSort();
    render(this._boardContainer, this._boardList);

    if (this._pointsModel.length === 0) {
      console.log(this._pointsModel.length);
      this._renderNoPoints();
      return;
    }

    this._renderPoints(this._getPoints().slice(), this._boardList);
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort((pointA, pointB) => pointB.duration - pointA.duration);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort((pointA, pointB) => pointB.price - pointA.price);
    }

    return this._pointsModel.getPoints();
  }

  _clearBoard({resetRenderedPointCount = false, resetSortType = false} = {}) {
    const pointCount = this._getPoints().length;

    if (pointCount === 0) {
      this._renderNoPoints();
    }

    this._clearPoints();
    this._dayStorage.forEach((day) => remove(day));
    this._dayStorage = [];

    if (resetRenderedPointCount) {
      this._renderedPointCount = EVENTS_AMOUNT;
    } else {
      this._renderedPointCount = Math.min(pointCount, this._renderedPointCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.EVENT;
    }
  }

  _handleModelPointsChange(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[update.id].init(update);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderPoints(this._getPoints().slice(), this._boardList);
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedPointCount: true, resetSortType: true});
        this._renderPoints(this._getPoints().slice(), this._boardList);
        break;
    }
  }

  _clearPoints() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = Object.create(null);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedPointCount: true});
    this._renderPoints(this._getPoints().slice(), this._boardList);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_EVENT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._pointsModel.deletePoint(updateType, update);
        break;
      case UserAction.EDIT_EVENT:
        this._pointsModel.updatePoint(updateType, update);
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardContainer, this._sortComponent);
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointComponent);
  }

  _renderDay(sorting, date, dateIndex) {
    this._boardDay = sorting ? new DayView(new Date(date), dateIndex + 1) : new SortedDayView();
    this._dayStorage.push(this._boardDay);
  }

  _renderPoint(eventList, event) {
    const pointPresenter = new PointPresenter(eventList, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(event);
    this._pointPresenter[event.id] = pointPresenter;
  }

  _renderPoints(events, container) {
    const isDefaultSorting = this._currentSortType === SortType.EVENT;
    const dates = isDefaultSorting ? [...new Set(events.map((item) => new Date(item.startDate).toDateString()))] : [true];

    dates.forEach((date, dateIndex) => {
      this._renderDay(isDefaultSorting, date, dateIndex);

      events.filter((point) => {
        return isDefaultSorting ? new Date(point.startDate).toDateString() === date : point;
      }).forEach((point) => {
        const eventList = this._boardDay.getElement().querySelector(`.trip-events__list`);
        this._renderPoint(eventList, point);
      });

      render(container, this._boardDay);
    });
  }
}
