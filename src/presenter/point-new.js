import {render, RenderPosition, remove} from "../utils/render";
import {NEW_EVENT} from "../view/point-edit";
import PointEditView from "../view/point-edit";
import {UserAction, UpdateType, ESC_KEY, Mode} from "../const";
import {generateId} from "../utils/task";

export default class EventNew {
  constructor(pointListContainer, changeData, changeMode, pointsModel) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointsModel = pointsModel;

    this._pointEditComponent = null;


    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._isFavouriteClick = this._isFavouriteClick.bind(this);
  }

  init() {
    this._event = NEW_EVENT;

    this._pointEditComponent = new PointEditView(this._event, Mode.CREATE);

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setFavouriteClickHandler(this._isFavouriteClick);

    this._pointEditComponent.getElement().classList.add(`create-event`);

    if (this._pointsModel.getPoints().length > 0) {
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
  }

  destroy() {
    this._changeMode();
  }

  _handleFormSubmit(tripEvent) {
    let updateType = UpdateType.MINOR;

    this._changeData(
        UserAction.ADD_POINT,
        updateType,
        Object.assign({id: generateId()}, tripEvent)
    );
    this.destroy();
  }

  _handleDeleteClick(tripEvent) {
    tripEvent = null;
    this.destroy();
    this._changeData(UserAction.ADD_POINT, UpdateType.MINOR, tripEvent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESC_KEY || evt.key === ESC_KEY.slice(0, 3)) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._event);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this.destroy();
      this._changeData(UserAction.ADD_POINT, UpdateType.MINOR, null);
    }
  }

  _isFavouriteClick(evt, data) {
    let updated = Object.assign({}, data, {isFavourite: evt});
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        updated
    );
  }
}

