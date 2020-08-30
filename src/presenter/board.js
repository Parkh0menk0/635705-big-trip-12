import SortView from "../view/sort.js";
import PointEditView from "../view/point-edit.js";
import PoinView from "../view/poin.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import NoPointsView from "../view/no-points.js";
import {render} from "../utils/render.js";
import {ESC_KEY} from "../const.js";

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new DayListView();
    this._sortComponent = new SortView();
    this._noTaskComponent = new NoPointsView();
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);

    this._renderBoard();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent);
  }

  _renderTask(taskListElement, event) {
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

    render(taskListElement, eventComponent);
  }

  _renderTasks(container, date) {
    this._boardTasks
      .filter((point) => new Date(point.startDate.toDateString === date))
      .forEach((point) => this._renderTask(container, point));
  }

  _renderNoTasks() {
    render(this._boardContainer, this._noTaskComponent);
  }

  _renderBoard() {
    const dates = [...new Set(this._boardTasks.map((item) => new Date(item.startDate).toDateString()))];
    const tripDays = this._boardContainer.querySelector(`.trip-days`);

    this._renderSort();

    dates.forEach((date, dateIndex) => {
      const day = new DayView(new Date(date), dateIndex + 1).getElement();
      const eventList = day.querySelector(`.trip-events__list`);

      this._renderTasks(eventList, date);

      render(tripDays, day);
    });
  }
}
