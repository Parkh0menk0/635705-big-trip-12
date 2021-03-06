import {EVENT_TYPES, EVENT_VEHICLES, EVENT_ACTIVITIES, Mode} from "../const.js";
import moment from "moment";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import he from "he";
import {cloneDeep} from '../utils/common';

export const NEW_EVENT = {
  type: EVENT_TYPES[0],
  destination: ``,
  destinationInfo: null,
  cost: ``,
  offers: [],
  startDate: null,
  endDate: null,
  isFavorite: false
};

const createOffersSelectorTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  const createOfferTemplate = () => {
    return offers.map((offer) => {
      const offerName = offer.name.toLowerCase().replace(/ /g, `_`);
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}" type="checkbox" name="event-offer-${offerName}" ${offer.isChecked ? `checked` : ``} value="${offerName}">
          <label class="event__offer-label" for="event-offer-${offerName}">
            <span class="event__offer-title">${offer.name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.cost}</span>
          </label>
        </div>`
      );
    }).join(``);
  };

  const offersList = createOfferTemplate();

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersList}
      </div>
    </section>`
  );
};

const createDestinationTemplate = (destinationInfo) => {
  if (destinationInfo === null) {
    return false;
  }

  const {description, pictures} = destinationInfo;

  const photosTemplate = () => {
    return pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(` `);
  };

  const photosList = photosTemplate(pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${description}
      </p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosList}
        </div>
      </div>
    </section>`
  );
};

const createEventDetailsTemplate = (offers = [], destinationInfo = null) => {
  if (offers.length === 0 && destinationInfo === null) {
    return ``;
  }

  const offersSelectorTemplate = createOffersSelectorTemplate(offers);
  const descriptionTemplate = createDestinationTemplate(destinationInfo);

  return (
    `<section class="event__details">
      ${offersSelectorTemplate ? offersSelectorTemplate : ``}
      ${descriptionTemplate ? descriptionTemplate : ``}
    </section>`
  );
};

const createEventSelectorTemplate = (type) => {
  const createElementListTemplate = (event) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${event.toLowerCase()}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event.toLowerCase()}" ${event.toLowerCase() === type ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${event.toLowerCase()}" for="event-type-${event.toLowerCase()}">${event}</label>
      </div>
      `
    );
  };

  return (`
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>
        ${EVENT_VEHICLES.map((event) => createElementListTemplate(event)).join(` `)}
      </fieldset>

      <fieldset class="event__type-group">
        <legend class="visually-hidden">Activity</legend>
        ${EVENT_ACTIVITIES.map((event) => createElementListTemplate(event)).join(` `)}
      </fieldset>
    </div>
  </div>`);
};

const createDestinationList = (destinations) => {
  return destinations.map((destination) => {
    return (`
      <option value="${destination.name}"></option>
    `);
  }).join(` `);
};

export const createTripEventItemEditTemplate = (data = {}, destinations, mode) => {
  const {
    type,
    destination,
    destinationInfo,
    cost,
    offers,
    startDate,
    endDate,
    isFavorite,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  const eventSelectorTemplate = createEventSelectorTemplate(type);
  const eventDetailsTemplate = createEventDetailsTemplate(offers, destinationInfo);
  const destinationList = createDestinationList(destinations);
  const startDateFormated = startDate ? moment(startDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);
  const endDateFormated = endDate ? moment(endDate).format(`DD/MM/YY hh:mm`) : moment().format(`DD/MM/YY hh:mm`);

  const placeholder = () => {
    if (EVENT_ACTIVITIES.map((event) => event.toLowerCase()).includes(type.toLowerCase())) {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} in`;
    } else {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} to`;
    }
  };

  return (`<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
      <div class="event__type-wrapper">
        ${eventSelectorTemplate}
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${placeholder()}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination)}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateFormated}" ${isDisabled ? `disabled` : ``}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateFormated}" ${isDisabled ? `disabled` : ``}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${cost}" ${isDisabled ? `disabled` : ``}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
      ${mode === Mode.CREATE ? `<button class="event__reset-btn" type="reset">Cancel</button>` : `<button class="event__reset-btn" ${isDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : `Delete`}</button>`}

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn ${mode === Mode.CREATE ? `visually-hidden` : ``}" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      ${mode === Mode.CREATE ? `` : `<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>`}

    </header>
    ${eventDetailsTemplate}
  </form>`
  );
};

export default class Form extends SmartView {
  constructor(event, offers, destinations, mode) {
    super();
    this._event = event || NEW_EVENT;
    this._offers = offers;
    this._destinations = destinations;
    this._cities = this._destinations.map((destination) => destination.name);

    this._mode = mode || Mode.EDIT;

    this._data = Form.parseEventToData(this._event);

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._startDate = this._event.startDate || new Date();
    this._endDate = this._event.endDate || new Date();

    this._cost = this._event.cost;

    this._saveButton = this.getElement().querySelector(`.event__save-btn`);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._offersSelectorHandler = this._offersSelectorHandler.bind(this);
    this._destinationChoseHandler = this._destinationChoseHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startDateFocusHandler = this._startDateFocusHandler.bind(this);
    this._endDateFocusHandler = this._endDateFocusHandler.bind(this);


    this._setInnerHandlers();

    this._validateForm();
  }

