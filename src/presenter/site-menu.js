import {render, remove, RenderPosition} from "../utils/render.js";

import {MenuItem} from "../const.js";

import SiteMenuView from "../view/site-menu.js";
import StatsView from "../view/stats.js";

export default class SiteMenu {
  constructor(menuContainer, tripEventsContainer, pointPresenter, pointsModel) {
    this._menuContainer = menuContainer;
    this._tripEventsContainer = tripEventsContainer;

    this._pointPresenter = pointPresenter;

    this._pointsModel = pointsModel;

    this._filterComponent = null;
    this._statsComponent = null;

    this._siteMenuClickHandler = this._siteMenuClickHandler.bind(this);
  }

  init() {
    this._siteMenuComponent = new SiteMenuView();
    render(this._menuContainer, this._siteMenuComponent, RenderPosition.AFTEREND);

    this._siteMenuComponent.setSiteMenuClickHandler(this._siteMenuClickHandler);
  }

  _siteMenuClickHandler(menuItem) {
    this._siteMenuComponent.setActiveMenuItem(menuItem);
    switch (menuItem) {
      case MenuItem.STATISTIC:
        if (this._statsComponent !== null) {
          remove(this._statsComponent);
          this._statsComponent = null;
        }

        this._statsComponent = new StatsView(this._pointsModel.getPoints());
        render(this._tripEventsContainer, this._statsComponent, RenderPosition.BEFOREEND);
        this._statsComponent.init();
        this._pointPresenter.destroy();
        break;
      case MenuItem.TABLE:
        if (this._statsComponent) {
          remove(this._statsComponent);
          this._statsComponent = null;
        }

        this._pointPresenter.init();
        break;
    }
  }
}
