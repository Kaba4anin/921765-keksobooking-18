'use strict';

(function () {
  //  Находим координаты главной метки и подставляем их в поле Адрес
  //  Подставляем координаты главной метки в деактивном состоянии в поле Адрес
  window.util.addressInput.removeAttribute('value');
  window.util.addressInput.value = window.util.mapPinMainPositionX + ', ' + window.util.mapPinMainPositionY;

  //  Максимальная координата меток по Х
  var positionXMax = document.querySelector('.map').clientWidth;

  //  Добавляем через DOM-операции fieldset атрибут disabled
  window.util.fieldsets.forEach(function (element, i) {
    window.util.fieldsets[i].setAttribute('disabled', '');
  });

  //  Функция активации страници
  var onPageActive = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
    pins.forEach(function (element, i) {
      pins[i].classList.remove('hidden');
    });
    window.util.fieldsets.forEach(function (element, i) {
      window.util.fieldsets[i].removeAttribute('disabled', '');
    });
    window.util.mapPinMain.removeEventListener('mousedown', onPageActive);
  };

  //  Обработчик активации страницы по клику
  window.util.mapPinMain.addEventListener('mousedown', function () {
    onPageActive();
  });
  //  Обработчик активации страницы по Enter
  window.util.mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.enterKeycode) {
      onPageActive();
    }
  });

  //  Пины. Создаем дом-элемент.
  var getPin = function (object) {
    var similarPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

    var pinElement = similarPinsTemplate.cloneNode(true);
    pinElement.style = 'left: ' + (object.location.x).toString() + 'px; top: ' + (object.location.y).toString() + 'px';
    pinElement.querySelector('img').src = object.author.avatar;
    pinElement.querySelector('img').alt = object.offer.title;

    return pinElement;
  };
  //  Находим шаблон пина и добавляем его на страницу 8 раз.
  var showPins = function (pins) {
    var similarListElement = document.querySelector('.map__pins');
    var fragmentPins = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragmentPins.appendChild(getPin(pins[i]));
    }
    similarListElement.appendChild(fragmentPins);

    return similarListElement;
  };

  var errorHandler = function () {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);

    document.querySelector('main').insertAdjacentElement('afterbegin', errorElement);
  };

  window.load(showPins, errorHandler);

  //  Карточка объявления Popup. Создаем дом-элемент.
  var getAdt = function (object) {
    var adtTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var adtElement = adtTemplate.cloneNode(true);

    adtElement.querySelector('.popup__title').textContent = object.offer.title;
    adtElement.querySelector('.popup__text--address').textContent = object.offer.address;
    adtElement.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
    adtElement.querySelector('.popup__type').textContent = window.util.getTranslateTypes(object.offer.type);
    adtElement.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' ' + window.util.connectNounAndNumbers(object.offer.rooms, window.util.roomsArray) + ' для ' + object.offer.guests + ' ' + window.util.connectNounAndNumbers(object.offer.guests, window.util.guestsArray);
    adtElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    adtElement.querySelector('.popup__features').innerHTML = '';
    adtElement.querySelector('.popup__features').appendChild(window.util.getFeaturesPic(object.offer.features));
    adtElement.querySelector('.popup__description').textContent = object.offer.description;
    adtElement.querySelector('.popup__photos').innerHTML = '';
    adtElement.querySelector('.popup__photos').appendChild(window.util.getPhotos(object.offer.photos));
    adtElement.querySelector('.popup__avatar').src = object.author.avatar;

    return adtElement;
  };
  // Открытие карточки Popup
  var map = document.querySelector('.map');
  var filters = document.querySelector('.map__filters-container');

  // Открытие карточки Popup по клику
  var showCards = function (cards) {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    cards.forEach(function (element, i) {
      mapPins[i].addEventListener('click', function () {
        if (map.querySelector('article') !== null) {
          map.removeChild(map.querySelector('article'));
        }
        map.insertBefore(getAdt(cards[i]), filters);
      });
    });
  };
  window.load(showCards, errorHandler);
  // Открытие карточки Popup по Enter
  var showCardsOnEnter = function (cards) {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    cards.forEach(function (element, i) {
      mapPins[i].addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.enterKeycode) {
          evt.preventDefault();
          if (map.querySelector('article') !== null) {
            map.removeChild(map.querySelector('article'));
          }
          map.insertBefore(getAdt(cards[i]), filters);
        }
      });
    });
  };
  window.load(showCardsOnEnter, errorHandler);

  //  Функция закрытия карточки Popup по Esc
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.util.escKeycode) {
      if (map.querySelector('article') !== null) {
        map.removeChild(map.querySelector('article'));
      }
      return;
    }
  };
  // Закрытие карточки Popup по клику
  map.addEventListener('click', function (evt) {
    if (!evt.target.matches('button[type="button"]')) {
      return;
    }
    map.removeChild(document.querySelector('article'));
    map.removeEventListener('keydown', onPopupEscPress);
  });
  //  Обработчик закрытия карточки Popup по Esc
  document.addEventListener('keydown', onPopupEscPress);

  // Перемещение главной метки по карте
  window.util.mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var getAdress = function (shift) {
      var mapPinMainPositionX = Math.round((window.util.mapPinMain.offsetLeft - (shift ? shift.x : 0)) + (window.util.mainPinWidth / 2));
      var mapPinMainPositionY = Math.round((window.util.mapPinMain.offsetTop - (shift ? shift.y : 0)) + window.util.mainPinActiveHeight);

      window.util.addressInput.removeAttribute('value');
      window.util.addressInput.value = mapPinMainPositionX + ', ' + mapPinMainPositionY;

      return window.util.addressInput.value;
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var getMapPinMainTop = function () {
        var mapPinMainTop = window.util.mapPinMain.offsetTop - shift.y;
        if (mapPinMainTop > (window.util.positionYMax - window.util.mainPinActiveHeight)) {
          mapPinMainTop = (window.util.positionYMax - window.util.mainPinActiveHeight);
        }
        if (mapPinMainTop < (window.util.positionYMin - window.util.mainPinActiveHeight)) {
          mapPinMainTop = (window.util.positionYMin - window.util.mainPinActiveHeight);
        }
        return mapPinMainTop;
      };

      var getMapPinMainLeft = function () {
        var mapPinMainLeft = window.util.mapPinMain.offsetLeft - shift.x;
        if (mapPinMainLeft > (positionXMax - (window.util.mainPinWidth / 2))) {
          mapPinMainLeft = Math.round(positionXMax - (window.util.mainPinWidth / 2));
        }
        if (mapPinMainLeft <= -(window.util.mainPinWidth / 2)) {
          mapPinMainLeft = Math.round(-window.util.mainPinWidth / 2);
        }
        return mapPinMainLeft;
      };


      window.util.mapPinMain.style.top = getMapPinMainTop() + 'px';
      window.util.mapPinMain.style.left = getMapPinMainLeft() + 'px';

      getAdress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      getAdress();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
