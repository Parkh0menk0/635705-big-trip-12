import AbstractView from "./abstract.js";
import {FilterType} from "../const.js";


const createFilterTemplate = () => {
  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-${FilterType.EVERYTHING}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.EVERYTHING}" checked>
        <label class="trip-filters__filter-label" for="filter-${FilterType.EVERYTHING}">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-${FilterType.FUTURE}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.FUTURE}">
        <label class="trip-filters__filter-label" for="filter-${FilterType.FUTURE}">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-${FilterType.PAST}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.PAST}">
        <label class="trip-filters__filter-label" for="filter-${FilterType.PAST}">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractView {
  constructor() {
    super();
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;

    const filterRadioButtons = this.getElement().querySelectorAll(`.trip-filters__filter-input`);

    filterRadioButtons.forEach((element) => {
      element.addEventListener(`change`, this._filterTypeChangeHandler);
    });
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    const filter = evt.target.value;
    this._callback.filterTypeChange(filter);
  }
}
