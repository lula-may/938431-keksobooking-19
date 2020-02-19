'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var Code = {
    STATUS_OK: 200,
    REQUEST_ERROR: 400,
    NO_AUTHORIZED_ERROR: 401,
    NOT_FOUND_ERROR: 404
  };
  var TIMEOUT_IN_MS = 10000;


  var parseResponse = function (request, onSuccess, onError) {
    switch (request.status) {
      case Code.STATUS_OK:
        onSuccess(request.response);
        break;
      case Code.REQUEST_ERROR:
        onError('Ошибка загрузки данных. Неверный запрос к серверу.');
        break;
      case Code.NO_AUTHORIZED_ERROR:
        onError('Пользователь не авторизован. Требуется авторизация.');
        break;
      case Code.NOT_FOUND_ERROR:
        onError('Ошибка загрузки данных. Сервер не найден.');
        break;
      default:
        onError('Ошибка загрузки данных. Статус ответа: ' + request.status + ' ' + request.statusText);
    }
  };

  var hangUpEventListeners = function (request, onSuccess, onError) {
    request.addEventListener('load', function () {
      parseResponse(request, onSuccess, onError);
    });
    request.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Проверьте подключение к интернету.');
    });
    request.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + request.timeout + 'мс.');
    });
  };

  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_IN_MS;
    hangUpEventListeners(xhr, onSuccess, onError);
    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();
