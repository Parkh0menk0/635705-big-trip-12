import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATISTIC}">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._siteMenuClickHandler = this._siteMenuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _siteMenuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.value);
  }

  setSiteMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    const menuButtons = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuButtons.forEach((element) => {
      element.addEventListener(`click`, this._siteMenuClickHandler);
    });
  }

  setActiveMenuItem(selected) {
    const menuButtons = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    Array.from(menuButtons)
      .map((item) => {
        item.classList.remove(`trip-tabs__btn--active`);
        return item;
      })
      .map((item) => {
        if (item.dataset.value === selected) {
          item.classList.add(`trip-tabs__btn--active`);
        }
      });
  }

}
