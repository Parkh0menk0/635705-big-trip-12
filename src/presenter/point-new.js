import {render, RenderPosition, remove} from "../utils/render.js";
import {NEW_EVENT} from "../view/point-edit.js";
import PointEditView from "../view/point-edit.js";
import {UserAction, UpdateType, ESC_KEY, Mode} from "../const.js";

export default class PointNew {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointEditComponent = null;


    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._isFavoriteClick = this._isFavoriteClick.bind(this);
  }

  init(points, offers, destinations, callback) {
    this._onCloseFormCallback = callback;
    this._point = NEW_EVENT;

    this._pointEditComponent = new PointEditView(this._point, offers, destinations, Mode.CREATE);

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setFavoriteClickHandler(this._isFavoriteClick);

    this._pointEditComponent.getElement().classList.add(`create-event`);

    if (points.length > 0) {
      const tripDaysList = this._pointListContainer.querySelector(`.trip-days`);
      render(tripDaysList, this._pointEditComponent, RenderPosition.BEFOREBEGIN);
    } else {
      render(this._pointListContainer, this._pointEditComponent);
    }

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  resetView() {
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._onCloseFormCallback();
  }

  destroy() {
    this._changeMode();
    this._onCloseFormCallback();
  }

  _handleFormSubmit(point) {
    let updateType = UpdateType.MINOR;

    this._changeData(
        UserAction.ADD_POINT,
        updateType,
        point
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESC_KEY || evt.key === ESC_KEY.slice(0, 3)) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this.destroy();
    }
  }

  _isFavoriteClick(evt, data) {
    let updated = Object.assign({}, data, {isFavorite: evt});
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        updated
    );
  }
}

