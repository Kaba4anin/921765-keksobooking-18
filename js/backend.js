'use strict';

(function () {
  var STATUS_SUCCESS = 200;
  var URL = 'https://js.dump.academy/keksobooking';
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';

  var save = function (data, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        successHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения. Пожалуйста, обновите страницу');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };

  var load = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        successHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 5000;
    xhr.open('GET', URL_DATA);
    xhr.send();
  };

  window.backend = {
    save: save,
    load: load,
  };
})();
