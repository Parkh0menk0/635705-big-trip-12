import moment from "moment";
import {groupBy} from "./common.js";
import {FilterType} from "../const.js";

export const groupByDay = (events) => {
  return groupBy(events.slice().sort((pointA, pointB) => pointA.endDate > pointB.startDate), (item) => {
    return moment(item.startDate).startOf(`day`).format();
  });
};

export const sortByDuration = (pointA, pointB) => {
  const pointADifference = moment(pointA.endDate).diff(moment(pointA.startDate));
  const pointBDifference = moment(pointB.endDate).diff(moment(pointB.startDate));

  return pointBDifference - pointADifference;
};

export const sortByPrice = (pointA, pointB) => {
  return pointB.cost - pointA.cost;
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const getRouteInfo = (events) => {
  const getDuration = () => {
    const days = Object.keys(events);

    const start = moment(days[0]).format(`MMM DD`);
    const end = moment(days[days.length - 1]).format(`DD`);

    const result = `${start} – ${end}`;

    return result.toUpperCase();
  };

  const getRoutePoints = () => {
    const route = Object.values(events).map((eventsByDay) => {
      return eventsByDay[0].destination;
    });
    return route;
  };

  const getTotalCost = () => {
    // return Object.values(events).reduce((points, point) => points.concat(point)).map((point) => point.cost).reduce((total, amount) => total + amount);
    const totalCost = Object.values(events).reduce((total, amount) => {
      const totalCostyDay = amount.reduce((totalByDay, amountByDay) => {
        return totalByDay + amountByDay.cost;
      }, 0);
      return total + totalCostyDay;
    }, 0);
    return totalCost;
  };

  return {
    route: getRoutePoints(),
    duration: getDuration(),
    cost: getTotalCost()
  };
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => event.startDate > Date.now()),
  [FilterType.PAST]: (events) => events.filter((event) => event.endDate < Date.now())
};
