import FilterView from "../view/filter";
import {render, RenderPosition} from "../utils/render";
import {UpdateType} from "../const";

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
  }

  init() {
    this._filterComponent = new FilterView();
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    render(this._filterContainer, this._filterComponent, RenderPosition.AFTEREND);
  }

  _filterTypeChangeHandler(filterType) {
    this._filterModel.setFilter(UpdateType.MINOR, filterType);
  }

  _modelChangeHandler() {}
}
