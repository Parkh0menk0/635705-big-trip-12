import AbstractView from "./abstract.js";

const createDayListTemplate = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class DayList extends AbstractView {

  getTemplate() {
    return createDayListTemplate();
  }

}
