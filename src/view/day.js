import moment from "moment";
import AbstractView from "./abstract.js";

const createDayTemplate = (date, count) => {
  const formatedDate = moment(date).format(`MMM DD`);
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${date && count ?
      `<span class="day__counter">${count}</span>
            <time
            class="day__date"
            datetime="${date}"
          >${formatedDate}</time>` : ``}
      </div>
    </li>`
  );
};

export default class Day extends AbstractView {
  constructor(date, count) {
    super();
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._count);
  }

}
