'use strict';

(function () {
  var Url = {
    DOWNLOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };
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

  var setupXHRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener('load', function () {
      parseResponse(xhr, onSuccess, onError);
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Проверьте подключение к интернету.');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс.');
    });

    return xhr;
  };


  var load = function (onSuccess, onError) {
    var xhr = setupXHRequest(onSuccess, onError);
    xhr.open('GET', Url.DOWNLOAD);
    xhr.send();
  };

  var upload = function (data, onSuccess, onError) {
    var xhr = setupXHRequest(onSuccess, onError);
    xhr.open('POST', Url.UPLOAD);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: upload
  };
})();
