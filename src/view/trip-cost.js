import AbstractView from "./abstract.js";

const createTripСostTemplate = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`
  );
};

export default class TripСost extends AbstractView {

  getTemplate() {
    return createTripСostTemplate();
  }

}
