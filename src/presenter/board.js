import SortView from "../view/sort.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import PointsListView from "../view/points-list.js";
import NoPointsView from "../view/no-points.js";
import PointPresenter from "./task.js";
import PointNewPresenter from "./point-new.js";
import {render, remove} from "../utils/render.js";
import {SortType, UpdateType, UserAction, FilterType} from "../const.js";
import {groupByDay, sortByDuration, sortByPrice, filter} from "../utils/task.js";

export default class Board {
  constructor(boardContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.EVENT;
    this._boardContainer = boardContainer;
    this._pointPresenter = Object.create(null);
    this._boardList = new DayListView();
    this._sortComponent = new SortView();
    this._noPointComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelPointsChange = this._handleModelPointsChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._boardContainer, this._handleViewAction, this._handleModeChange, this._pointsModel);
  }

  init() {
    this._renderBoard();

    this._pointsModel.addObserver(this._handleModelPointsChange);
    this._filterModel.addObserver(this._handleModelPointsChange);
  }

  destroy() {
    remove(this._sortComponent);

    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    this._clearPoints();
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(onCloseCallback) {
    this._currentSortType = SortType.EVENT;
    this._filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);

    if (this._noPointComponent) {
      remove(this._noPointComponent);
      this._noPointComponent = null;
    }

    const newPointPresenter = this._pointNewPresenter;
    newPointPresenter.init(onCloseCallback);
    this._pointPresenter[`0`] = newPointPresenter;
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.EVENT:
        return filteredPoints;
      case SortType.TIME:
        return filteredPoints.sort(sortByDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => {
        presenter.resetView();
      });
  }

  _handleViewAction(actionType, updateType, updatedPoint) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, updatedPoint);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, updatedPoint);
        break;
    }
  }

  _handleModelPointsChange(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearPoints();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        break;
    }
  }

  _handleSortTypeChange(event) {
    this._currentSortType = event;
    this._clearPoints();
    this._renderBoard();
  }

  _clearPoints() {
    Object.values(this._pointPresenter).forEach((presenter) => {
      presenter.destroy();
    });
    this._pointPresenter = {};
    remove(this._boardList);
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointComponent);
  }

  _renderPoint(eventsListElement, event) {
    const pointPresenter = new PointPresenter(eventsListElement, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(event);
    this._pointPresenter[event.id] = pointPresenter;
  }

  _renderPoints(dayDate, count, events) {
    render(this._boardContainer, this._boardList);
    const boardDay = new DayView(dayDate, count);
    render(this._boardList, boardDay);

    const pointsListComponent = new PointsListView();
    render(boardDay, pointsListComponent);

    events.forEach((event) => {
      this._renderPoint(pointsListComponent, event);
    });
  }

  _renderPointsByDay(eventsGroupedByDay) {
    Object.entries(eventsGroupedByDay).forEach(([day, events], index) => {
      this._renderPoints(day, index + 1, events);
    });
  }

  _renderBoard() {
    const events = this._getPoints();
    const eventsGroupedByDay = groupByDay(events);

    if (this._pointsModel.getPoints().length === 0 && !this._noPointComponent) {
      this._noPointComponent = new NoPointsView();
      this._renderNoPoints();
      remove(this._sortComponent);
      return;
    }

    if (events.length === 0) {
      remove(this._sortComponent);
    }

    if (events.length > 0) {
      if (this._noPointComponent) {
        remove(this._noPointComponent);
        this._noPointComponent = null;
      }

      this._renderSort();

      if (this._currentSortType === SortType.EVENT) {
        this._renderPointsByDay(eventsGroupedByDay);
        return;
      }

      this._renderPoints(null, 0, events);
    }
  }
}
