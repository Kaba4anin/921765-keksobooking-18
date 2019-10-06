'use strict';

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
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
var MIN_NUMBER = 0;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAX_USERS = 8;
var ENTER_KEYCODE = 13;

var adForm = document.querySelector('.ad-form');
var mapPinMain = document.querySelector('.map__pin--main');
var adFormElement = adForm.querySelectorAll('.ad-form__element');
var address = document.querySelector('#address');
var inputPrice = adForm.querySelector('#price');
var inputTitle = adForm.querySelector('#title');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getSomeIndex = function () {
  return 0.5 - Math.random();
};

var getRandomArray = function (array, min, max) {
  array.sort(getSomeIndex);
  var howMuchFeatures = getRandomNumber(min, max);
  var featuresList = [];

  for (var i = 0; i < howMuchFeatures; i++) {
    featuresList.push(array[i]);
  }
  return featuresList;
};

var getPins = function () {

  var pinsList = [];

  for (var i = 0; i < MAX_USERS; i++) {

    var pin = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: titles[getRandomNumber(MIN_NUMBER, titles.length - 1)],
        address: getRandomNumber(600, 350),
        price: getRandomNumber(1000, 1500),
        rooms: getRandomNumber(1, 3),
        guests: getRandomNumber(1, 10),
        checkin: checkins[getRandomNumber(MIN_NUMBER, checkins.length - 1)],
        checkout: checkins[getRandomNumber(MIN_NUMBER, checkins.length - 1)],
        description: descriptions[getRandomNumber(MIN_NUMBER, descriptions.length - 1)],
        photos: getRandomArray(PLACE_PHOTOS, MIN_NUMBER, PLACE_PHOTOS.length),
        type: PLACE_TYPE[getRandomNumber(MIN_NUMBER, PLACE_TYPE.length - 1)],
        features: getRandomArray(featureses, MIN_NUMBER, featureses.length)
      },
      location: {
        x: getRandomNumber(MIN_NUMBER, map.offsetWidth) - (PIN_WIDTH / 2),
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

  markElement.style.left = pin.location.x + 'px';
  markElement.style.top = pin.location.y + 'px';
  img.src = pin.author.avatar;
  img.alt = pin.offer.title;
  return markElement;
};

var renderCard = function (pin) {
  var newElement = cardTemplate.cloneNode(true);
  var photos = newElement.querySelector('.popup__photos');
  var features = newElement.querySelector('.popup__features');

  var insertPhotos = function (block) {
    block.innerHTML = '';
    for (var i = 0; i < pin.offer.photos.length; i++) {
      block.insertAdjacentHTML('afterbegin', '<img src="' + pin.offer.photos[i] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
    }
  };

  var insertFeatures = function (block) {
    block.innerHTML = '';
    for (var i = 0; i < pin.offer.features.length; i++) {
      block.insertAdjacentHTML('afterbegin', '<li class="popup__feature popup__feature--' + pin.offer.features[i] + '"></li>');
    }
  };

  newElement.querySelector('.popup__title').textContent = pin.offer.title;
  newElement.querySelector('.popup__text--address').textContent = pin.offer.address;
  newElement.querySelector('.popup__text--price').textContent = pin.offer.price + '₽/ночь';
  newElement.querySelector('.popup__type').textContent = pin.offer.type;
  newElement.querySelector('.popup__text--capacity ').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
  newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ' выезд до ' + pin.offer.checkout;
  insertFeatures(features);
  newElement.querySelector('.popup__description').textContent = pin.offer.description;
  newElement.querySelector('.popup__photos > img').src = pin.offer.photos[0];
  insertPhotos(photos);
  newElement.querySelector('.popup__avatar').src = pin.author.avatar;

  return newElement;
};

var getAdverts = function () {
  map.classList.remove('map--faded');
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');

  adFormElement.forEach(function (evt) {
    evt.removeAttribute('disabled');
  });

  var mapPins = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var offers = getPins();
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(getPinElement(offers[i]));
  }
  fragment.appendChild(renderCard(offers[0]));
  mapPins.appendChild(fragment);
  return offers;
};

adFormElement.forEach(function (evt) {
  evt.setAttribute('disabled', 'disabled');
});

address.value = mapPinMain.style.left + ' ' + mapPinMain.style.top;

var mapPinClickHandler = function () {
  getAdverts();
  mapPinMain.removeEventListener('mousedown', mapPinClickHandler);
  mapPinMain.removeEventListener('keydown', mapPinEnterHandler);
};

var mapPinEnterHandler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    getAdverts();
    mapPinMain.removeEventListener('keydown', mapPinEnterHandler);
    mapPinMain.removeEventListener('mousedown', mapPinClickHandler);
  }
};

mapPinMain.addEventListener('mousedown', mapPinClickHandler);
mapPinMain.addEventListener('keydown', mapPinEnterHandler);

inputPrice.addEventListener('input', function () {
  if (inputPrice.validity.rangeOverflow) {
    inputPrice.setCustomValidity('Максимальное значение — 1 000 000');
  } else if (inputPrice.validity.badInput) {
    inputPrice.setCustomValidity('Неправильный формат');
  } else if (inputPrice.validity.valueMissing) {
    inputPrice.setCustomValidity('Обязательное поле');
  } else {
    inputPrice.setCustomValidity('');
  }
});

inputTitle.addEventListener('input', function () {
  if (inputTitle.validity.tooShort) {
    inputTitle.setCustomValidity('Минимальная длина — 30 символов');
  } else if (inputTitle.validity.tooLong) {
    inputTitle.setCustomValidity('Максимальная длина — 100 символов');
  } else if (inputTitle.validity.badInput) {
    inputTitle.setCustomValidity('Неправильный формат');
  } else if (inputTitle.validity.valueMissing) {
    inputTitle.setCustomValidity('Обязательное поле');
  } else {
    inputTitle.setCustomValidity('');
  }
});
