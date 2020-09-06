import AbstractView from "./abstract.js";

const createSortedDayTemplate = () => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info"></div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class SortedDay extends AbstractView {

  getTemplate() {
    return createSortedDayTemplate();
  }

}
