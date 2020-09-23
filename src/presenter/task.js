import PointEditView from "../view/point-edit.js";
import PoinView from "../view/poin.js";
import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType, ESC_KEY, Mode} from "../const.js";

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleClick = this._handleClick.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PoinView(point);
    this._pointEditComponent = new PointEditView(point);

    this._pointComponent.setClickHandler(this._handleClick);
    this._pointEditComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainer.getElement(), this._pointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDIT) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    remove(this._pointListContainer);
  }

  _replaceEventToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDIT;
  }

  _replaceFormToEvent() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _isCostChanged(cost) {
    if (this._point.cost !== cost) {
      return true;
    }
    return false;
  }

  _handleClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(tripEvent) {
    let updateType = UpdateType.PATCH;

    if (this._isCostChanged(tripEvent.cost)) {
      updateType = UpdateType.MINOR;
    }

    this._replaceFormToEvent();
    this._changeData(
        UserAction.UPDATE_POINT,
        updateType,
        tripEvent
    );
  }

  _handleDeleteClick(tripEvent) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        tripEvent
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESC_KEY || evt.key === ESC_KEY.slice(0, 3)) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _handleFavouriteClick(evt, data) {
    let updated = Object.assign({}, data, {isFavourite: evt});
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        updated
    );
  }
}
