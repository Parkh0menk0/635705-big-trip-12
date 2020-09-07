import SortView from "../view/sort.js";
import PointEditView from "../view/point-edit.js";
import PoinView from "../view/poin.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import SortedDayView from "../view/day-sorted.js";
import NoPointsView from "../view/no-points.js";
import {render, replace} from "../utils/render.js";
import {ESC_KEY} from "../const.js";
import {SortType} from "../const.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardList = new DayListView();
    this._boardDay = new DayView();
    this._sortComponent = new SortView();
    this._noPointComponent = new NoPointsView();

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
    this._boardList.getElement().innerHTML = ``;
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
      const day = isDefaultSorting ? new DayView(new Date(date), dateIndex + 1) : new SortedDayView();

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
