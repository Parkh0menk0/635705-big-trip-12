import FilterView from '../view/filter.js';
import {render, replace, remove} from '../utils/render.js';
import {UpdateType, FilterType} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._modelChangeHandler = this._modelChangeHandler.bind(this);

    this._filterModel.addObserver(this._modelChangeHandler);
    this._pointsModel.addObserver(this._modelChangeHandler);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    return [FilterType.EVERYTHING, FilterType.FUTURE, FilterType.PAST];
  }

  _filterTypeChangeHandler(filterType) {
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _modelChangeHandler() {
    this.init();
  }
}
