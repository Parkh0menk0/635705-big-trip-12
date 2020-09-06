import SortView from "../view/sort.js";
import PointEditView from "../view/point-edit.js";
import PoinView from "../view/poin.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import NoPointsView from "../view/no-points.js";
import {render, replace} from "../utils/render.js";
import {ESC_KEY} from "../const.js";
import {SortType} from "../const.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._currentSortType = SortType.EVENT;

    this._boardListComponent = new DayListView();
    this._sortComponent = new SortView();
    this._noPointComponent = new NoPointsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();

    this._renderSort();
    render(this._boardContainer, this._boardListComponent);

    if (this._events.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderPoints(this._events, this._boardContainer.querySelector(`.trip-days`));
  }

  _sortPoints(sortType) {
    let sortedPoints = [];

    switch (sortType) {
      case SortType.EVENT:
        sortedPoints = this._events.slice();
        break;
      case SortType.TIME:
        sortedPoints = this._events.slice().sort((pointA, pointB) => pointB.duration - pointA.duration);
        break;
      case SortType.PRICE:
        sortedPoints = this._events.slice().sort((pointA, pointB) => pointB.price - pointA.price);
        break;
    }

    this._currentSortType = sortType;

    return sortedPoints;
  }

  _clearPoints() {
    this._boardContainer.querySelector(`.trip-days`).innerHTML = ``;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._clearPoints();
    this._renderPoints(this._sortPoints(sortType), this._boardContainer.querySelector(`.trip-days`));
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointComponent);
  }

  _renderPoints(events, container, isDefaultSorting = true) {
    const dates = isDefaultSorting ? [...new Set(events.map((item) => new Date(item.startDate).toDateString()))] : [true];

    dates.forEach((date, dateIndex) => {
      const day = isDefaultSorting ? new DayView(new Date(date), dateIndex + 1) : new DayView();

      const dayElement = day.getElement();

      events.filter((point) => {
        return isDefaultSorting ? new Date(point.startDate.toDateString === date) : point;
      }).forEach((point) => {
        const newPoint = new PoinView(point);
        const editPoint = new PointEditView(point);

        const onEscKeyDown = (evt) => {
          if (evt.key === ESC_KEY || evt.key === ESC_KEY.slice(0, 3)) {
            evt.preventDefault();
            replaceFormToPoint();
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        const eventList = dayElement.querySelector(`.trip-events__list`);

        const replacePointToForm = () => {
          replace(editPoint, newPoint);
        };

        const replaceFormToPoint = () => {
          replace(newPoint, editPoint);
        };

        newPoint.setClickHandler(() => {
          replacePointToForm();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

        editPoint.setFormSubmitHandler(() => {
          replaceFormToPoint();
          document.removeEventListener(`keydown`, onEscKeyDown);
        });

        render(eventList, newPoint);
      });

      render(container, day);
    });
  }
}