  _setDatePicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    this._datepickerStart = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          defaultDate: this._data.startDate || new Date(),
          onChange: this._startDateFocusHandler || new Date()
        }
    );

    this._datepickerEnd = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          defaultDate: this._data.endDate,
          onChange: this._endDateFocusHandler
        }
    );
  }

  _setInnerHandlers() {
    const tripTypeRadio = this.getElement().querySelectorAll(`.event__type-input`);
    tripTypeRadio.forEach((element) => {
      element.addEventListener(`change`, this._eventTypeChangeHandler);
    });

    const destinationSelector = this.getElement().querySelector(`.event__input--destination`);
    destinationSelector.addEventListener(`change`, this._destinationChoseHandler);

    const priceInput = this.getElement().querySelector(`.event__input--price`);
    priceInput.addEventListener(`input`, this._priceChangeHandler);

    const offersCheckboxes = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offersCheckboxes.forEach((element) => {
      element.addEventListener(`change`, this._offersSelectorHandler);
    });

    this._setDatePicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setRollupBtnClickHandler(this._callback.deleteClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _validateForm() {
    this._saveButton = this.getElement().querySelector(`.event__save-btn`);
    if (!this._isValidPriceInput() || !this._isValidDateRange() || !this._isValidDestination()) {
      this._saveButton.setAttribute(`disabled`, `disabled`);
      return;
    }
    this._saveButton.removeAttribute(`disabled`, `disabled`);
  }

  _isValidDestination() {
    const destinationSelector = this.getElement().querySelector(`.event__input--destination`);

    if (destinationSelector.value === `` || !this._cities.map((city) => city.toLowerCase()).includes(destinationSelector.value.toLowerCase())) {
      return false;
    }

    return true;
  }

  _isValidDateRange() {
    const start = moment(this._startDate);
    const end = moment(this._endDate);

    if (start.isAfter(end, `day`)) {
      return false;
    }
    return true;
  }

  _isValidPriceInput() {
    if (this._data.cost === ``) {
      return false;
    }
    return true;
  }

  _priceChangeHandler(evt) {
    evt.currentTarget.value = evt.currentTarget.value.replace(/[^0-9]/g, ``);
    this._cost = evt.currentTarget.value;
    this._data.cost = this._cost;

    this._validateForm();
  }

  _startDateFocusHandler([date]) {
    this._startDate = date;

    this._validateForm();

    this.updateData({
      startDate: this._startDate,
    }, true);
  }

  _endDateFocusHandler([date]) {
    this._endDate = date;

    this._validateForm();

    this.updateData({
      endDate: this._endDate,
    }, true);
  }

  _offersSelectorHandler(evt) {
    const offerName = evt.target.value.replace(/_/g, ` `);
    const findIndex = this._data.offers.map((offer) => offer.name.toLowerCase()).indexOf(offerName);
    const updatedOffers = cloneDeep(this._data.offers);

    updatedOffers[findIndex].isChecked = evt.target.checked;

    this.updateData({
      offers: updatedOffers
    }, true);
  }

  _eventTypeChangeHandler(evt) {
    const updatedType = evt.target.value;
    const findEventTypeIndex = EVENT_TYPES
      .map((eventType) => eventType.toLowerCase())
      .indexOf(updatedType);

    const typeOffers = this._offers
      .filter((offerType) => offerType.type.toLowerCase() === updatedType.toLowerCase());

    this.updateData({
      type: EVENT_TYPES[findEventTypeIndex],
      offers: typeOffers[0].offers
    });
    this._validateForm();
  }

  reset(event) {
    this.updateData(Form.parseEventToData(event));
  }

  _destinationChoseHandler(evt) {
    const selectedCity = evt.target.value;
    const findIndex = this._cities.indexOf(selectedCity);
    if (findIndex > -1) {
      this.updateData({
        destination: selectedCity,
        destinationInfo: this._destinations[findIndex]
      });
    }
    this._validateForm();
  }

  getTemplate() {
    return createTripEventItemEditTemplate(this._data, this._destinations, this._mode);
  }

  _formSubmitHandler(evt) {
    this._data.startDate = this._startDate;
    this._data.endDate = this._endDate;
    this._cost = this._cost;
    evt.preventDefault();
    this._callback.formSubmit(Form.parseDataToEvent(this._data));
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(evt.target.checked, this._data);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  _rollupBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupBtnClick(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._favoriteClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    let rollupBtn = this.getElement().querySelector(`.event__rollup-btn`);
    if (rollupBtn) {
      rollupBtn.addEventListener(`click`, this._rollupBtnClickHandler);
    }
  }
}
