export const ESC_KEY = `Escape`;

export const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

export const cities = [`Andorra la Vella`, `Athens`, `Belgrade`, `Berlin`, `Bern`, `Bratislava`, `Brussels`, `Bucharest`, `Budapest`,
`Chisinau`, `Copenhagen`, `Dublin`, `Helsinki`, `Kiev`, `Lisbon`, `Ljubljana`, `London`, `Luxembourg`, `Madrid`, `Minsk`, `Monaco`,
`Moscow`, `Nicosia`, `Nuuk`, `Oslo`, `Paris`, `Podgorica`, `Prague`, `Reykjavik`, `Riga`, `Rome`, `San Marino`, `Sarajevo`,
`Skopje`, `Sofia`, `Stockholm`, `Tallinn`, `Tirana`, `Vaduz`, `Valletta`, `Vatican City`, `Vienna`, `Vilnius`, `Warsaw`, `Zagreb`];

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const FilterType = {
  EVERYTHING: `EVERYTHING`,
  FUTURE: `FUTURE`,
  PAST: `PAST`
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => event.startDate > Date.now()),
  [FilterType.PAST]: (events) => events.filter((event) => event.endDate < Date.now())
};
