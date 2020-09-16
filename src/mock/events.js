import {getRandomInteger, shuffleArray} from "../utils/common.js";
import {cities} from "../const.js";

const EVENTS_AMOUNT = 20;

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generatePoint = () => {
  const points = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeng`, `Restaurant`];
  return points[getRandomInteger(0, points.length - 1)];
};

const generateDestination = () => {
  return cities[getRandomInteger(0, cities.length - 1)];
};

export const generateOffers = (hasChosenOffers = true) => {
  const countOffers = getRandomInteger(0, 5);
  const titles = [`Order Uber`, `Add luggage`, `Rent a car`, `Add breakfast`, `Book tickets`, `Lunch in city`, `Switch to comfort`];
  const offers = new Array(countOffers).fill().map((item) => {
    let i = getRandomInteger(0, titles.length - 1);
    item = {
      title: titles[i],
      type: titles[i].split(` `).slice(-1).join().toLowerCase(),
      cost: getRandomInteger(5, 100),
      isChecked: hasChosenOffers ? Boolean(getRandomInteger(0, 1)) : false
    };
    return item;
  });

  return offers;
};

export const generateDescription = () => {
  const sentences = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat
  eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed
  finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit,
  eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed
  felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `);

  return shuffleArray(sentences).slice(getRandomInteger(1, 4)).join(`. `);
};

const generateDate = () => {
  return (Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * getRandomInteger(0, 60) * 60 * 1000);
};

export const generatePhoto = () => [`http://picsum.photos/248/152?r=${Math.random()}`];

const generateEvent = () => {
  const startDate = generateDate();
  const endDate = generateDate();

  return {
    isFavorite: true,
    id: generateId(),
    point: generatePoint(),
    destination: generateDestination(),
    startDate: Math.min(startDate, endDate),
    endDate: Math.max(startDate, endDate),
    offers: generateOffers(),
    description: generateDescription(),
    photos: generatePhoto(),
    price: getRandomInteger(10, 100),

    get duration() {
      return endDate - startDate;
    }
  };
};

const generateEvents = (amount) => {
  return Array(amount).fill().map(() => generateEvent()).sort((currentEvent, nextEvent) => currentEvent.startDate - nextEvent.startDate);
};

export const events = generateEvents(EVENTS_AMOUNT);
