import AbstractView from './abstract.js';

const createFilterItem = (filter, currentFilterType) => {
  return `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${filter === currentFilterType ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterElement = filterItems.map((filter) => createFilterItem(filter, currentFilterType)).join(``);

  return `<form class="trip-filters" action="#" method="get">
    ${filterElement}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
