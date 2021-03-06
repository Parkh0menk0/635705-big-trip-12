import AbstractView from "./abstract.js";

export const createRouteInfoTemplate = ({route, duration, cost}) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route.length > 3 ? [route[0], route.slice(-1)].join(` &mdash; &hellip; &mdash; `) : route.join(` &mdash; `)}</h1>

        <p class="trip-info__dates">${duration}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
};

export default class RouteInfo extends AbstractView {
  constructor(routeInfo) {
    super();
    this._routeInfo = routeInfo;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._routeInfo);
  }

}
