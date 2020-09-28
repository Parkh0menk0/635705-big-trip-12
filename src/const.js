export const ESC_KEY = `Escape`;

export const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const EVENT_VEHICLES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
export const EVENT_ACTIVITIES = [`Check-in`, `Sightseeing`, `Restaurant`];
export const EVENT_TYPES = EVENT_VEHICLES.concat(EVENT_ACTIVITIES);

export const Mode = {
  DEFAULT: `DEFAULT`,
  EDIT: `EDIT`,
  CREATE: `CREATE`
};

export const MenuItem = {
  TABLE: `TABLE`,
  STATISTIC: `STATISTIC`,
};

export const STATE = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};
