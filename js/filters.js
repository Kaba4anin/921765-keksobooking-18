'use strict';

(function () {
  var MAX_PRICE = 50000;
  var MIN_PRICE = 10000;

  var filtersContainer = document.querySelector('.map__filters-container');
  var mapFilters = filtersContainer.querySelector('.map__filters');
  var housingType = filtersContainer.querySelector('#housing-type');
  var housingPrice = filtersContainer.querySelector('#housing-price');
  var housingRooms = filtersContainer.querySelector('#housing-rooms');
  var housingGuests = filtersContainer.querySelector('#housing-guests');
  var housingFeatures = filtersContainer.querySelector('#housing-features');

  var filterType = function (object) {
    return (
      housingType.value === 'any' ||
      object.offer.type === housingType.value
    );
  };

  var filterRooms = function (object) {
    return (
      housingRooms.value === 'any' ||
      object.offer.rooms === parseInt(housingRooms.value, 10)
    );
  };

  var filterGuests = function (object) {
    return (
      housingGuests.value === 'any' ||
      object.offer.guests === parseInt(housingGuests.value, 10)
    );
  };

  var filterPrice = function (object) {
    switch (housingPrice.value) {
      case 'low':
        return (object.offer.price < MIN_PRICE);
      case 'middle':
        return ((object.offer.price >= MIN_PRICE) && (object.offer.price <= MAX_PRICE));
      case 'high':
        return (object.offer.price > MAX_PRICE);
      default:
        return true;
    }
  };

  var filterCheckedFeatures = function () {
    var checkedFeatures = [];
    Array.from(housingFeatures.elements).forEach(function (checkbox) {
      if (checkbox.checked) {
        checkedFeatures.push(checkbox.value);
      }
    });
    return checkedFeatures;
  };

  var containsArray = function (where, what) {
    for (var i = 0; i < what.length; i++) {
      if (where.indexOf(what[i]) < 0) {
        return false;
      }
    }
    return true;
  };

  var filterCheckbox = function (object) {
    var checkedFeatures = filterCheckedFeatures();
    return containsArray(object.offer.features, checkedFeatures);
  };

  var getAllFilters = function (filteredElement) {
    return filteredElement.filter(function (element) {
      return filterType(element) &&
             filterPrice(element) &&
             filterRooms(element) &&
             filterGuests(element) &&
             filterCheckbox(element);
    }).slice(0, window.util.MAX_PINS_COUNT);
  };

  var mapFiltersHandler = window.debounce(function () {
    window.form.removePins();
    window.form.removePopupCards();
    window.map.showPins(getAllFilters(window.map.receivedData));
  });

  mapFilters.addEventListener('change', mapFiltersHandler);
})();
