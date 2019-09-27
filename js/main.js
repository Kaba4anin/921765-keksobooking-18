'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var titles = ['Сдам', 'Не сдам', 'Продам', 'Не продам', 'Сниму', 'Не сниму'];
var types = ['palace', 'bungalo', 'flat', 'house'];
var checkins = ['12:00', '13:00', '14:00'];
var featureses = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var descriptions = ['Очень даже', 'Неочень даже', 'Даже очень ничего', 'Даже как-то очень', 'Одно из двух'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAX_USERS = 8;

var getRandomNumber = function (min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};

var randomNumber = function (number) {
  return number.splice(0, getRandomNumber(1, number.length));
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
        rooms: getRandomNumber(1, 15),
        guests: getRandomNumber(1, 25),
        checkin: checkins[getRandomNumber(0, checkins.length - 1)],
        checkout: checkins[getRandomNumber(0, checkins.length - 1)],
        description: descriptions[getRandomNumber(0, descriptions.length - 1)],
        photos: randomNumber(photos),
        type: types[getRandomNumber(0, types.length - 1)],
        features: randomNumber(featureses)
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
