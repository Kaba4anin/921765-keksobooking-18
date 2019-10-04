'use strict';

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var filterContainer = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapPins = document.querySelector('.map__pins');
var titles = ['Сдам', 'Не сдам', 'Продам', 'Не продам', 'Сниму', 'Не сниму'];
var PLACE_TYPE = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var checkins = ['12:00', '13:00', '14:00'];
var featureses = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var descriptions = ['Очень даже', 'Неочень даже', 'Даже очень ничего', 'Даже как-то очень', 'Одно из двух'];
var PLACE_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAX_USERS = 8;

map.classList.remove('map--faded');

var getRandomNumber = function (min, max) {
  return min + Math.floor(Math.random() * (max - min));
};

var getRandomArray = function (array) {
  var randomArray = [];
  for (var i = 0; i < getRandomNumber(1, array.length); i++) {
    randomArray[i] = array[getRandomNumber(1, array.length)];
  }
  return randomArray;
};

var getPins = function () {

  var pinsList = [];

  for (var i = 0; i < MAX_USERS; i++) {

    var pin = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: titles[getRandomNumber(0, titles.length - 1)],
        address: location.x + ' ' + location.y,
        price: getRandomNumber(1000, 1500),
        rooms: getRandomNumber(1, 3),
        guests: getRandomNumber(1, 10),
        checkin: checkins[getRandomNumber(0, checkins.length - 1)],
        checkout: checkins[getRandomNumber(0, checkins.length - 1)],
        description: descriptions[getRandomNumber(0, descriptions.length - 1)],
        photos: getRandomArray(PLACE_PHOTOS),
        type: PLACE_TYPE[getRandomNumber(0, PLACE_TYPE.length - 1)],
        features: getRandomArray(featureses)
      },
      location: {
        x: getRandomNumber(0, map.offsetWidth) - (PIN_WIDTH / 2),
        y: getRandomNumber(130, 630) - PIN_HEIGHT
      }
    };
    pinsList.push(pin);
  }
  return pinsList;
};

var getPinElement = function (pin) {
  var markElement = mapPinTemplate.cloneNode(true);
  var img = markElement.querySelector('img');
  img.src = pin.author.avatar;
  img.alt = pin.offer.title;
  markElement.style.left = pin.location.x + 'px';
  markElement.style.top = pin.location.y + 'px';
  return markElement;
};

var renderPins = function () {
  var pins = getPins();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(getPinElement(pins[i]));
  }
  mapPins.appendChild(fragment);
};

renderPins();

var renderCard = function () {
  var newElement = cardTemplate.cloneNode(true);
  var pin = getPins(MAX_USERS);
  newElement.querySelector('.popup__title').textContent = pin[0].offer.title;
  newElement.querySelector('.popup__text--address').textContent = pin[0].offer.adress;
  newElement.querySelector('.popup__text--price').textContent = pin[0].offer.price + '₽/ночь';
  newElement.querySelector('.popup__type').textContent = PLACE_TYPE[pin[0].offer.type];
  newElement.querySelector('.popup__text--capacity').textContent = pin[0].offer.rooms + ' комнаты для ' + pin[0].offer.guests + ' гостей';
  newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin[0].offer.checkin + ', выезд до ' + pin[0].offer.checkout + '.';
  newElement.querySelector('.popup__features').textContent = pin[0].offer.features;
  newElement.querySelector('.popup__description').textContent = pin[0].offer.description;

  newElement.querySelector('.popup__photos').innerHTML = '';
  for (var i = 0; i < pin[0].offer.photos.length; i++) {
    var photoTemplate = document.querySelector('#card').content.querySelector('.popup__photos').querySelector('img');
    var newPhoto = photoTemplate.cloneNode(true);
    newPhoto.src = pin[0].offer.photos[i];
    newElement.querySelector('.popup__photos').appendChild(newPhoto);
  }
  newElement.querySelector('.popup__avatar').src = pin[0].author.avatar;
  return newElement;
};

map.insertBefore(renderCard(), filterContainer);
