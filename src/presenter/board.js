import SortView from "../view/sort.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import SortedDayView from "../view/day-sorted.js";
import NoPointsView from "../view/no-points.js";
import PointPresenter from "./task.js";
import {updateItem} from "../utils/common.js";
import {render, remove} from "../utils/render.js";
import {SortType} from "../const.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._pointPresenter = Object.create(null);
    this._dayStorage = [];

    this._boardList = new DayListView();
    this._boardDay = null;
    this._sortComponent = new SortView();
    this._noPointComponent = new NoPointsView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();

    this._renderSort();
    render(this._boardContainer, this._boardList);

    if (this._events.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderPoints(this._events, this._boardList);
  }

  _clearPoints() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._dayStorage.forEach((day) => remove(day));
    this._pointPresenter = Object.create(null);
    this._dayStorage = [];
  }

  _handleSortTypeChange(sortType) {
    let sortedPoints = [];
    let isDefaultSorting = false;

    switch (sortType) {
      case SortType.EVENT:
        sortedPoints = this._events.slice();
        isDefaultSorting = true;
        break;
      case SortType.TIME:
        sortedPoints = this._events.slice().sort((pointA, pointB) => pointB.duration - pointA.duration);
        break;
      case SortType.PRICE:
        sortedPoints = this._events.slice().sort((pointA, pointB) => pointB.price - pointA.price);
        break;
    }

    this._clearPoints();

    this._renderPoints(sortedPoints, this._boardList, isDefaultSorting);
  }

  _handlePointChange(updatedPoint) {
    this._events = updateItem(this._events, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointComponent);
  }

  _renderDay(sorting, date, dateIndex) {
    this._boardDay = sorting ? new DayView(new Date(date), dateIndex + 1) : new SortedDayView();
    this._dayStorage.push(this._boardDay);
  }

  _renderPoint(eventList, event) {
    const pointPresenter = new PointPresenter(eventList, this._handlePointChange);
    pointPresenter.init(event);
    this._pointPresenter[event.id] = pointPresenter;
  }

  _renderPoints(events, container, isDefaultSorting = true) {
    const dates = isDefaultSorting ? [...new Set(events.map((item) => new Date(item.startDate).toDateString()))] : [true];

    dates.forEach((date, dateIndex) => {
      this._renderDay(isDefaultSorting, date, dateIndex);

      events.filter((point) => {
        return isDefaultSorting ? new Date(point.startDate.toDateString === date) : point;
      }).forEach((point) => {
        const eventList = this._boardDay.getElement().querySelector(`.trip-events__list`);
        this._renderPoint(eventList, point);
      });

      render(container, this._boardDay);
    });
  }
}
