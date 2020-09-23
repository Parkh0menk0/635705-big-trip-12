import {getRandomInteger, shuffleArray} from "../utils/common.js";
import {generateId} from "../utils/task.js";
import {EVENT_TYPES, cities} from "../const.js";

const generatEventType = () => {
  return EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length - 1)];
};

const generateDestination = () => {
  return cities[getRandomInteger(0, cities.length - 1)];
};

export const generateOffers = () => {
  const offers = new Map();

  offers
    .set(`Flight`, [
      {name: `Add luggage`, cost: generateCost()},
      {name: `Switch to comfort class`, cost: generateCost()},
      {name: `Add meal`, cost: generateCost()},
      {name: `Choose seats`, cost: generateCost()}
    ])
    .set(`Taxi`, [
      {name: `Switch to comfort class`, cost: generateCost()},
      {name: `Order Uber`, cost: generateCost()}
    ])
    .set(`Train`, [
      {name: `Switch to comfort class`, cost: generateCost()}
    ])
    .set(`Ship`, [
      {name: `Switch to comfort class`, cost: generateCost()}
    ])
    .set(`Check-in`, [
      {name: `Add breakfast`, cost: generateCost()}
    ])
    .set(`Sightseeing`, [
      {name: `Book tickets`, cost: generateCost()},
      {name: `City Tour`, cost: generateCost()},
      {name: `Lunch in city`, cost: generateCost()}
    ])
    .set(`Drive`, [
      {name: `Rent a car`, cost: generateCost()}
    ]);

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

const generatePhoto = () => {
  const takes = getRandomInteger(1, 5);
  let pictures = [];

  for (let i = 0; i < takes; i++) {
    pictures.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return pictures;
};

const generateCost = () => getRandomInteger(10, 100);

export const generateDescriptions = () => {
  const descr = cities.map((city) => {
    return {
      [city]: {
        description: generateDescription(),
        pictures: generatePhoto()
      }
    };
  });

  return new Map(descr.map((item) => {
    return [Object.keys(item)[0], Object.values(item)[0]];
  }));
};

export const generateEvent = () => {
  const type = generatEventType();

  const offers = generateOffers().has(type)
    ? generateOffers().get(type).map((offer) => {

      const {name, cost} = offer;

      return {
        name, cost, isChecked: Boolean(getRandomInteger(0, 1))
      };
    })
    : [];

  const offersSum = offers.filter((offer) => offer.isChecked).reduce((prev, cur) => {
    return prev + cur.cost;
  }, 0);

  const cost = generateCost() + offersSum;
  const destination = generateDestination();

  const startDate = generateDate();
  const endDate = generateDate();

  return {
    isFavourite: Boolean(getRandomInteger(0, 1)),
    id: generateId(),
    type,
    destination,
    startDate: Math.min(startDate, endDate),
    endDate: Math.max(startDate, endDate),
    destinationInfo: generateDescriptions().get(destination),
    cost,
    offers
  };
};
