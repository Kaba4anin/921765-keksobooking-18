'use strict';

(function () {
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
  var titleInput = document.querySelector('input[name="title"]');
  titleInput.addEventListener('invalid', function () {
    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Минимальная длина заголовка — 30 символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Максимальная длина заголовка — 100 символов');
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Обязательное поле');
    } else {
      titleInput.setCustomValidity('');
    }
  });

  var roomsSelect = document.querySelector('select[name="rooms"]');
  var capacitySelect = document.querySelector('select[name="capacity"]');
  var maxValueMap = {
    '1': 1,
    '2': 2,
    '3': 3,
    '100': 0
  };

  roomsSelect.addEventListener('change', function () {
    var maxValue = maxValueMap[roomsSelect.value];
    if (capacitySelect.value !== maxValue) {
      capacitySelect.value = maxValue;
    }
    if (maxValue === 0) {
      capacitySelect[0].removeAttribute('disabled', '');
      capacitySelect[1].setAttribute('disabled', '');
      capacitySelect[2].setAttribute('disabled', '');
      capacitySelect[3].setAttribute('disabled', '');
    }
    if (maxValue === 1) {
      capacitySelect[0].setAttribute('disabled', '');
      capacitySelect[1].removeAttribute('disabled', '');
      capacitySelect[2].setAttribute('disabled', '');
      capacitySelect[3].setAttribute('disabled', '');
    }
    if (maxValue === 2) {
      capacitySelect[0].setAttribute('disabled', '');
      capacitySelect[1].removeAttribute('disabled', '');
      capacitySelect[2].removeAttribute('disabled', '');
      capacitySelect[3].setAttribute('disabled', '');
    }
    if (maxValue === 3) {
      capacitySelect[0].setAttribute('disabled', '');
      capacitySelect[1].removeAttribute('disabled', '');
      capacitySelect[2].removeAttribute('disabled', '');
      capacitySelect[3].removeAttribute('disabled', '');
    }
  });

  var priceInput = document.querySelector('input[name="price"]');
  var type = document.querySelector('select[name="type"]');
  type.addEventListener('change', function () {
    priceInput.setAttribute('min', window.util.tipeToPrice[type.value]);
    priceInput.placeholder = window.util.tipeToPrice[type.value];
  });

  priceInput.addEventListener('invalid', function () {
    if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Максимальная цена за ночь — 1 000 000 руб.');
    } else if (priceInput.validity.rangeUnderflow) {
      if (type.value === 'bungalo') {
        priceInput.setCustomValidity('Минимальная цена за ночь в бунгало 0 руб.');
      } else if (type.value === 'flat') {
        priceInput.setCustomValidity('Минимальная цена за ночь в квартире 1 000 руб.');
      } else if (type.value === 'house') {
        priceInput.setCustomValidity('Минимальная цена за ночь в доме 5 000 руб.');
      } else if (type.value === 'palace') {
        priceInput.setCustomValidity('Минимальная цена за ночь во дворце 10 000 руб.');
      } else {
        priceInput.setCustomValidity('');
      }
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Обязательное поле');
    } else if (priceInput.validity.typeMismatch) {
      priceInput.setCustomValidity('Введите число');
    } else {
      priceInput.setCustomValidity('');
    }
  });

  var timeIn = document.querySelector('select[name="timein"]');
  var timeOut = document.querySelector('select[name="timeout"]');
  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value;
  });
  timeOut.addEventListener('change', function () {
    timeIn.value = timeOut.value;
  });

  var avatarChooser = document.querySelector('.ad-form__field input[type="file"]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  avatarChooser.addEventListener('change', function () {
    window.loadFiles.setPicture(avatarChooser, true, avatarPreview);
  });
  var photoChooser = document.querySelector('.ad-form__upload input[type="file"]');
  var adFormPhoto = document.querySelector('.ad-form__photo');
  photoChooser.addEventListener('change', function () {
    var photoPreviews = document.createElement('img');
    window.loadFiles.setPicture(photoChooser, false, photoPreviews);
    adFormPhoto.appendChild(photoPreviews);
  });
  var resetPictures = function () {
    avatarPreview.src = DEFAULT_AVATAR;
    var photoPreviews = adFormPhoto.querySelectorAll('img');
    photoPreviews.forEach(function (element, i) {
      photoPreviews[i].remove();
    });
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element, i) {
      pins[i].remove();
    });
  };

  var removePopupCards = function () {
    if (map.querySelector('.popup')) {
      map.removeChild(map.querySelector('.popup'));
      map.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
  };

  var getDisabledFilters = function (array) {
    var filters = array.querySelectorAll('.map__filter');
    filters.forEach(function (element) {
      element.setAttribute('disabled', 'disabled');
    });
  };

  var removeDisabledFilters = function (array) {
    var filters = array.querySelectorAll('.map__filter');
    filters.forEach(function (element) {
      element.removeAttribute('disabled');
    });
  };

  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var pageDisabledClickHandler = function () {
    map.classList.add('map--faded');
    adForm.reset();
    mapFilters.reset();
    adForm.classList.add('ad-form--disabled');
    getDisabledFilters(mapFilters);
    removePins();
    removePopupCards();
    resetPictures();
    window.util.mapPinMain.classList.remove('hidden');
    priceInput.placeholder = 1000;
    window.map.setMainPinCoordinates();
    window.map.getDisabledFieldsets();
    window.util.mapPinMain.style.top = window.util.mainPinStartPositionY;
    window.util.mapPinMain.style.left = window.util.mainPinStartPositionX;
    capacitySelect[0].setAttribute('disabled', '');
    capacitySelect[1].removeAttribute('disabled', '');
    capacitySelect[2].setAttribute('disabled', '');
    capacitySelect[3].setAttribute('disabled', '');
  };

  var formReset = document.querySelector('.ad-form__reset');
  formReset.addEventListener('click', pageDisabledClickHandler);

  var closeMessage = function (message) {
    message.remove();
  };

  var showSuccessMessage = function () {
    var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
    var successMessageElement = successMessageTemplate.cloneNode(true);
    document.querySelector('main').insertAdjacentElement('afterbegin', successMessageElement);
    var successMessage = document.querySelector('.success');
    var closeMessagePressHandler = function (evt) {
      if (evt.keyCode === window.util.escKeycode) {
        closeMessage(successMessage);
        evt.preventDefault();
      }
      document.removeEventListener('keydown', closeMessagePressHandler);
    };
    successMessage.addEventListener('click', function () {
      closeMessage(successMessage);
    });
    document.addEventListener('keydown', closeMessagePressHandler);
  };

  var showErrorMessage = function () {
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorMessageElement = errorMessageTemplate.cloneNode(true);
    document.querySelector('main').insertAdjacentElement('afterbegin', errorMessageElement);
    var errorMessage = document.querySelector('.error');
    errorMessage.addEventListener('click', function () {
      closeMessage(errorMessage);
    });

    errorMessage.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.escKeycode) {
        closeMessage(errorMessage);
        evt.preventDefault();
      }
    });
  };

  var successHandler = function () {
    pageDisabledClickHandler();
    showSuccessMessage();
  };

  var form = document.querySelector('.ad-form');
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), successHandler, showErrorMessage);
  });

  window.form = {
    removePins: removePins,
    removePopupCards: removePopupCards,
    showErrorMessage: showErrorMessage,
    removeDisabledFilters: removeDisabledFilters
  };
})();
